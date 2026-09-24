import { getDataScopeFilter } from '../utils/dataScope';
import { Request, Response, NextFunction } from 'express';
import BNPLCustomer from '../models/BNPLCustomer';

export const createBNPLCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new BNPLCustomer(req.body);
    await newData.save();
    res.status(201).json({ message: 'BNPLCustomer created', data: newData });
  } catch (error) { next(error); }
};

export const getAllBNPLCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userFilter = await getDataScopeFilter(req);

    const data = await BNPLCustomer.find(userFilter);
    res.json({ data });
  } catch (error) { next(error); }
};

export const getBNPLCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BNPLCustomer.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateBNPLCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BNPLCustomer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'BNPLCustomer updated', data });
  } catch (error) { next(error); }
};

export const deleteBNPLCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BNPLCustomer.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'BNPLCustomer deleted' });
  } catch (error) { next(error); }
};
