import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Villages from '../pages/Villages';
import Analytics from '../pages/Analytics';
import Login from '../pages/Login';
import SubDivision from '../pages/SubDivision';
import SubOffice from '../pages/SubOffice';
import BranchOffice from '../pages/BranchOffice';
import Surveys from '../pages/Surveys';
import SchoolSurvey from '../pages/Surveys/School';
import HospitalSurvey from '../pages/Surveys/Hospital';
import FactorySurvey from '../pages/Surveys/Factory';
import BankSurvey from '../pages/Surveys/Bank';
import GramPanchayatSurvey from '../pages/Surveys/GramPanchayat';
import SHGSurvey from '../pages/Surveys/SHG';
import BNPLCustomers from '../pages/Customers/BNPL';
import BulkCustomers from '../pages/Customers/Bulk';
import BusinessVisits from '../pages/BusinessVisits';
import LeadGeneration from '../pages/Leads';
import EmployeeMaster from '../pages/EmployeeMaster';
import BuildingMaintenance from '../pages/BuildingMaintenance';
import ParcelMonitoring from '../pages/ParcelMonitoring';
import Franchisees from '../pages/Franchisees';
import ReportsDashboard from '../pages/reports';
import SDHDiary from '../pages/SDHDiary';
import MailOverseerVisit from '../pages/MailOverseerVisit';
import SDHAnnualInspection from '../pages/SDHAnnualInspection';
import SelfHelpGroup from '../pages/SelfHelpGroup';
import InstituteMSME from '../pages/InstituteMSME';
import SuperAdminDashboard from '../pages/SuperAdmin';
import EmployeeManagement from '../pages/EmployeeManagement';
import SDHInspection from '../pages/SDHInspection';

const AppRoutes = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Super Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Super Admin']} />}>
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
        </Route>

        {/* Protected Admin & User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin', 'User', 'Postmaster', 'Inspector', 'BPM', 'ABPM', 'Marketing Executive', 'Circle Admin', 'Division Admin']} />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            
            {/* Admin Only Route inside MainLayout */}
            <Route path="employees-manage" element={
              <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
                <EmployeeManagement />
              </ProtectedRoute>
            } />
            
            <Route path="villages" element={<Villages />} />
            <Route path="sdhinspection" element={<SDHInspection />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="subdivision" element={<SubDivision />} />
            <Route path="suboffice" element={<SubOffice />} />
            <Route path="branchoffice" element={<BranchOffice />} />
            <Route path="surveys" element={<Surveys />} />
            <Route path="surveys/school" element={<SchoolSurvey />} />
            <Route path="surveys/hospital" element={<HospitalSurvey />} />
            <Route path="surveys/factory" element={<FactorySurvey />} />
            <Route path="surveys/bank" element={<BankSurvey />} />
            <Route path="surveys/grampanchayat" element={<GramPanchayatSurvey />} />
            <Route path="surveys/shg" element={<SHGSurvey />} />
            <Route path="customers" element={<BNPLCustomers />} />
            <Route path="bnpl" element={<BNPLCustomers />} />
            <Route path="bulk" element={<BulkCustomers />} />
            <Route path="businessvisits" element={<BusinessVisits />} />
            <Route path="leads" element={<LeadGeneration />} />
            <Route path="employees" element={<EmployeeMaster />} />
            <Route path="buildings" element={<BuildingMaintenance />} />
            <Route path="parcels" element={<ParcelMonitoring />} />
            <Route path="franchisees" element={<Franchisees />} />
            <Route path="sdhdiary" element={<SDHDiary />} />
            <Route path="mailoverseervisits" element={<MailOverseerVisit />} />
            <Route path="sdhannualinspections" element={<SDHAnnualInspection />} />
            <Route path="selfhelpgroups" element={<SelfHelpGroup />} />
            <Route path="institutemsmes" element={<InstituteMSME />} />
            <Route path="reports" element={<ReportsDashboard />} />
          </Route>
        </Route>
        
        {/* Fallback to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
