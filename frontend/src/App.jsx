import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Verifymail from "./components/Auth/Verifymail";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";
import Browse from "./pages/student/Browse";
import Dashboard from "./pages/student/Dashboard";
import ShowCourse from "./pages/student/ShowCourse";
import ViewCourseContent from "./pages/student/ViewCourseContent";
import useAuthStore from "./zustand/authStore";
import { Toaster } from "react-hot-toast";
import InstructorDashboard from "./pages/instructor/Dashboard";
import CourseDetails from "./pages/instructor/CourseDetails";
import QuizManagement from "./pages/instructor/QuizManagement";
import AdminDashboard from "./pages/admin/Dashboard";
import InstructorRegister from "./pages/Auth/InstructorRegister";
import AddDiscussion from "./pages/student/AddDiscussion";

function App() {
  const { user, loading, initialCheckDone, initialize } = useAuthStore();

  useEffect(() => {
    if (!initialCheckDone) {
      initialize();
    }
  }, [initialCheckDone, initialize]);

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0C878]"></div>
    </div>
  );

  // Handle verification redirects
  const handleVerificationRedirect = () => {
    if (!user.isVerified) {
      if (user.role === "user") {
        return <Navigate to="/verify-email" replace />;
      } else if (user.role === "instructor") {
        return <Navigate to="/instructor/register" replace />;
      }
    }
    return null;
  };

  // Public Route - Redirects to appropriate dashboard if user is logged in
  const PublicRoute = ({ children }) => {
    if (loading) return <LoadingSpinner />;
    
    if (user) {
      const verificationRedirect = handleVerificationRedirect();
      if (verificationRedirect) return verificationRedirect;

      if (user.isVerified) {
        switch (user.role) {
          case "user":
            return <Navigate to="/dashboard" replace />;
          case "instructor":
            return <Navigate to="/instructor/dashboard" replace />;
          case "admin":
            return <Navigate to="/admin/dashboard" replace />;
          default:
            return <Navigate to="/unauthorized" replace />;
        }
      }
    }
    return children;
  };

  // Protected Route - Ensures user is authenticated and has correct role
  const ProtectedRouteWithRole = ({ children, allowedRoles }) => {
    if (loading) return <LoadingSpinner />;

    if (!user) {
      return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
    }

    const verificationRedirect = handleVerificationRedirect();
    if (verificationRedirect) return verificationRedirect;

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  // Special route for instructor registration - only accessible by unverified instructors
  const InstructorRegistrationRoute = ({ children }) => {
    if (loading) return <LoadingSpinner />;

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (user.role !== "instructor" || user.isVerified) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage onRegister={initialize} />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PublicRoute>
                <Verifymail />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword onSubmit={initialize}/>
              </PublicRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRouteWithRole allowedRoles={["user"]}>
                <Dashboard />
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/browse"
            element={
              <ProtectedRouteWithRole allowedRoles={["user"]}>
                <Browse />
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/course/:id"
            element={
              <ProtectedRouteWithRole allowedRoles={["user"]}>
                <ShowCourse />
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/course/:id/viewCourse"
            element={
              <ProtectedRouteWithRole allowedRoles={["user"]}>
                <ViewCourseContent />
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/course/:id/addDiscussion"
            element={
              <AddDiscussion />
            }
          />

          {/* Instructor Routes */}
          <Route
            path="/instructor/register"
            element={
              <InstructorRegistrationRoute>
                <InstructorRegister />
              </InstructorRegistrationRoute>
            }
          />
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRouteWithRole allowedRoles={["instructor"]}>
                <InstructorDashboard />
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/instructor/course/:courseId"
            element={
              <ProtectedRouteWithRole allowedRoles={["instructor"]}>
                <CourseDetails />
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/instructor/quiz/:lessonId"
            element={
              <ProtectedRouteWithRole allowedRoles={["instructor"]}>
                <QuizManagement />
              </ProtectedRouteWithRole>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRouteWithRole allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRouteWithRole>
            }
          />

          {/* Default & Fallback Routes */}
          <Route
            path="/"
            element={
              loading ? (
                <LoadingSpinner />
              ) : user ? (
                <Navigate
                  to={
                    user.role === "user"
                      ? "/dashboard"
                      : user.role === "instructor"
                      ? "/instructor/dashboard"
                      : "/admin/dashboard"
                  }
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
