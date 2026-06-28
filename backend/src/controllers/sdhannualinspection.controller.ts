import { Request, Response } from 'express';
import SDHAnnualInspection from '../models/SDHAnnualInspection';

export const createSDHAnnualInspection = async (req: Request, res: Response) => {
  try {
    const entry = new SDHAnnualInspection(req.body);
    await entry.save();
    res.status(201).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllSDHAnnualInspections = async (req: Request, res: Response) => {
  try {
    const entries = await SDHAnnualInspection.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: entries });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSDHAnnualInspectionById = async (req: Request, res: Response) => {
  try {
    const entry = await SDHAnnualInspection.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Inspection not found' });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateSDHAnnualInspection = async (req: Request, res: Response) => {
  try {
    const entry = await SDHAnnualInspection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Inspection not found' });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteSDHAnnualInspection = async (req: Request, res: Response) => {
  try {
    const entry = await SDHAnnualInspection.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Inspection not found' });
    }
    res.status(200).json({ success: true, message: 'Inspection deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
