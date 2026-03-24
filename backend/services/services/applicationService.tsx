import sql from 'mssql';
import { getPool } from '../services/getPool';

export interface ApplicationValidationResult {
  canApply: boolean;
  error?: string;
  requiresProfileCompletion?: boolean;
}

export interface ApplicationData {
  opportunityId: string;
  coverLetter?: string;
}

export class ApplicationService {
  /**
   * Validate if a freelancer can apply to an opportunity
   */
  static async validateApplication(
    opportunityId: string,
    freelancerId: string,
    userRole: string,
  ): Promise<ApplicationValidationResult> {
    try {
      // Check 1: User must be a FREELANCER
      if (userRole !== 'FREELANCER') {
        return {
          canApply: false,
          error: 'Only freelancers can apply to opportunities',
        };
      }

      // Check 2: Get opportunity details and verify status
      const pool = await getPool();
      const opportunityResult = await pool.request()
        .input('opportunityId', sql.NVarChar(255), opportunityId)
        .query('SELECT TOP 1 * FROM opportunities WHERE id = @opportunityId');

      const opportunity = opportunityResult.recordset[0];

      if (!opportunity) {
        return { canApply: false, error: 'Opportunity not found' };
      }

      if (opportunity.status !== 'ACTIVE') {
        return {
          canApply: false,
          error: 'This opportunity is no longer accepting applications',
        };
      }

      // Check 3: Verify freelancer hasn't already applied
      const applicationResult = await pool.request()
        .input('opportunityId', sql.NVarChar(255), opportunityId)
        .input('freelancerId', sql.NVarChar(255), freelancerId)
        .query(`
          SELECT TOP 1 * FROM applications 
          WHERE opportunity_id = @opportunityId AND user_id = @freelancerId
        `);

      const existingApp = applicationResult.recordset[0];

      if (existingApp) {
        return { canApply: false, error: 'You have already applied' };
      }

      // Check 4: Verify freelancer profile completeness
      const profile = await this.checkProfileCompleteness(freelancerId);
      if (!profile.isComplete) {
        return {
          canApply: false,
          error: 'Please complete your profile before applying',
          requiresProfileCompletion: true,
        };
      }

      return { canApply: true };
    } catch (error) {
      console.error('Application validation error:', error);
      return { canApply: false, error: 'Validation failed. Please try again.' };
    }
  }

