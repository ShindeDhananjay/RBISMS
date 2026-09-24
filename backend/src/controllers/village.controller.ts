import { getDataScopeFilter } from '../utils/dataScope';
import { Request, Response, NextFunction } from 'express';
import Village from '../models/Village';
import { AuthRequest } from '../middleware/auth';
import { Role } from '../models/User';

export const createVillage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = { ...req.body, createdBy: req.user?.id };
    const newData = new Village(payload);
    await newData.save();
    res.status(201).json({ message: 'Village created', data: newData });
  } catch (error) { next(error); }
};

export const getAllVillage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userFilter = await getDataScopeFilter(req);

    let query: any = {};
    if (req.user?.role === 'User') {
      query.createdBy = req.user.id;
    }
    const data = await Village.find(query);
    res.json({ data });
  } catch (error) { next(error); }
};

export const getVillageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await Village.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateVillage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await Village.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'Village updated', data });
  } catch (error) { next(error); }
};

export const deleteVillage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await Village.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'Village deleted' });
  } catch (error) { next(error); }
};
