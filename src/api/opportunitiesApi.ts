import type { OpportunityInsert } from '../types/db';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const opportunitiesApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/opportunities`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching all opportunities:', error);
      return { success: false, error: error.message || 'Failed to fetch opportunities' };
    }
  },

  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/opportunities/${id}`);
      if (!response.ok) {
        if (response.status === 404) return { success: true, data: null };
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching opportunity by ID:', error);
      return { success: false, error: error.message || 'Failed to fetch opportunity' };
    }
  },

  getByStatus: async (status: 'ACTIVE' | 'CLOSED' | 'DRAFT') => {
    try {
      const response = await fetch(`${API_URL}/opportunities?status=${status}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching opportunities by status:', error);
      return { success: false, error: error.message || 'Failed to fetch opportunities' };
    }
  },

  getByCompany: async (companyId: string) => {
    try {
      const response = await fetch(`${API_URL}/opportunities?companyId=${companyId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching company opportunities:', error);
      return { success: false, error: error.message || 'Failed to fetch opportunities' };
    }
  },

  create: async (data: OpportunityInsert) => {
    try {
      const response = await fetch(`${API_URL}/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      console.error('Error creating opportunity:', error);
      return { success: false, error: error.message || 'Failed to create opportunity' };
    }
  },

  update: async (id: string, data: Partial<OpportunityInsert>) => {
    try {
      const response = await fetch(`${API_URL}/opportunities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        if (response.status === 404) return { success: false, error: 'Opportunity not found' };
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error updating opportunity:', error);
      return { success: false, error: error.message || 'Failed to update opportunity' };
    }
  },

  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/opportunities/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        if (response.status === 404) return { success: false, error: 'Opportunity not found' };
        if (response.status === 409) return { success: false, error: 'Cannot delete opportunity with existing applications' };
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting opportunity:', error);
      return { success: false, error: error.message || 'Failed to delete opportunity' };
    }
  },

  search: async (searchTerm: string) => {
    try {
      const response = await fetch(`${API_URL}/opportunities/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      console.error('Error searching opportunities:', error);
      return { success: false, error: error.message || 'Search failed' };
    }
  },
};

export async function getOpportunities() {
  const res = await fetch(`${API_URL}/opportunities`);
  return res.json();
}
