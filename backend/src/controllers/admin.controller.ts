import { Request, Response } from 'express';
import User, { Role } from '../models/User';
import LeadGeneration from '../models/LeadGeneration';
import SDHDiary from '../models/SDHDiary';

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { employeeName, designation, mobile, email, username, password } = req.body;
    
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const newAdmin = new User({
      employeeId: `ADM-${Date.now()}`,
      employeeName,
      designation,
      mobile,
      email,
      username,
      password,
      initialPassword: password, // As requested, store plaintext for viewing
      role: Role.ADMIN,
      status: 'Active'
    });

    await newAdmin.save();
    res.status(201).json({ success: true, data: newAdmin });
  } catch (error: any) {
    console.error('Error creating admin:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

export const getAdmins = async (req: Request, res: Response) => {
  try {
    // Return all users with ADMIN role
    const admins = await User.find({ role: Role.ADMIN }).select('-password');
    
    // In the future, this will aggregate actual module data (e.g. leads count)
    // For now, we return real data (0 since we just wiped)
    const enrichedAdmins = admins.map(admin => {
      const adminObj = admin.toObject();
      return {
        ...adminObj,
        dataVolumeScore: 0 
      };
    });

    res.status(200).json({ success: true, data: enrichedAdmins });
  } catch (error: any) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // In the future, perform real aggregations. Currently 0.
    res.status(200).json({
      success: true,
      data: {
        admin,
        stats: {
          dataVolumeScore: 0,
          leadsGenerated: 0,
          surveysCompleted: 0,
          activeSessions: 0,
          performanceScore: 0
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { employeeName, designation, mobile, email, username, password } = req.body;
    
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (employeeName) admin.employeeName = employeeName;
    if (designation) admin.designation = designation;
    if (mobile) admin.mobile = mobile;
    if (email) admin.email = email;
    if (username) admin.username = username;
    
    if (password && password.trim().length > 0) {
      admin.password = password; // The pre-save hook will hash this automatically!
      admin.initialPassword = password; // Update the plaintext version too
    }

    await admin.save();
    
    res.status(200).json({ success: true, message: 'Admin updated successfully', data: admin });
  } catch (error: any) {
    console.error('Error updating admin:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
