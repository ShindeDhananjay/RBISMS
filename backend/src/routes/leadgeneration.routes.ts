import { Router } from 'express';
import { createLeadGeneration, getAllLeadGenerations, getLeadGenerationById, updateLeadGeneration, deleteLeadGeneration } from '../controllers/leadgeneration.controller';

const router = Router();

router.post('/', createLeadGeneration);
router.get('/', getAllLeadGenerations);
router.get('/:id', getLeadGenerationById);
router.put('/:id', updateLeadGeneration);
router.delete('/:id', deleteLeadGeneration);

export default router;
