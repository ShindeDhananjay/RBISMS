import { Router } from 'express';
import { createAnganwadiSurvey, getAllAnganwadiSurvey, getAnganwadiSurveyById, updateAnganwadiSurvey, deleteAnganwadiSurvey } from '../controllers/anganwadisurvey.controller';

const router = Router();

router.post('/', createAnganwadiSurvey);
router.get('/', getAllAnganwadiSurvey);
router.get('/:id', getAnganwadiSurveyById);
router.put('/:id', updateAnganwadiSurvey);
router.delete('/:id', deleteAnganwadiSurvey);

export default router;
