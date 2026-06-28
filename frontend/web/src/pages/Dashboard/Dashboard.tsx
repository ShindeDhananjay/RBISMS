import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion, Variants } from 'framer-motion';
import apiClient from '../../services/apiClient';

const COLORS = ['#4CAF50', '#883399', '#550262', '#F44336', '#2196F3'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await apiClient.get('/analytics/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--ip-yellow)', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '12px', fontWeight: 600 }}>Loading Dashboard...</span>
      </div>
    );
  }

  if (!data) return <div>Failed to load data</div>;

  return (
    <motion.div 
      className="dashboard-view"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.h1 variants={itemVariants} style={{ marginBottom: '24px' }}>Executive Dashboard</motion.h1>
      
      <div className="kpi-grid">
        <motion.div 
          className="kpi-card glass-panel" 
          variants={itemVariants}
          whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
        >
          <h3>Total Villages</h3>
          <div className="value">{data.totalVillages.toLocaleString()}</div>
          <div className="trend positive">Mapped in System</div>
        </motion.div>
        
        <motion.div 
          className="kpi-card glass-panel" 
          variants={itemVariants}
          whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
        >
          <h3>Total Leads Generated</h3>
          <div className="value">{data.totalLeads.toLocaleString()}</div>
          <div className="trend positive">Across all services</div>
        </motion.div>
        
        <motion.div 
          className="kpi-card glass-panel" 
          variants={itemVariants}
          whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
        >
          <h3>Pending Inspections</h3>
          <div className="value" style={{ color: data.pendingInspections > 0 ? 'var(--ip-red)' : '#4CAF50' }}>
            {data.pendingInspections.toLocaleString()}
          </div>
          <div className="trend">SDH Annual TTP</div>
        </motion.div>
        
        <motion.div 
          className="kpi-card glass-panel" 
          variants={itemVariants}
          whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
        >
          <h3>Surveys Completed</h3>
          <div className="value" style={{ color: 'var(--ip-yellow)' }}>{data.totalSurveys.toLocaleString()}</div>
          <div className="trend">Across 5 Survey Types</div>
        </motion.div>
      </div>

      <div className="charts-grid" style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        <motion.div 
          className="chart-container glass-panel" 
          variants={itemVariants}
          style={{ height: '350px', padding: '24px', display: 'flex', flexDirection: 'column' }}
        >
          <h3 style={{ marginBottom: '16px' }}>Lead Generation Activity (6 Month View)</h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.leadActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGenerated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--ip-yellow)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--ip-yellow)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="generated" name="Generated Leads" stroke="var(--ip-yellow)" fillOpacity={1} fill="url(#colorGenerated)" />
                <Area type="monotone" dataKey="converted" name="Converted Leads" stroke="#4CAF50" fillOpacity={1} fill="url(#colorConverted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        <motion.div 
          className="chart-container glass-panel" 
          variants={itemVariants}
          style={{ height: '350px', padding: '24px', display: 'flex', flexDirection: 'column' }}
        >
          <h3 style={{ marginBottom: '16px' }}>Client Portfolio Distribution</h3>
          <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.clientDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={6}
                  cornerRadius={8}
                  dataKey="value"
                  stroke="none"
                >
                  {data.clientDistribution.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
