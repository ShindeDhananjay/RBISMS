import { Router } from 'express';
import { createMailOverseerVisit, getAllMailOverseerVisits, getMailOverseerVisitById, updateMailOverseerVisit, deleteMailOverseerVisit } from '../controllers/mailoverseervisit.controller';

const router = Router();

router.post('/', createMailOverseerVisit);
router.get('/', getAllMailOverseerVisits);
router.get('/:id', getMailOverseerVisitById);
router.put('/:id', updateMailOverseerVisit);
router.delete('/:id', deleteMailOverseerVisit);

export default router;
