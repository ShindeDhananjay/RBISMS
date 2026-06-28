import { Router } from 'express';
import { createAdmin, getAdmins, getAdminStats, updateAdmin } from '../controllers/admin.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { Role } from '../models/User';

const router = Router();

// Protect all admin routes - Only Super Admins can access
router.use(authenticate);
router.use(authorizeRoles(Role.SUPER_ADMIN));

// Routes
router.post('/users', createAdmin);
router.get('/users', getAdmins);
router.put('/users/:id', updateAdmin);
router.get('/users/:id/stats', getAdminStats);

export default router;
