import { Router } from 'express';
import { createBNPLCustomer, getAllBNPLCustomer, getBNPLCustomerById, updateBNPLCustomer, deleteBNPLCustomer } from '../controllers/bnplcustomer.controller';

const router = Router();

router.post('/', createBNPLCustomer);
router.get('/', getAllBNPLCustomer);
router.get('/:id', getBNPLCustomerById);
router.put('/:id', updateBNPLCustomer);
router.delete('/:id', deleteBNPLCustomer);

export default router;
