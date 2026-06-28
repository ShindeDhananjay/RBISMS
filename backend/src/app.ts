import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Application = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'IP-RBISMS API is running' });
});

import authRoutes from './routes/auth.routes';
import subdivisionRoutes from './routes/subdivision.routes';
import subofficeRoutes from './routes/suboffice.routes';
import branchofficeRoutes from './routes/branchoffice.routes';
import villageRoutes from './routes/village.routes';
import anganwadisurveyRoutes from './routes/anganwadisurvey.routes';
import shgsurveyRoutes from './routes/shgsurvey.routes';
import schoolsurveyRoutes from './routes/schoolsurvey.routes';
import hospitalsurveyRoutes from './routes/hospitalsurvey.routes';
import factorysurveyRoutes from './routes/factorysurvey.routes';
import banksurveyRoutes from './routes/banksurvey.routes';
import grampanchayatRoutes from './routes/grampanchayat.routes';
import bnplcustomerRoutes from './routes/bnplcustomer.routes';
import bulkcustomerRoutes from './routes/bulkcustomer.routes';
import businessvisitRoutes from './routes/businessvisit.routes';
import franchiseeRoutes from './routes/franchisee.routes';
import parcelmonitoringRoutes from './routes/parcelmonitoring.routes';
import buildingmaintenanceRoutes from './routes/buildingmaintenance.routes';
import leadgenerationRoutes from './routes/leadgeneration.routes';
import sdhdiaryRoutes from './routes/sdhdiary.routes';
import mailoverseervisitRoutes from './routes/mailoverseervisit.routes';
import sdhannualinspectionRoutes from './routes/sdhannualinspection.routes';
import selfhelpgroupRoutes from './routes/selfhelpgroup.routes';
import institutemsmeRoutes from './routes/institutemsme.routes';
import analyticsRoutes from './routes/analytics.routes';
import aiRoutes from './routes/ai.routes';
import adminRoutes from './routes/admin.routes';
import employeeRoutes from './routes/employee.routes';
import sdhinspectionRoutes from './routes/sdhinspection.routes';
import { authenticate } from './middleware/auth';

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api', authenticate);
app.use('/api/employees', employeeRoutes);
app.use('/api/subdivisions', subdivisionRoutes);
app.use('/api/suboffices', subofficeRoutes);
app.use('/api/branchoffices', branchofficeRoutes);
app.use('/api/villages', villageRoutes);
app.use('/api/anganwadisurveys', anganwadisurveyRoutes);
app.use('/api/shgsurveys', shgsurveyRoutes);
app.use('/api/schoolsurveys', schoolsurveyRoutes);
app.use('/api/hospitalsurveys', hospitalsurveyRoutes);
app.use('/api/factorysurveys', factorysurveyRoutes);
app.use('/api/banksurveys', banksurveyRoutes);
app.use('/api/grampanchayats', grampanchayatRoutes);
app.use('/api/bnplcustomers', bnplcustomerRoutes);
app.use('/api/bulkcustomers', bulkcustomerRoutes);
app.use('/api/businessvisits', businessvisitRoutes);
app.use('/api/franchisees', franchiseeRoutes);
app.use('/api/parcelmonitorings', parcelmonitoringRoutes);
app.use('/api/buildingmaintenances', buildingmaintenanceRoutes);
app.use('/api/leadgenerations', leadgenerationRoutes);
app.use('/api/sdhdiary', sdhdiaryRoutes);
app.use('/api/mailoverseervisits', mailoverseervisitRoutes);
app.use('/api/sdhannualinspections', sdhannualinspectionRoutes);
app.use('/api/selfhelpgroups', selfhelpgroupRoutes);
app.use('/api/institutemsmes', institutemsmeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sdhinspections', sdhinspectionRoutes);

// Global 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred.',
    // Don't leak stack trace in production
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

export default app;
