import { Router } from 'express';
import { createSubOffice, getAllSubOffice, getSubOfficeById, updateSubOffice, deleteSubOffice } from '../controllers/suboffice.controller';

const router = Router();

router.post('/', createSubOffice);
router.get('/', getAllSubOffice);
router.get('/:id', getSubOfficeById);
router.put('/:id', updateSubOffice);
router.delete('/:id', deleteSubOffice);

export default router;
