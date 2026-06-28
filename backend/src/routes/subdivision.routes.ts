import { Router } from 'express';
import { createSubDivision, getAllSubDivision, getSubDivisionById, updateSubDivision, deleteSubDivision } from '../controllers/subdivision.controller';

const router = Router();

router.post('/', createSubDivision);
router.get('/', getAllSubDivision);
router.get('/:id', getSubDivisionById);
router.put('/:id', updateSubDivision);
router.delete('/:id', deleteSubDivision);

export default router;
