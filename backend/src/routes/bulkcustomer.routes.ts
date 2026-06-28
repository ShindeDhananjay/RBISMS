import { Router } from 'express';
import { createBulkCustomer, getAllBulkCustomer, getBulkCustomerById, updateBulkCustomer, deleteBulkCustomer } from '../controllers/bulkcustomer.controller';

const router = Router();

router.post('/', createBulkCustomer);
router.get('/', getAllBulkCustomer);
router.get('/:id', getBulkCustomerById);
router.put('/:id', updateBulkCustomer);
router.delete('/:id', deleteBulkCustomer);

export default router;
