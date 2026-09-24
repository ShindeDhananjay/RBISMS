import { getDataScopeFilter } from '../utils/dataScope';
import { Request, Response, NextFunction } from 'express';
import ParcelMonitoring from '../models/ParcelMonitoring';

export const createParcelMonitoring = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = new ParcelMonitoring(req.body);
    await record.save();
    res.status(201).json({ message: 'Record created successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const getAllParcelMonitorings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userFilter = await getDataScopeFilter(req);

    const records = await ParcelMonitoring.find(userFilter).sort({ createdAt: -1 });
    res.json({ data: records });
  } catch (error) {
    next(error);
  }
};

export const getParcelMonitoringById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = await ParcelMonitoring.findById(req.params.id);
    if (!record) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }
    res.json({ data: record });
  } catch (error) {
    next(error);
  }
};

export const updateParcelMonitoring = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = await ParcelMonitoring.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }
    res.json({ message: 'Record updated successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const deleteParcelMonitoring = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = await ParcelMonitoring.findByIdAndDelete(req.params.id);
    if (!record) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
