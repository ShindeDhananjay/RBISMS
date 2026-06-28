import { Router } from 'express';
import { createInstituteMSME, getAllInstituteMSMEs, getInstituteMSMEById, updateInstituteMSME, deleteInstituteMSME } from '../controllers/institutemsme.controller';

const router = Router();

router.post('/', createInstituteMSME);
router.get('/', getAllInstituteMSMEs);
router.get('/:id', getInstituteMSMEById);
router.put('/:id', updateInstituteMSME);
router.delete('/:id', deleteInstituteMSME);

export default router;
