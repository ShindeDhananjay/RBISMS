import { getDataScopeFilter } from '../utils/dataScope';
import { Request, Response, NextFunction } from 'express';
import SubOffice from '../models/SubOffice';

export const createSubOffice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newData = new SubOffice(req.body);
    await newData.save();
    res.status(201).json({ message: 'SubOffice created', data: newData });
  } catch (error) { next(error); }
};

export const getAllSubOffice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userFilter = await getDataScopeFilter(req);

    const data = await SubOffice.find(userFilter);
    res.json({ data });
  } catch (error) { next(error); }
};

export const getSubOfficeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await SubOffice.findById(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ data });
  } catch (error) { next(error); }
};

export const updateSubOffice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await SubOffice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'SubOffice updated', data });
  } catch (error) { next(error); }
};

export const deleteSubOffice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await SubOffice.findByIdAndDelete(req.params.id);
    if (!data) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'SubOffice deleted' });
  } catch (error) { next(error); }
};
