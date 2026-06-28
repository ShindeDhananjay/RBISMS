import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useEffect, useState } from 'react';

const MainLayout = () => {
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  // Redirect regular users away from the main dashboard if they land on it
  if (user && user.role !== 'Admin' && user.role !== 'Super Admin' && location.pathname === '/') {
    const firstModule = user.accessibleModules && user.accessibleModules.length > 0 ? `/${user.accessibleModules[0]}` : '/login';
    return <Navigate to={firstModule} replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <section className="content-area animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default MainLayout;
