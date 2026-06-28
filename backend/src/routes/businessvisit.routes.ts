import { Router } from 'express';
import { createBusinessVisit, getAllBusinessVisit, getBusinessVisitById, updateBusinessVisit, deleteBusinessVisit } from '../controllers/businessvisit.controller';

const router = Router();

router.post('/', createBusinessVisit);
router.get('/', getAllBusinessVisit);
router.get('/:id', getBusinessVisitById);
router.put('/:id', updateBusinessVisit);
router.delete('/:id', deleteBusinessVisit);

export default router;
