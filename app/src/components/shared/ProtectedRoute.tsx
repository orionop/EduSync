import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { SkeletonCard, SkeletonStat } from '../test/Skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6" role="status" aria-label="Loading">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-60 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <SkeletonStat />
                <SkeletonStat />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
