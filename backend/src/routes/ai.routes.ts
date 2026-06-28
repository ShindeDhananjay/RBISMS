import { Router } from 'express';
import { generateScore } from '../controllers/ai.controller';

const router = Router();

router.get('/score/:villageId', generateScore);

export default router;
