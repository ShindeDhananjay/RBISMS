import { getDataScopeFilter } from '../utils/dataScope';
import { Request, Response } from 'express';
import InstituteMSME from '../models/InstituteMSME';

export const createInstituteMSME = async (req: Request, res: Response) => {
  try {
    const entry = new InstituteMSME(req.body);
    await entry.save();
    res.status(201).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllInstituteMSMEs = async (req: Request, res: Response) => {
  try {
    const userFilter = await getDataScopeFilter(req);

    const entries = await InstituteMSME.find(userFilter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: entries });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getInstituteMSMEById = async (req: Request, res: Response) => {
  try {
    const entry = await InstituteMSME.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Institute/MSME not found' });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateInstituteMSME = async (req: Request, res: Response) => {
  try {
    const entry = await InstituteMSME.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Institute/MSME not found' });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteInstituteMSME = async (req: Request, res: Response) => {
  try {
    const entry = await InstituteMSME.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Institute/MSME not found' });
    }
    res.status(200).json({ success: true, message: 'Institute/MSME deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
