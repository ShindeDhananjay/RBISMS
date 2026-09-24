import { Request, Response } from 'express';
import MailOverseerVisit from '../models/MailOverseerVisit';

export const createMailOverseerVisit = async (req: Request, res: Response) => {
  try {
    const entry = new MailOverseerVisit(req.body);
    await entry.save();
    res.status(201).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllMailOverseerVisits = async (req: Request, res: Response) => {
  try {
    const userFilter = (req as any).user && (req as any).user.role !== 'Super Admin' ? { userId: (req as any).user.id } : {};

    const entries = await MailOverseerVisit.find(userFilter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: entries });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMailOverseerVisitById = async (req: Request, res: Response) => {
  try {
    const entry = await MailOverseerVisit.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Visit not found' });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateMailOverseerVisit = async (req: Request, res: Response) => {
  try {
    const entry = await MailOverseerVisit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Visit not found' });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteMailOverseerVisit = async (req: Request, res: Response) => {
  try {
    const entry = await MailOverseerVisit.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Visit not found' });
    }
    res.status(200).json({ success: true, message: 'Visit deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
