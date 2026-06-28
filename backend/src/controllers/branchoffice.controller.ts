import { Request, Response, NextFunction } from 'express';
import BranchOffice from '../models/BranchOffice';

export const createBranchOffice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new BranchOffice(req.body);
    await newData.save();
    res.status(201).json({ message: 'BranchOffice created', data: newData });
  } catch (error) { next(error); }
};

export const getAllBranchOffice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BranchOffice.find();
    res.json({ data });
  } catch (error) { next(error); }
};

export const getBranchOfficeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BranchOffice.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateBranchOffice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BranchOffice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'BranchOffice updated', data });
  } catch (error) { next(error); }
};

export const deleteBranchOffice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BranchOffice.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'BranchOffice deleted' });
  } catch (error) { next(error); }
};
