import { Router } from 'express';
import { createSDHDiary, getAllSDHDiary, getSDHDiaryById, updateSDHDiary, deleteSDHDiary } from '../controllers/sdhdiary.controller';

const router = Router();

router.post('/', createSDHDiary);
router.get('/', getAllSDHDiary);
router.get('/:id', getSDHDiaryById);
router.put('/:id', updateSDHDiary);
router.delete('/:id', deleteSDHDiary);

export default router;
