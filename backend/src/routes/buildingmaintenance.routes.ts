import { Router } from 'express';
import { createBuildingMaintenance, getAllBuildingMaintenances, getBuildingMaintenanceById, updateBuildingMaintenance, deleteBuildingMaintenance } from '../controllers/buildingmaintenance.controller';

const router = Router();

router.post('/', createBuildingMaintenance);
router.get('/', getAllBuildingMaintenances);
router.get('/:id', getBuildingMaintenanceById);
router.put('/:id', updateBuildingMaintenance);
router.delete('/:id', deleteBuildingMaintenance);

export default router;
