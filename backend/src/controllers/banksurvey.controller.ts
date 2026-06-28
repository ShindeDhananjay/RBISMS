import { Request, Response, NextFunction } from 'express';
import BankSurvey from '../models/BankSurvey';

export const createBankSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new BankSurvey(req.body);
    await newData.save();
    res.status(201).json({ message: 'BankSurvey created', data: newData });
  } catch (error) { next(error); }
};

export const getAllBankSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BankSurvey.find();
    res.json({ data });
  } catch (error) { next(error); }
};

export const getBankSurveyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BankSurvey.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateBankSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BankSurvey.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'BankSurvey updated', data });
  } catch (error) { next(error); }
};

export const deleteBankSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await BankSurvey.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'BankSurvey deleted' });
  } catch (error) { next(error); }
};
