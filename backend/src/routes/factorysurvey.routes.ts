import { Router } from 'express';
import { createFactorySurvey, getAllFactorySurvey, getFactorySurveyById, updateFactorySurvey, deleteFactorySurvey } from '../controllers/factorysurvey.controller';

const router = Router();

router.post('/', createFactorySurvey);
router.get('/', getAllFactorySurvey);
router.get('/:id', getFactorySurveyById);
router.put('/:id', updateFactorySurvey);
router.delete('/:id', deleteFactorySurvey);

export default router;
