import { getDataScopeFilter } from '../utils/dataScope';
import { Request, Response, NextFunction } from 'express';
import HospitalSurvey from '../models/HospitalSurvey';

export const createHospitalSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new HospitalSurvey(req.body);
    await newData.save();
    res.status(201).json({ message: 'HospitalSurvey created', data: newData });
  } catch (error) { next(error); }
};

export const getAllHospitalSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userFilter = await getDataScopeFilter(req);

    const data = await HospitalSurvey.find(userFilter);
    res.json({ data });
  } catch (error) { next(error); }
};

export const getHospitalSurveyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await HospitalSurvey.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateHospitalSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await HospitalSurvey.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'HospitalSurvey updated', data });
  } catch (error) { next(error); }
};

export const deleteHospitalSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await HospitalSurvey.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'HospitalSurvey deleted' });
  } catch (error) { next(error); }
};
