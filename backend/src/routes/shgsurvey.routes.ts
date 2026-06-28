import { Router } from 'express';
import { createSHGSurvey, getAllSHGSurvey, getSHGSurveyById, updateSHGSurvey, deleteSHGSurvey } from '../controllers/shgsurvey.controller';

const router = Router();

router.post('/', createSHGSurvey);
router.get('/', getAllSHGSurvey);
router.get('/:id', getSHGSurveyById);
router.put('/:id', updateSHGSurvey);
router.delete('/:id', deleteSHGSurvey);

export default router;
