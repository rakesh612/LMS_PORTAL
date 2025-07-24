import { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuthStore from '../../zustand/authStore';

const ProtectedRoute = ({ roles }) => {
  const { user, loading, initialCheckDone, initialize } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!initialCheckDone) {
      initialize();
    }
  }, [initialize, initialCheckDone]);

  if (loading || !initialCheckDone) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0C878]"></div>
      </div>
    );
  }

  if (!user) {
    console.log("here");
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
