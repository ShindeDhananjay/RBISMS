import { Router } from 'express';
import { createSDHInspection, getAllSDHInspection, getSDHInspectionById, updateSDHInspection, deleteSDHInspection } from '../controllers/sdhinspection.controller';

const router = Router();

router.post('/', createSDHInspection);
router.get('/', getAllSDHInspection);
router.get('/:id', getSDHInspectionById);
router.put('/:id', updateSDHInspection);
router.delete('/:id', deleteSDHInspection);

export default router;
