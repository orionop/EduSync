import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExamPrerequisites from './pages/ExamPrerequisites';
import ExamTimetable from './pages/ExamTimetable';
import Results from './pages/Results';
import KTSection from './pages/KTSection';
import Submissions from './pages/Submissions';
import PlacementEligibility from './pages/PlacementEligibility';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import StudentHeader from './components/StudentHeader';
import ProtectedRoute from './components/ProtectedRoute';
import CollegeBanner from './components/CollegeBanner';

function App() {
  // Mock student info - in a real app, this would come from your auth context
  const studentInfo = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '9876543210',
    institution: 'University of Technology',
    accountType: 'Student',
    studentId: 'STU2025001',
    photoUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
              <CollegeBanner collegeName="University of Technology" />
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/dashboard"
                    element={
                      <>
                        <StudentHeader studentInfo={studentInfo} />
                        <Dashboard />
                      </>
                    }
                  />
                  <Route
                    path="/exam-prerequisites"
                    element={
                      <>
                        <StudentHeader studentInfo={studentInfo} />
                        <ExamPrerequisites />
                      </>
                    }
                  />
                  <Route
                    path="/exam-timetable"
                    element={
                      <>
                        <StudentHeader studentInfo={studentInfo} />
                        <ExamTimetable />
                      </>
                    }
                  />
                  <Route
                    path="/results"
                    element={
                      <>
                        <StudentHeader studentInfo={studentInfo} />
                        <Results />
                      </>
                    }
                  />
                  <Route
                    path="/kt-section"
                    element={
                      <>
                        <StudentHeader studentInfo={studentInfo} />
                        <KTSection />
                      </>
                    }
                  />
                  <Route
                    path="/submissions"
                    element={
                      <>
                        <StudentHeader studentInfo={studentInfo} />
                        <Submissions />
                      </>
                    }
                  />
                  <Route
                    path="/placement-eligibility"
                    element={
                      <>
                        <StudentHeader studentInfo={studentInfo} />
                        <PlacementEligibility />
                      </>
                    }
                  />
                </Route>
              </Routes>
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;