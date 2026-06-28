import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Legend
} from 'recharts';
import { motion, Variants } from 'framer-motion';
import apiClient from '../../services/apiClient';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 20 } }
};

const Analytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const res = await apiClient.get('/analytics/trends');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--ip-red)', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '12px', fontWeight: 600 }}>Loading Analytics...</span>
      </div>
    );
  }

  if (!data) return <div>Failed to load data</div>;

  return (
    <motion.div 
      className="analytics-view" 
      style={{ padding: '24px' }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.h1 variants={itemVariants} style={{ marginBottom: '24px' }}>Advanced Analytics</motion.h1>
      
      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Task Execution Bar Chart */}
        <motion.div 
          className="chart-container glass-panel" 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
          style={{ height: '400px', padding: '24px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}
        >
          <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Operational Task Execution</h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--panel-border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(85, 2, 98, 0.04)' }}
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="completed" name="Completed Tasks" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending Tasks" fill="var(--ip-red)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Lead Generation Trends Line Chart */}
        <motion.div 
          className="chart-container glass-panel" 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
          style={{ height: '400px', padding: '24px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}
        >
          <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Customer Acquisition Trends (Master Data)</h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.leadTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--panel-border)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="BNPL" stroke="var(--ip-red)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Bulk" stroke="var(--ip-yellow)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Retail" stroke="#4CAF50" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Analytics;
