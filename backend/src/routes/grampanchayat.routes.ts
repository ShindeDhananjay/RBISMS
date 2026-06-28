import { Router } from 'express';
import { createGramPanchayat, getAllGramPanchayat, getGramPanchayatById, updateGramPanchayat, deleteGramPanchayat } from '../controllers/grampanchayat.controller';

const router = Router();

router.post('/', createGramPanchayat);
router.get('/', getAllGramPanchayat);
router.get('/:id', getGramPanchayatById);
router.put('/:id', updateGramPanchayat);
router.delete('/:id', deleteGramPanchayat);

export default router;
