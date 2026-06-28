import { Router } from 'express';
import { createSelfHelpGroup, getAllSelfHelpGroups, getSelfHelpGroupById, updateSelfHelpGroup, deleteSelfHelpGroup } from '../controllers/selfhelpgroup.controller';

const router = Router();

router.post('/', createSelfHelpGroup);
router.get('/', getAllSelfHelpGroups);
router.get('/:id', getSelfHelpGroupById);
router.put('/:id', updateSelfHelpGroup);
router.delete('/:id', deleteSelfHelpGroup);

export default router;
