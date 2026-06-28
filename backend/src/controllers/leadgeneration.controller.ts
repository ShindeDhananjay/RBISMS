import { Request, Response, NextFunction } from 'express';
import LeadGeneration from '../models/LeadGeneration';

export const createLeadGeneration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = new LeadGeneration(req.body);
    await record.save();
    res.status(201).json({ message: 'Record created successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const getAllLeadGenerations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const records = await LeadGeneration.find().sort({ createdAt: -1 });
    res.json({ data: records });
  } catch (error) {
    next(error);
  }
};

export const getLeadGenerationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = await LeadGeneration.findById(req.params.id);
    if (!record) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }
    res.json({ data: record });
  } catch (error) {
    next(error);
  }
};

export const updateLeadGeneration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = await LeadGeneration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }
    res.json({ message: 'Record updated successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const deleteLeadGeneration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = await LeadGeneration.findByIdAndDelete(req.params.id);
    if (!record) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