  /**
   * Check if freelancer profile is complete enough to apply
   */
  private static async checkProfileCompleteness(freelancerId: string): Promise<{
    isComplete: boolean;
    missingFields: string[];
  }> {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('freelancerId', sql.NVarChar(255), freelancerId)
        .query('SELECT TOP 1 name, skills, bio FROM users WHERE id = @freelancerId');

      const user = result.recordset[0];
      const missingFields: string[] = [];

      if (!user) {
        missingFields.push('User not found');
      } else {
        if (!user.name || user.name.trim() === '') missingFields.push('Name');
        if (!user.skills || user.skills.trim() === '') missingFields.push('Skills');
        if (!user.bio || user.bio.trim() === '') missingFields.push('Bio');
      }

      return { isComplete: missingFields.length === 0, missingFields };
    } catch (error) {
      console.error('Error checking profile completeness:', error);
      return { isComplete: false, missingFields: ['Error checking profile'] };
    }
  }

  /**
   * Create an application for an opportunity
   */
  static async createApplication(
    applicationData: ApplicationData,
    freelancerId: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const pool = await getPool();

      // Check if opportunity exists and is active
      const opportunityResult = await pool.request()
        .input('opportunityId', sql.NVarChar(255), applicationData.opportunityId)
        .query('SELECT TOP 1 * FROM opportunities WHERE id = @opportunityId');

      const opportunity = opportunityResult.recordset[0];

      if (!opportunity) {
        return { success: false, error: 'Opportunity not found' };
      }

      if (opportunity.status !== 'ACTIVE') {
        return { success: false, error: 'This opportunity is not accepting applications' };
      }

      // Insert application
      const result = await pool.request()
        .input('opportunityId', sql.NVarChar(255), applicationData.opportunityId)
        .input('freelancerId', sql.NVarChar(255), freelancerId)
        .input('coverLetter', sql.NVarChar(sql.MAX), applicationData.coverLetter || null)
        .query(`
          INSERT INTO applications (opportunity_id, user_id, status, cover_letter, created_at, updated_at) 
          OUTPUT INSERTED.*
          VALUES (@opportunityId, @freelancerId, 'PENDING', @coverLetter, GETDATE(), GETDATE())
        `);

      return { success: true, data: result.recordset[0] };
    } catch (error: any) {
      console.error('Application creation error:', error);

      // Handle duplicate application error (MSSQL error code)
      if (error.number === 2627 || error.number === 2601) {
        return { success: false, error: 'You have already applied to this opportunity' };
      }

      return { success: false, error: 'Failed to create application' };
    }
  }

  /**
   * Get all applications for a freelancer
   */
  static async getFreelancerApplications(freelancerId: string): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
  }> {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('freelancerId', sql.NVarChar(255), freelancerId)
        .query(`
          SELECT a.*, o.title as opportunity_title, o.created_by_id as company_id 
          FROM applications a
          LEFT JOIN opportunities o ON a.opportunity_id = o.id
          WHERE a.user_id = @freelancerId
          ORDER BY a.created_at DESC
        `);

      return { success: true, data: result.recordset };
    } catch (error) {
      console.error('Error fetching freelancer applications:', error);
      return { success: false, error: 'Failed to fetch applications' };
    }
  }

  /**
   * Get all applications for a company's opportunity
   */
  static async getCompanyApplications(opportunityId: string): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
  }> {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('opportunityId', sql.NVarChar(255), opportunityId)
        .query(`
          SELECT a.*, u.name as applicant_name, u.email as applicant_email, u.bio, u.skills
          FROM applications a
          LEFT JOIN users u ON a.user_id = u.id
          WHERE a.opportunity_id = @opportunityId
          ORDER BY a.created_at DESC
        `);

      return { success: true, data: result.recordset };
    } catch (error) {
      console.error('Error fetching company applications:', error);
      return { success: false, error: 'Failed to fetch applications' };
    }
  }

  /**
   * Update application status (for companies)
   */
  static async updateApplicationStatus(
    applicationId: string,
    status: 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN',
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('status', sql.NVarChar(20), status)
        .input('applicationId', sql.NVarChar(255), applicationId)
        .query(`
          UPDATE applications 
          SET status = @status, updated_at = GETDATE() 
          OUTPUT INSERTED.*
          WHERE id = @applicationId
        `);

      if (result.recordset.length === 0) {
        return { success: false, error: 'Application not found' };
      }

      return { success: true, data: result.recordset[0] };
    } catch (error) {
      console.error('Error updating application status:', error);
      return { success: false, error: 'Failed to update application status' };
    }
  }

  /**
   * Withdraw an application (for freelancers)
   */
  static async withdrawApplication(applicationId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return this.updateApplicationStatus(applicationId, 'WITHDRAWN');
  }

  /**
   * Get a single application by ID
   */
  static async getApplicationById(applicationId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('applicationId', sql.NVarChar(255), applicationId)
        .query('SELECT TOP 1 * FROM applications WHERE id = @applicationId');

      const application = result.recordset[0];

      if (!application) {
        return { success: false, error: 'Application not found' };
      }

      return { success: true, data: application };
    } catch (error) {
      console.error('Error fetching application:', error);
      return { success: false, error: 'Failed to fetch application' };
    }
  }

  /**
   * Delete an application (only if status is PENDING)
   */
  static async deleteApplication(applicationId: string, userId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('applicationId', sql.NVarChar(255), applicationId)
        .input('userId', sql.NVarChar(255), userId)
        .query(`
          DELETE FROM applications 
          WHERE id = @applicationId AND user_id = @userId AND status = 'PENDING'
        `);

      if (result.rowsAffected[0] === 0) {
        return { success: false, error: 'Cannot delete this application' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting application:', error);
      return { success: false, error: 'Failed to delete application' };
    }
  }
}
