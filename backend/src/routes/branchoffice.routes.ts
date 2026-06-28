import { Router } from 'express';
import { createBranchOffice, getAllBranchOffice, getBranchOfficeById, updateBranchOffice, deleteBranchOffice } from '../controllers/branchoffice.controller';

const router = Router();

router.post('/', createBranchOffice);
router.get('/', getAllBranchOffice);
router.get('/:id', getBranchOfficeById);
router.put('/:id', updateBranchOffice);
router.delete('/:id', deleteBranchOffice);

export default router;
