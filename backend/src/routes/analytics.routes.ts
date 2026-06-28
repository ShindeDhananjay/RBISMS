import { Router } from 'express';
import { getDashboardKPIs, getAnalyticsTrends } from '../controllers/analytics.controller';

const router = Router();

router.get('/dashboard', getDashboardKPIs);
router.get('/trends', getAnalyticsTrends);

export default router;
