import { Router } from 'express';
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from '../src/controllers/opportunities.controller';

const router = Router();

/**
 * @route   GET /api/opportunities
 * @desc    Get all opportunities
 * @access  Public
 */
router.get('/', getAllOpportunities);

/**
 * @route   GET /api/opportunities/:id
 * @desc    Get opportunity by ID
 * @access  Public
 */
router.get('/:id', getOpportunityById);

/**
 * @route   POST /api/opportunities
 * @desc    Create a new opportunity
 * @access  Private (Company/Admin)
 */
router.post('/', createOpportunity);

/**
 * @route   PUT /api/opportunities/:id
 * @desc    Update an existing opportunity
 * @access  Private (Company/Admin)
 */
router.put('/:id', updateOpportunity);

/**
 * @route   DELETE /api/opportunities/:id
 * @desc    Delete an opportunity
 * @access  Private (Company/Admin)
 */
router.delete('/:id', deleteOpportunity);

export default router;
