import { getDataScopeFilter } from '../utils/dataScope';
import { Request, Response } from 'express';
import SDHInspection from '../models/SDHInspection';

export const createSDHInspection = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = new SDHInspection(req.body);
    const savedEntry = await entry.save();
    res.status(201).json({ success: true, data: savedEntry });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllSDHInspection = async (req: Request, res: Response): Promise<void> => {
  try {
    const userFilter = await getDataScopeFilter(req);

    const entries = await SDHInspection.find(userFilter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: entries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSDHInspectionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await SDHInspection.findById(req.params.id);
    if (!entry) { res.status(404).json({ success: false, message: 'Not found' }); return; }
    res.status(200).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSDHInspection = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await SDHInspection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!entry) { res.status(404).json({ success: false, message: 'Not found' }); return; }
    res.status(200).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSDHInspection = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await SDHInspection.findByIdAndDelete(req.params.id);
    if (!entry) { res.status(404).json({ success: false, message: 'Not found' }); return; }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
