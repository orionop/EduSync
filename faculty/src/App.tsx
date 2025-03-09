import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MarksCalculation from './pages/MarksCalculation';
import ViewResults from './pages/ViewResults';
import ProctorSection from './pages/ProctorSection';
import CameraFeed from './pages/CameraFeed';
import MarksSubmissionView from './pages/MarksSubmissionView';
import SupervisorDuty from './pages/SupervisorDuty';
import EndSemesterEvaluationPage from './pages/EndSemesterEvaluationPage';
import ProtectedRoute from './components/ProtectedRoute';
import DevelopmentNotice from './components/DevelopmentNotice';
import { NotificationProvider } from './context/NotificationContext';
import AuthenticatedLayout from './components/AuthenticatedLayout';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <DevelopmentNotice />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              duration: 3000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/marks-calculation" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <MarksCalculation />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/view-results" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ViewResults />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/marks-submission/:classroomId" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <MarksSubmissionView />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/proctor-section" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ProctorSection />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/camera-feed/:classroomId" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <CameraFeed />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/supervisor-duty" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <SupervisorDuty />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/end-semester-evaluation" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <EndSemesterEvaluationPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;