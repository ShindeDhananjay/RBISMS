import { Router } from 'express';
import { createSDHAnnualInspection, getAllSDHAnnualInspections, getSDHAnnualInspectionById, updateSDHAnnualInspection, deleteSDHAnnualInspection } from '../controllers/sdhannualinspection.controller';

const router = Router();

router.post('/', createSDHAnnualInspection);
router.get('/', getAllSDHAnnualInspections);
router.get('/:id', getSDHAnnualInspectionById);
router.put('/:id', updateSDHAnnualInspection);
router.delete('/:id', deleteSDHAnnualInspection);

export default router;
