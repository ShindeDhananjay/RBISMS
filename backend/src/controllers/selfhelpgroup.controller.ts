import { getDataScopeFilter } from '../utils/dataScope';
import { Request, Response } from 'express';
import SelfHelpGroup from '../models/SelfHelpGroup';

export const createSelfHelpGroup = async (req: Request, res: Response) => {
  try {
    const entry = new SelfHelpGroup(req.body);
    await entry.save();
    res.status(201).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllSelfHelpGroups = async (req: Request, res: Response) => {
  try {
    const userFilter = await getDataScopeFilter(req);

    const entries = await SelfHelpGroup.find(userFilter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: entries });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSelfHelpGroupById = async (req: Request, res: Response) => {
  try {
    const entry = await SelfHelpGroup.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'SHG not found' });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateSelfHelpGroup = async (req: Request, res: Response) => {
  try {
    const entry = await SelfHelpGroup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'SHG not found' });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteSelfHelpGroup = async (req: Request, res: Response) => {
  try {
    const entry = await SelfHelpGroup.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'SHG not found' });
    }
    res.status(200).json({ success: true, message: 'SHG deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
