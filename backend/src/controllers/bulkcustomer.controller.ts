import { Request, Response, NextFunction } from 'express';
import BulkCustomer from '../models/BulkCustomer';

export const createBulkCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new BulkCustomer(req.body);
    await newData.save();
    res.status(201).json({ message: 'BulkCustomer created', data: newData });
  } catch (error) { next(error); }
};

export const getAllBulkCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userFilter = (req as any).user && (req as any).user.role !== 'Super Admin' ? { userId: (req as any).user.id } : {};

    const data = await BulkCustomer.find(userFilter);
    res.json({ data });
  } catch (error) { next(error); }
};

export const getBulkCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BulkCustomer.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateBulkCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BulkCustomer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'BulkCustomer updated', data });
  } catch (error) { next(error); }
};

export const deleteBulkCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BulkCustomer.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'BulkCustomer deleted' });
  } catch (error) { next(error); }
};
