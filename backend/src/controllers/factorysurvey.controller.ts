import { getDataScopeFilter } from '../utils/dataScope';
import { Request, Response, NextFunction } from 'express';
import FactorySurvey from '../models/FactorySurvey';

export const createFactorySurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new FactorySurvey(req.body);
    await newData.save();
    res.status(201).json({ message: 'FactorySurvey created', data: newData });
  } catch (error) { next(error); }
};

export const getAllFactorySurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userFilter = await getDataScopeFilter(req);

    const data = await FactorySurvey.find(userFilter);
    res.json({ data });
  } catch (error) { next(error); }
};

export const getFactorySurveyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await FactorySurvey.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateFactorySurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await FactorySurvey.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'FactorySurvey updated', data });
  } catch (error) { next(error); }
};

export const deleteFactorySurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await FactorySurvey.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'FactorySurvey deleted' });
  } catch (error) { next(error); }
};
