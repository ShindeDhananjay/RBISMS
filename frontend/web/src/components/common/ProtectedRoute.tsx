import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const location = useLocation();
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // If specific roles are required and the user's role isn't included
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // Route them to their respective default dashboard if they are unauthorized for this route
      if (user.role === 'Super Admin') {
        if (location.pathname === '/superadmin') return null; // prevent loop
        return <Navigate to="/superadmin" replace />;
      }
      if (location.pathname === '/') return <Navigate to="/login" replace />; // If already at /, redirect to login
      return <Navigate to="/" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
  } catch (e) {
    // Invalid JSON in localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
