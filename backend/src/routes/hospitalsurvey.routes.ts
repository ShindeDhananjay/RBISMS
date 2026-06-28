import { Router } from 'express';
import { createHospitalSurvey, getAllHospitalSurvey, getHospitalSurveyById, updateHospitalSurvey, deleteHospitalSurvey } from '../controllers/hospitalsurvey.controller';

const router = Router();

router.post('/', createHospitalSurvey);
router.get('/', getAllHospitalSurvey);
router.get('/:id', getHospitalSurveyById);
router.put('/:id', updateHospitalSurvey);
router.delete('/:id', deleteHospitalSurvey);

export default router;
