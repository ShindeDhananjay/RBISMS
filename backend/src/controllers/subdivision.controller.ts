import { Request, Response, NextFunction } from 'express';
import SubDivision from '../models/SubDivision';

export const createSubDivision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new SubDivision(req.body);
    await newData.save();
    res.status(201).json({ message: 'SubDivision created', data: newData });
  } catch (error) { next(error); }
};

export const getAllSubDivision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userFilter = (req as any).user && (req as any).user.role !== 'Super Admin' ? { userId: (req as any).user.id } : {};

    const data = await SubDivision.find(userFilter);
    res.json({ data });
  } catch (error) { next(error); }
};

export const getSubDivisionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await SubDivision.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateSubDivision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await SubDivision.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'SubDivision updated', data });
  } catch (error) { next(error); }
};

export const deleteSubDivision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await SubDivision.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'SubDivision deleted' });
  } catch (error) { next(error); }
};
