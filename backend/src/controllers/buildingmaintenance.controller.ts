import { Request, Response, NextFunction } from 'express';
import BuildingMaintenance from '../models/BuildingMaintenance';

export const createBuildingMaintenance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = new BuildingMaintenance(req.body);
    await record.save();
    res.status(201).json({ message: 'Record created successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const getAllBuildingMaintenances = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const records = await BuildingMaintenance.find().sort({ createdAt: -1 });
    res.json({ data: records });
  } catch (error) {
    next(error);
  }
};

export const getBuildingMaintenanceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = await BuildingMaintenance.findById(req.params.id);
    if (!record) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }
    res.json({ data: record });
  } catch (error) {
    next(error);
  }
};

export const updateBuildingMaintenance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = await BuildingMaintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }
    res.json({ message: 'Record updated successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const deleteBuildingMaintenance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = await BuildingMaintenance.findByIdAndDelete(req.params.id);
    if (!record) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
