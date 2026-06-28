import { Router } from 'express';
import { createFranchisee, getAllFranchisees, getFranchiseeById, updateFranchisee, deleteFranchisee } from '../controllers/franchisee.controller';

const router = Router();

router.post('/', createFranchisee);
router.get('/', getAllFranchisees);
router.get('/:id', getFranchiseeById);
router.put('/:id', updateFranchisee);
router.delete('/:id', deleteFranchisee);

export default router;
