import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
  }, []);

  const hasAccess = (moduleId: string) => {
    if (!user) return false;
    // Admins and Super Admins have full access
    if (user.role === 'Admin' || user.role === 'Super Admin') return true;
    // Regular users check their accessibleModules array
    return user.accessibleModules?.includes(moduleId) || false;
  };

  return (
    <nav className="sidebar glass-panel animate-fade-in" style={{ overflowY: 'auto' }}>
      <div className="logo-container">
        <h2 style={{ fontSize: '1.25rem', lineHeight: '1.25', fontWeight: 900, fontFamily: '"Georgia", serif', color: 'var(--ip-red)', letterSpacing: '0.5px', marginBottom: '28px' }}>Intelligence Platform</h2>
      </div>
      <ul className="nav-links">
        
        {(user?.role === 'Admin' || user?.role === 'Super Admin') && (
          <>
            <NavLink to="/" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'} end>📊 Dashboard</NavLink>
            <NavLink to="/analytics" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>📈 Analytics</NavLink>
            <div style={{ margin: '16px 0 8px 12px', fontSize: '0.8rem', color: 'var(--ip-red)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Administration</div>
            <NavLink to="/employees-manage" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>👥 Employee Management</NavLink>
          </>
        )}

        <div style={{ margin: '16px 0 8px 12px', fontSize: '0.8rem', color: 'var(--ip-red)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Master Data</div>
        {hasAccess('sdhinspection') && <NavLink to="/sdhinspection" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>🔍 SDH Inspection</NavLink>}
        {hasAccess('villages') && <NavLink to="/villages" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>🏘️ Villages</NavLink>}
        {hasAccess('subdivision') && <NavLink to="/subdivision" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>📍 SubDivision</NavLink>}
        {hasAccess('suboffice') && <NavLink to="/suboffice" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>🏬 SubOffice</NavLink>}
        {hasAccess('branchoffice') && <NavLink to="/branchoffice" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>📬 BranchOffice</NavLink>}
        {hasAccess('surveys') && (
          <>
            <NavLink to="/surveys" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>📝 Anganwadi Survey</NavLink>
          </>
        )}
        {hasAccess('customers') && <NavLink to="/customers" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>👥 COD / BNPL Customer</NavLink>}
        {hasAccess('businessvisits') && <NavLink to="/businessvisits" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>🤝 BusinessVisits</NavLink>}
        {hasAccess('sdhdiary') && <NavLink to="/sdhdiary" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>📔 SDH Diary</NavLink>}
        {hasAccess('mailoverseervisits') && <NavLink to="/mailoverseervisits" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>👁️ Mail Overseer Visits</NavLink>}
        {hasAccess('sdhannualinspections') && <NavLink to="/sdhannualinspections" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>📋 SDH Annual Inspection</NavLink>}
        {hasAccess('selfhelpgroups') && <NavLink to="/selfhelpgroups" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>🤝 Self Help Group</NavLink>}
        {hasAccess('institutemsmes') && <NavLink to="/institutemsmes" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>🏭 Institute / MSME</NavLink>}
        {hasAccess('franchisees') && <NavLink to="/franchisees" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>🏪 Franchisee</NavLink>}
        {hasAccess('parcels') && <NavLink to="/parcels" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>📦 Parcel Monitoring</NavLink>}
        {hasAccess('buildings') && <NavLink to="/buildings" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>🏢 Building Maintenance</NavLink>}
        {hasAccess('leads') && <NavLink to="/leads" className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>🎯 Lead Generation by Staff</NavLink>}
      </ul>
    </nav>
  );
};

export default Sidebar;
