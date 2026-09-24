import { Request, Response } from 'express';
import Village from '../models/Village';
import LeadGeneration from '../models/LeadGeneration';
import BusinessVisit from '../models/BusinessVisit';
import SDHAnnualInspection from '../models/SDHAnnualInspection';
import AnganwadiSurvey from '../models/AnganwadiSurvey';
import SchoolSurvey from '../models/SchoolSurvey';
import HospitalSurvey from '../models/HospitalSurvey';
import FactorySurvey from '../models/FactorySurvey';
import BankSurvey from '../models/BankSurvey';
import BNPLCustomer from '../models/BNPLCustomer';
import BulkCustomer from '../models/BulkCustomer';
import SelfHelpGroup from '../models/SelfHelpGroup';
import InstituteMSME from '../models/InstituteMSME';

export const getDashboardKPIs = async (req: Request, res: Response) => {
  try {
    const userFilter = (req as any).user && (req as any).user.role !== 'Super Admin' ? { userId: (req as any).user.id } : {};

    const totalVillages = await Village.countDocuments(userFilter);
    
    // Total Leads
    const totalLeads = await LeadGeneration.countDocuments(userFilter);
    
    // Pending Inspections
    const pendingInspections = await SDHAnnualInspection.countDocuments({  status: { $regex: /^pending$/i , ...userFilter } });
    
    // Total Surveys across a few collections
    const anganwadiCount = await AnganwadiSurvey.countDocuments(userFilter);
    const schoolCount = await SchoolSurvey.countDocuments(userFilter);
    const hospitalCount = await HospitalSurvey.countDocuments(userFilter);
    const factoryCount = await FactorySurvey.countDocuments(userFilter);
    const bankCount = await BankSurvey.countDocuments(userFilter);
    const totalSurveys = anganwadiCount + schoolCount + hospitalCount + factoryCount + bankCount;

    // Client / Customer Portfolio Distribution for Pie Chart
    const bnplCount = await BNPLCustomer.countDocuments(userFilter);
    const bulkCount = await BulkCustomer.countDocuments(userFilter);
    const shgCount = await SelfHelpGroup.countDocuments(userFilter);
    const msmeCount = await InstituteMSME.countDocuments(userFilter);

    const clientDistribution = [
      { name: 'BNPL Customers', value: bnplCount },
      { name: 'Bulk Customers', value: bulkCount },
      { name: 'Self Help Groups', value: shgCount },
      { name: 'Institute / MSME', value: msmeCount },
    ].filter(s => s.value > 0);
    
    // If empty, provide a default so chart doesn't break
    if (clientDistribution.length === 0) {
      clientDistribution.push({ name: 'No Clients Yet', value: 1 });
    }

    // Leads by Month for Area Chart (6 Months View)
    const leads = await LeadGeneration.find({ ...userFilter }, 'createdAt status');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const currentMonth = new Date().getMonth();
    
    // Generate last 6 months labels
    const leadActivityData: { name: string; generated: number; converted: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12;
      leadActivityData.push({ name: monthNames[m], generated: 0, converted: 0 });
    }

    leads.forEach(lead => {
      const d = new Date(lead.createdAt);
      // Map to the 6 months window if it fits
      const monthDiff = (new Date().getFullYear() - d.getFullYear()) * 12 + (currentMonth - d.getMonth());
      if (monthDiff >= 0 && monthDiff < 6) {
        const targetMonth = leadActivityData[5 - monthDiff];
        targetMonth.generated += 1;
        if ((lead.status || '').toLowerCase() === 'converted') {
          targetMonth.converted += 1;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalVillages,
        totalLeads,
        pendingInspections,
        totalSurveys,
        clientDistribution,
        leadActivityData
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAnalyticsTrends = async (req: Request, res: Response) => {
  try {
    const userFilter = (req as any).user && (req as any).user.role !== 'Super Admin' ? { userId: (req as any).user.id } : {};

    // Lead Generation Trends Line Chart
    // Assuming BNPL, Bulk, Retail
    const leads = await LeadGeneration.find({ ...userFilter }, 'typeOfLead createdAt');
    const currentMonth = new Date().getMonth();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const leadTrends: { month: string; BNPL: number; Bulk: number; Retail: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12;
      leadTrends.push({ month: monthNames[m], BNPL: 0, Bulk: 0, Retail: 0 });
    }

    leads.forEach(lead => {
      const d = new Date(lead.createdAt);
      const monthDiff = (new Date().getFullYear() - d.getFullYear()) * 12 + (currentMonth - d.getMonth());
      if (monthDiff >= 0 && monthDiff < 6) {
        const targetMonth = leadTrends[5 - monthDiff];
        const srv = (lead.typeOfLead || '').toLowerCase();
        if (srv.includes('bnpl')) targetMonth.BNPL += 1;
        else if (srv.includes('bulk')) targetMonth.Bulk += 1;
        else targetMonth.Retail += 1;
      }
    });

    // Operational Task Execution Data (Replacing Mock Revenue Baseline)
    const businessVisits = await BusinessVisit.aggregate([
      { $match: userFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const sdhInspections = await SDHAnnualInspection.aggregate([
      { $match: userFilter },
      { $group: { _id: { $toLower: "$status" }, count: { $sum: 1 } } }
    ]);
    const leadStats = await LeadGeneration.aggregate([
      { $match: userFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const getStatusCount = (agg: any[], status: string) => {
      const match = agg.find(x => (x._id || '').toLowerCase() === status.toLowerCase());
      return match ? match.count : 0;
    };

    const taskExecutionData = [
      { 
        name: 'Business Visits', 
        pending: getStatusCount(businessVisits, 'pending'), 
        completed: getStatusCount(businessVisits, 'complete') + getStatusCount(businessVisits, 'completed') 
      },
      { 
        name: 'SDH Inspections', 
        pending: getStatusCount(sdhInspections, 'pending'), 
        completed: getStatusCount(sdhInspections, 'completed') 
      },
      { 
        name: 'Lead Generation', 
        pending: getStatusCount(leadStats, 'pending'), 
        completed: getStatusCount(leadStats, 'converted') || getStatusCount(leadStats, 'completed') || 0 
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        leadTrends,
        performanceData: taskExecutionData // Keep key as performanceData to avoid breaking frontend immediately
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
