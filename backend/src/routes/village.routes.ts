import { Router } from 'express';
import { createVillage, getAllVillage, getVillageById, updateVillage, deleteVillage } from '../controllers/village.controller';

const router = Router();

router.post('/', createVillage);
router.get('/', getAllVillage);
router.get('/:id', getVillageById);
router.put('/:id', updateVillage);
router.delete('/:id', deleteVillage);

export default router;
