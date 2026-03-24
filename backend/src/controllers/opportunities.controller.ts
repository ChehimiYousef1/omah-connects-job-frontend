import type { Request, Response } from 'express'
import { getPool } from '../services/getPool'
import type { OpportunityInsert } from '../types/db'

export const getAllOpportunities = async (_req: Request, res: Response) => {
  try {
    const pool = await getPool()
    const result = await pool.request().query('SELECT * FROM Opportunities')
    res.json({ success: true, data: result.recordset })
  } catch (error) {
    console.error('Error fetching all opportunities:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch opportunities' })
  }
}

export const getOpportunityById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const pool = await getPool()
    const result = await pool.request().input('id', id).query('SELECT * FROM Opportunities WHERE id = @id')
    const opportunity = result.recordset[0] || null
    res.json({ success: true, data: opportunity })
  } catch (error) {
    console.error('Error fetching opportunity by ID:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch opportunity' })
  }
}

export const createOpportunity = async (req: Request, res: Response) => {
  const data: OpportunityInsert = req.body
  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('title', data.title)
      .input('description', data.description)
      .input('status', data.status || 'DRAFT')
      .input('companyId', data.companyId)
      .query(`
        INSERT INTO Opportunities (title, description, status, companyId)
        VALUES (@title, @description, @status, @companyId);
        SELECT SCOPE_IDENTITY() AS id;
      `)
    res.status(201).json({ success: true, data: { id: result.recordset[0].id } })
  } catch (error) {
    console.error('Error creating opportunity:', error)
    res.status(500).json({ success: false, error: 'Failed to create opportunity' })
  }
}

export const updateOpportunity = async (req: Request, res: Response) => {
  const { id } = req.params
  const data: Partial<OpportunityInsert> = req.body
  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('id', id)
      .input('title', data.title || null)
      .input('description', data.description || null)
      .input('status', data.status || null)
      .query(`
        UPDATE Opportunities
        SET
          title = COALESCE(@title, title),
          description = COALESCE(@description, description),
          status = COALESCE(@status, status)
        WHERE id = @id
      `)
    res.json({ success: true })
  } catch (error) {
    console.error('Error updating opportunity:', error)
    res.status(500).json({ success: false, error: 'Failed to update opportunity' })
  }
}

export const deleteOpportunity = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const pool = await getPool()
    await pool.request().input('id', id).query('DELETE FROM Opportunities WHERE id = @id')
    res.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting opportunity:', error)
    res.status(500).json({ success: false, error: 'Failed to delete opportunity' })
  }
}
