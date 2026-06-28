import { Request, Response, NextFunction } from 'express';
import Franchisee from '../models/Franchisee';

export const createFranchisee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const franchisee = new Franchisee(req.body);
    await franchisee.save();
    res.status(201).json({ message: 'Franchisee created successfully', data: franchisee });
  } catch (error) {
    next(error);
  }
};

export const getAllFranchisees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const franchisees = await Franchisee.find().sort({ createdAt: -1 });
    res.json({ data: franchisees });
  } catch (error) {
    next(error);
  }
};

export const getFranchiseeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const franchisee = await Franchisee.findById(req.params.id);
    if (!franchisee) {
      res.status(404).json({ message: 'Franchisee not found' });
      return;
    }
    res.json({ data: franchisee });
  } catch (error) {
    next(error);
  }
};

export const updateFranchisee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const franchisee = await Franchisee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!franchisee) {
      res.status(404).json({ message: 'Franchisee not found' });
      return;
    }
    res.json({ message: 'Franchisee updated successfully', data: franchisee });
  } catch (error) {
    next(error);
  }
};

export const deleteFranchisee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const franchisee = await Franchisee.findByIdAndDelete(req.params.id);
    if (!franchisee) {
      res.status(404).json({ message: 'Franchisee not found' });
      return;
    }
    res.json({ message: 'Franchisee deleted successfully' });
  } catch (error) {
    next(error);
  }
};
