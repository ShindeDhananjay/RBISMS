import { Router } from 'express';
import { createBankSurvey, getAllBankSurvey, getBankSurveyById, updateBankSurvey, deleteBankSurvey } from '../controllers/banksurvey.controller';

const router = Router();

router.post('/', createBankSurvey);
router.get('/', getAllBankSurvey);
router.get('/:id', getBankSurveyById);
router.put('/:id', updateBankSurvey);
router.delete('/:id', deleteBankSurvey);

export default router;
