import { Router } from 'express';
import { createEmployee, getEmployees, updateEmployee, deleteEmployee } from '../controllers/employee.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { Role } from '../models/User';

const router = Router();

// Protect routes - Only Super Admin and Admin can manage employees
router.use(authenticate);
router.use(authorizeRoles(Role.SUPER_ADMIN, Role.ADMIN));

router.post('/', createEmployee);
router.get('/', getEmployees);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
