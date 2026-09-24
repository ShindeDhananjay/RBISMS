import mongoose from 'mongoose';
import User, { Role } from '../models/User';

export const getDataScopeFilter = async (req: any): Promise<any> => {
  const user = req.user;
  if (!user) return {};

  // Super Admin can access all records across all subdivisions and admins
  if (user.role === Role.SUPER_ADMIN || user.role === 'Super Admin') {
    return {};
  }

  const userIdStr = String(user.id);
  const userIdObj = new mongoose.Types.ObjectId(userIdStr);

  // If Admin:
  // Admin sees records they created, records tagged with their adminId,
  // records created by any employees managed by this admin,
  // and for Admin 1 (Vinayak Shinde), any pre-existing legacy records.
  if (user.role === Role.ADMIN || user.role === 'Admin') {
    const managedEmployees = await User.find({ createdBy: user.id }).select('_id');
    const managedIds = managedEmployees.map(e => e._id);
    const managedIdStrs = managedEmployees.map(e => String(e._id));

    const allAllowedUserIds: any[] = [userIdObj, userIdStr, ...managedIds, ...managedIdStrs];

    const isFirstAdmin = userIdStr === '6a40b2675fb5f4e5fc00e826';

    const orConditions: any[] = [
      { userId: { $in: allAllowedUserIds } },
      { adminId: userIdObj },
      { adminId: userIdStr }
    ];

    if (isFirstAdmin) {
      orConditions.push({ userId: { $exists: false } });
      orConditions.push({ userId: null });
      orConditions.push({ adminId: { $exists: false } });
      orConditions.push({ adminId: null });
    }

    return { $or: orConditions };
  }

  // Regular user / employee (Postmaster, BPM, ABPM, etc.):
  // Sees only their own submissions
  return {
    $or: [
      { userId: userIdObj },
      { userId: userIdStr }
    ]
  };
};
