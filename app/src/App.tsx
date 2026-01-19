import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import EdChatbot from './components/shared/EdChatbot';
import PageLoader from './components/shared/PageLoader';

// Lazy load all route components for code splitting
const LoginPage = lazy(() => import('./routes/login/LoginPage'));
const AuthCallback = lazy(() => import('./routes/auth/AuthCallback'));
const StudentLayout = lazy(() => import('./components/student/StudentLayout'));
const FacultyLayout = lazy(() => import('./components/faculty/FacultyLayout'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const StudentDashboard = lazy(() => import('./routes/student/Dashboard'));
const ExamPrerequisites = lazy(() => import('./routes/student/ExamPrerequisites'));
const ExamTimetable = lazy(() => import('./routes/student/ExamTimetable'));
const Results = lazy(() => import('./routes/student/Results'));
const KTSection = lazy(() => import('./routes/student/KTSection'));
const Submissions = lazy(() => import('./routes/student/Submissions'));
const PlacementEligibility = lazy(() => import('./routes/student/PlacementEligibility'));
const FacultyDashboard = lazy(() => import('./routes/faculty/Dashboard'));
const MarksCalculation = lazy(() => import('./routes/faculty/MarksCalculation'));
const ViewResults = lazy(() => import('./routes/faculty/ViewResults'));
const ProctorSection = lazy(() => import('./routes/faculty/ProctorSection'));
const CameraFeed = lazy(() => import('./routes/faculty/CameraFeed'));
const MarksSubmissionView = lazy(() => import('./routes/faculty/MarksSubmissionView'));
const FacultySupervisorDuty = lazy(() => import('./routes/faculty/SupervisorDuty'));
const EndSemesterEvaluationPage = lazy(() => import('./routes/faculty/EndSemesterEvaluationPage'));
const Revaluation = lazy(() => import('./routes/faculty/Revaluation'));
const AdminDashboard = lazy(() => import('./routes/admin/AdminDashboard'));
const AdminExamPrerequisites = lazy(() => import('./routes/admin/ExamPrerequisites'));
const AdminSupervisoryDuty = lazy(() => import('./routes/admin/SupervisoryDuty'));
const DuringExam = lazy(() => import('./routes/admin/DuringExam'));
const PostExam = lazy(() => import('./routes/admin/PostExam'));
const ExamEvaluation = lazy(() => import('./routes/admin/ExamEvaluation'));
const TestDashboard = lazy(() => import('./routes/test/TestDashboard'));
const TestExamPrerequisites = lazy(() => import('./routes/test/TestExamPrerequisites'));
const TestExamTimetable = lazy(() => import('./routes/test/TestExamTimetable'));
const TestResults = lazy(() => import('./routes/test/TestResults'));
const TestKTSection = lazy(() => import('./routes/test/TestKTSection'));
const TestSubmissions = lazy(() => import('./routes/test/TestSubmissions'));
const TestPlacementEligibility = lazy(() => import('./routes/test/TestPlacementEligibility'));
const UnauthorizedPage = lazy(() => import('./routes/UnauthorizedPage'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <LoginPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/auth/callback" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AuthCallback />
                  </Suspense>
                } 
              />
              
              {/* Student Routes */}
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute requiredRole="student">
                    <Suspense fallback={<PageLoader />}>
                      <StudentLayout />
                    </Suspense>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><StudentDashboard /></Suspense>} />
                <Route path="exam-prerequisites" element={<Suspense fallback={<PageLoader />}><ExamPrerequisites /></Suspense>} />
                <Route path="exam-timetable" element={<Suspense fallback={<PageLoader />}><ExamTimetable /></Suspense>} />
                <Route path="results" element={<Suspense fallback={<PageLoader />}><Results /></Suspense>} />
                <Route path="kt-section" element={<Suspense fallback={<PageLoader />}><KTSection /></Suspense>} />
                <Route path="submissions" element={<Suspense fallback={<PageLoader />}><Submissions /></Suspense>} />
                <Route path="placement-eligibility" element={<Suspense fallback={<PageLoader />}><PlacementEligibility /></Suspense>} />
              </Route>

          {/* Faculty Routes */}
          <Route
            path="/faculty/*"
            element={
              <ProtectedRoute requiredRole="faculty">
                <Suspense fallback={<PageLoader />}>
                  <FacultyLayout />
                </Suspense>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><FacultyDashboard /></Suspense>} />
            <Route path="marks-calculation" element={<Suspense fallback={<PageLoader />}><MarksCalculation /></Suspense>} />
            <Route path="view-results" element={<Suspense fallback={<PageLoader />}><ViewResults /></Suspense>} />
            <Route path="marks-submission/:classroomId" element={<Suspense fallback={<PageLoader />}><MarksSubmissionView /></Suspense>} />
            <Route path="proctor-section" element={<Suspense fallback={<PageLoader />}><ProctorSection /></Suspense>} />
            <Route path="camera-feed/:classroomId" element={<Suspense fallback={<PageLoader />}><CameraFeed /></Suspense>} />
            <Route path="supervisor-duty" element={<Suspense fallback={<PageLoader />}><FacultySupervisorDuty /></Suspense>} />
            <Route path="end-semester-evaluation" element={<Suspense fallback={<PageLoader />}><EndSemesterEvaluationPage /></Suspense>} />
            <Route path="revaluation" element={<Suspense fallback={<PageLoader />}><Revaluation /></Suspense>} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <AdminLayout />
                </Suspense>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
            <Route path="exam-prerequisites" element={<Suspense fallback={<PageLoader />}><AdminExamPrerequisites /></Suspense>} />
            <Route path="supervisory-duty" element={<Suspense fallback={<PageLoader />}><AdminSupervisoryDuty /></Suspense>} />
            <Route path="during-exam" element={<Suspense fallback={<PageLoader />}><DuringExam /></Suspense>} />
            <Route path="post-exam" element={<Suspense fallback={<PageLoader />}><PostExam /></Suspense>} />
            <Route path="exam-evaluation" element={<Suspense fallback={<PageLoader />}><ExamEvaluation /></Suspense>} />
          </Route>

          {/* Test Routes - UI Sandbox (Student Portal with refined UI) */}
          <Route path="/test">
            <Route
              index
              element={
                <ProtectedRoute requiredRole="test">
                  <Navigate to="dashboard" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRole="test">
                  <Suspense fallback={<PageLoader />}>
                    <TestDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="exam-prerequisites"
              element={
                <ProtectedRoute requiredRole="test">
                  <Suspense fallback={<PageLoader />}>
                    <TestExamPrerequisites />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="exam-timetable"
              element={
                <ProtectedRoute requiredRole="test">
                  <Suspense fallback={<PageLoader />}>
                    <TestExamTimetable />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="results"
              element={
                <ProtectedRoute requiredRole="test">
                  <Suspense fallback={<PageLoader />}>
                    <TestResults />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="kt-section"
              element={
                <ProtectedRoute requiredRole="test">
                  <Suspense fallback={<PageLoader />}>
                    <TestKTSection />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="submissions"
              element={
                <ProtectedRoute requiredRole="test">
                  <Suspense fallback={<PageLoader />}>
                    <TestSubmissions />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="placement-eligibility"
              element={
                <ProtectedRoute requiredRole="test">
                  <Suspense fallback={<PageLoader />}>
                    <TestPlacementEligibility />
                  </Suspense>
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Unauthorized */}
          <Route 
            path="/unauthorized" 
            element={
              <Suspense fallback={<PageLoader />}>
                <UnauthorizedPage />
              </Suspense>
            } 
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" />
        <EdChatbot />
      </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
