import { Request, Response, NextFunction } from 'express';
import AnganwadiSurvey from '../models/AnganwadiSurvey';

export const createAnganwadiSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new AnganwadiSurvey(req.body);
    await newData.save();
    res.status(201).json({ message: 'AnganwadiSurvey created', data: newData });
  } catch (error) { next(error); }
};

export const getAllAnganwadiSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userFilter = (req as any).user && (req as any).user.role !== 'Super Admin' ? { userId: (req as any).user.id } : {};

    const data = await AnganwadiSurvey.find(userFilter);
    res.json({ data });
  } catch (error) { next(error); }
};

export const getAnganwadiSurveyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await AnganwadiSurvey.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateAnganwadiSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await AnganwadiSurvey.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'AnganwadiSurvey updated', data });
  } catch (error) { next(error); }
};

export const deleteAnganwadiSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await AnganwadiSurvey.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'AnganwadiSurvey deleted' });
  } catch (error) { next(error); }
};
