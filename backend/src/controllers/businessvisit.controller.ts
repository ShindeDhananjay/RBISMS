import { Request, Response, NextFunction } from 'express';
import BusinessVisit from '../models/BusinessVisit';

export const createBusinessVisit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new BusinessVisit(req.body);
    await newData.save();
    res.status(201).json({ message: 'BusinessVisit created', data: newData });
  } catch (error) { next(error); }
};

export const getAllBusinessVisit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userFilter = (req as any).user && (req as any).user.role !== 'Super Admin' ? { userId: (req as any).user.id } : {};

    const data = await BusinessVisit.find(userFilter);
    res.json({ data });
  } catch (error) { next(error); }
};

export const getBusinessVisitById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BusinessVisit.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateBusinessVisit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BusinessVisit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'BusinessVisit updated', data });
  } catch (error) { next(error); }
};

export const deleteBusinessVisit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BusinessVisit.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'BusinessVisit deleted' });
  } catch (error) { next(error); }
};
