import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

import User, { Role } from '../models/User';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    
    // Inject entryBy, userId, and adminId for all incoming write operations
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const user = await User.findById(decoded.id);
      if (user) {
        req.body.entryBy = user.employeeName || user.username;
        req.body.userId = decoded.id;
        if (user.role === Role.ADMIN) {
          req.body.adminId = user._id;
        } else if (user.createdBy) {
          req.body.adminId = user.createdBy;
        }
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
    return;
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Unauthorized access' });
      return;
    }
    next();
  };
};
