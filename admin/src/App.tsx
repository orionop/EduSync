import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ExamPrerequisites from './pages/ExamPrerequisites';
import SupervisoryDuty from './pages/SupervisoryDuty';
import DuringExam from './pages/DuringExam';
import PostExam from './pages/PostExam';
import ExamEvaluation from './pages/ExamEvaluation';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute />}>
                {/* Dashboard without sidebar */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                {/* Other routes with AdminLayout (includes sidebar) */}
                <Route element={<AdminLayout />}>
                  <Route path="/admin/exam-prerequisites" element={<ExamPrerequisites />} />
                  <Route path="/admin/supervisory-duty" element={<SupervisoryDuty />} />
                  <Route path="/admin/during-exam" element={<DuringExam />} />
                  <Route path="/admin/post-exam" element={<PostExam />} />
                  <Route path="/admin/exam-evaluation" element={<ExamEvaluation />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;