import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

export const loginWithPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    const user = await User.findOne({ username });
    if (!user || user.status !== 'Active') {
      res.status(401).json({ message: 'Invalid credentials or inactive account' });
      return;
    }

    // Verify bcrypt password
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) { res.status(401).json({ message: 'Invalid credentials' }); return; }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        employeeName: user.employeeName,
        role: user.role,
        designation: user.designation,
        division: user.division,
        accessibleModules: user.accessibleModules
      }
    });
  } catch (error) {
    next(error);
  }
};

export const generateOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { mobile } = req.body;
    
    if (!mobile) {
      res.status(400).json({ message: 'Mobile number is required' });
      return;
    }

    const user = await User.findOne({ mobile });
    if (!user || user.status !== 'Active') {
      res.status(404).json({ message: 'User not found or inactive' });
      return;
    }

    // Mock OTP Generation (123456)
    const otp = '123456';
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    // To-Do: Integrate actual SMS provider here
    console.log(`[MOCK SMS] OTP for ${mobile} is ${otp}`);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const loginWithOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { mobile, otp } = req.body;
    
    if (!mobile || !otp) {
      res.status(400).json({ message: 'Mobile and OTP are required' });
      return;
    }

    const user = await User.findOne({ mobile });
    if (!user || user.status !== 'Active') {
      res.status(401).json({ message: 'Invalid user or inactive account' });
      return;
    }

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      res.status(401).json({ message: 'Invalid or expired OTP' });
      return;
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        employeeName: user.employeeName,
        role: user.role,
        designation: user.designation,
        division: user.division,
        accessibleModules: user.accessibleModules
      }
    });
  } catch (error) {
    next(error);
  }
};
