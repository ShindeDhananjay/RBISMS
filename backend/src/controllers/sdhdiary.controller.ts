import { Request, Response } from 'express';
import SDHDiary from '../models/SDHDiary';

// Create a new SDH Diary entry
export const createSDHDiary = async (req: Request, res: Response) => {
  try {
    const entry = new SDHDiary(req.body);
    await entry.save();
    res.status(201).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all SDH Diary entries
export const getAllSDHDiary = async (req: Request, res: Response) => {
  try {
    const userFilter = (req as any).user && (req as any).user.role !== 'Super Admin' ? { userId: (req as any).user.id } : {};

    const entries = await SDHDiary.find(userFilter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: entries });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single SDH Diary entry by ID
export const getSDHDiaryById = async (req: Request, res: Response) => {
  try {
    const entry = await SDHDiary.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'SDH Diary entry not found' });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update an SDH Diary entry
export const updateSDHDiary = async (req: Request, res: Response) => {
  try {
    const entry = await SDHDiary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'SDH Diary entry not found' });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete an SDH Diary entry
export const deleteSDHDiary = async (req: Request, res: Response) => {
  try {
    const entry = await SDHDiary.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'SDH Diary entry not found' });
    }
    res.status(200).json({ success: true, message: 'SDH Diary entry deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
