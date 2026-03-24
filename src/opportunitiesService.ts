import { query } from './db';

export interface Opportunity {
  Id: number;
  Title: string;
  Description: string;
  Status: string;
  CreatedBy: string;
  CreatedAt: Date;
}

/**
 * Get all opportunities
 */
export async function getAllOpportunities(): Promise<Opportunity[]> {
  const rows = await query('SELECT * FROM Opportunities');
  return rows;
}

/**
 * Create a new opportunity
 */
export async function createOpportunity(data: {
  title: string;
  description: string;
  createdBy: string;
  status?: 'ACTIVE' | 'INACTIVE';
}) {
  const status = data.status || 'ACTIVE';
  const rows = await query(
    `INSERT INTO Opportunities (Title, Description, Status, CreatedBy)
     OUTPUT inserted.*
     VALUES (@title, @description, @status, @createdBy)`,
    {
      title: data.title,
      description: data.description,
      status,
      createdBy: data.createdBy,
    },
  );

  return rows[0]; // return the inserted opportunity
}

/**
 * Delete opportunity by Id
 */
export async function deleteOpportunity(id: number) {
  const rows = await query(
    'DELETE FROM Opportunities WHERE Id = @id',
    { id },
  );
  return rows;
}
