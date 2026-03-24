const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApplicationData {
  opportunity_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  cover_letter?: string;
  resume_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  years_of_experience?: number;
  availability?: string;
}

export interface Application extends ApplicationData {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const ApplicationService = {
  async validateApplication(data: ApplicationData) {
    try {
      // Basic client-side validation
      if (!data.applicant_name || data.applicant_name.trim().length < 2) {
        return { success: false, error: 'Name must be at least 2 characters' };
      }
      
      if (!data.applicant_email || !data.applicant_email.includes('@')) {
        return { success: false, error: 'Valid email is required' };
      }

      if (!data.opportunity_id) {
        return { success: false, error: 'Opportunity ID is required' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Validation error:', error);
      return { success: false, error: error.message };
    }
  },

  async createApplication(data: ApplicationData, userId?: string) {
    try {
      const applicationData = {
        ...data,
        created_by_id: userId,
        status: 'PENDING',
      };

      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create application');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error creating application:', error);
      return { success: false, error: error.message || 'Failed to create application' };
    }
  },

  async getAll() {
    try {
      const response = await fetch(`${API_URL}/applications`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      return { success: false, error: error.message };
    }
  },

  async getById(id: string) {
    try {
      const response = await fetch(`${API_URL}/applications/${id}`);
      if (!response.ok) throw new Error('Failed to fetch application');
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching application:', error);
      return { success: false, error: error.message };
    }
  },

  async getByOpportunity(opportunityId: string) {
    try {
      const response = await fetch(`${API_URL}/applications?opportunityId=${opportunityId}`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      return { success: false, error: error.message };
    }
  },

  async update(id: string, data: Partial<ApplicationData>) {
    try {
      const response = await fetch(`${API_URL}/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update application');
      return await response.json();
    } catch (error: any) {
      console.error('Error updating application:', error);
      return { success: false, error: error.message };
    }
  },

  async delete(id: string) {
    try {
      const response = await fetch(`${API_URL}/applications/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete application');
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting application:', error);
      return { success: false, error: error.message };
    }
  },
};

// Also export as default for flexibility
export default ApplicationService;
