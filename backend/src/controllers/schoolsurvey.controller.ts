import { Request, Response, NextFunction } from 'express';
import SchoolSurvey from '../models/SchoolSurvey';

export const createSchoolSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new SchoolSurvey(req.body);
    await newData.save();
    res.status(201).json({ message: 'SchoolSurvey created', data: newData });
  } catch (error) { next(error); }
};

export const getAllSchoolSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userFilter = (req as any).user && (req as any).user.role !== 'Super Admin' ? { userId: (req as any).user.id } : {};

    const data = await SchoolSurvey.find(userFilter);
    res.json({ data });
  } catch (error) { next(error); }
};

export const getSchoolSurveyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await SchoolSurvey.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateSchoolSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await SchoolSurvey.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'SchoolSurvey updated', data });
  } catch (error) { next(error); }
};

export const deleteSchoolSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await SchoolSurvey.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'SchoolSurvey deleted' });
  } catch (error) { next(error); }
};
