import { Router } from 'express';
import { createParcelMonitoring, getAllParcelMonitorings, getParcelMonitoringById, updateParcelMonitoring, deleteParcelMonitoring } from '../controllers/parcelmonitoring.controller';

const router = Router();

router.post('/', createParcelMonitoring);
router.get('/', getAllParcelMonitorings);
router.get('/:id', getParcelMonitoringById);
router.put('/:id', updateParcelMonitoring);
router.delete('/:id', deleteParcelMonitoring);

export default router;
