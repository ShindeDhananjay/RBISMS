import { getDataScopeFilter } from '../utils/dataScope';
import { Request, Response, NextFunction } from 'express';
import SHGSurvey from '../models/SHGSurvey';

export const createSHGSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new SHGSurvey(req.body);
    await newData.save();
    res.status(201).json({ message: 'SHGSurvey created', data: newData });
  } catch (error) { next(error); }
};

export const getAllSHGSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userFilter = await getDataScopeFilter(req);

    const data = await SHGSurvey.find(userFilter);
    res.json({ data });
  } catch (error) { next(error); }
};

export const getSHGSurveyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await SHGSurvey.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateSHGSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await SHGSurvey.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'SHGSurvey updated', data });
  } catch (error) { next(error); }
};

export const deleteSHGSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await SHGSurvey.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'SHGSurvey deleted' });
  } catch (error) { next(error); }
};
