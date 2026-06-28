import { Request, Response, NextFunction } from 'express';
import GramPanchayat from '../models/GramPanchayat';

export const createGramPanchayat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new GramPanchayat(req.body);
    await newData.save();
    res.status(201).json({ message: 'GramPanchayat created', data: newData });
  } catch (error) { next(error); }
};

export const getAllGramPanchayat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await GramPanchayat.find();
    res.json({ data });
  } catch (error) { next(error); }
};

export const getGramPanchayatById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await GramPanchayat.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateGramPanchayat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await GramPanchayat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'GramPanchayat updated', data });
  } catch (error) { next(error); }
};

export const deleteGramPanchayat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await GramPanchayat.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'GramPanchayat deleted' });
  } catch (error) { next(error); }
};
