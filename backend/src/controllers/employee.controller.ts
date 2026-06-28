import { Request, Response } from 'express';
import User, { Role } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

export const createEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { employeeName, designation, mobile, username, password, accessibleModules } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Username already exists' });
      return;
    }

    const newEmployee = new User({
      employeeId: `EMP-${Date.now()}`,
      employeeName,
      designation,
      mobile,
      username,
      password,
      initialPassword: password,
      role: req.body.role || Role.POSTMASTER, 
      accessibleModules: accessibleModules || [],
      createdBy: req.user?.id,
      status: 'Active'
    });

    await newEmployee.save();

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newEmployee
    });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getEmployees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Only fetch employees created by this Admin
    // For Super Admin, maybe fetch all? The user requested: "for employee all data must be his own" and Admin manages their own employees.
    const query: any = {};
    if (req.user?.role !== Role.SUPER_ADMIN) {
      query.createdBy = req.user?.id;
    } else {
      // If Super Admin, maybe fetch all users except Super Admins
      query.role = { $ne: Role.SUPER_ADMIN };
    }

    const employees = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { employeeName, designation, mobile, username, password, accessibleModules } = req.body;
    
    const employee = await User.findById(id);
    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }

    if (employeeName) employee.employeeName = employeeName;
    if (designation) employee.designation = designation;
    if (mobile) employee.mobile = mobile;
    if (username) employee.username = username;
    if (accessibleModules) employee.accessibleModules = accessibleModules;
    
    if (password && password.trim().length > 0) {
      employee.password = password;
      employee.initialPassword = password;
    }

    await employee.save();
    
    res.status(200).json({ success: true, message: 'Employee updated successfully', data: employee });
  } catch (error: any) {
    console.error('Error updating employee:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await User.findByIdAndDelete(id);
    
    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
