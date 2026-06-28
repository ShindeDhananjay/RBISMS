import { Router } from 'express';
import { createSchoolSurvey, getAllSchoolSurvey, getSchoolSurveyById, updateSchoolSurvey, deleteSchoolSurvey } from '../controllers/schoolsurvey.controller';

const router = Router();

router.post('/', createSchoolSurvey);
router.get('/', getAllSchoolSurvey);
router.get('/:id', getSchoolSurveyById);
router.put('/:id', updateSchoolSurvey);
router.delete('/:id', deleteSchoolSurvey);

export default router;
