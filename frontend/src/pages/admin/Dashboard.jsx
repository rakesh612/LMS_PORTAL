import React, { useState, useEffect } from 'react';
import { Users, BookOpen, DollarSign, TrendingUp, LogOut } from 'lucide-react';
import AdminStats from '../../components/admin/AdminStats';
import PendingRequestsSection from '../../components/admin/PendingRequestsSection';
import toast from 'react-hot-toast';
import useAuthStore from '../../zustand/authStore';
import LogoutConfirmationModal from '../../components/Common/LogoutConfirmationModal';
import LearnHubLogo from '../../components/Common/LearnHubLogo';
import { getIncome, getNoOfInstructors, getNoOfStudents, getNoOfCourses } from '../../api/admin';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeInstructors: 0
  });
  const [loading, setLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [incomeResponse, coursesResponse, instructorsResponse, studentsResponse] = await Promise.all([
        getIncome(),
        getNoOfCourses(),
        getNoOfInstructors(),
        getNoOfStudents()
      ]);

      if (incomeResponse.success && instructorsResponse.success && studentsResponse.success) {
        setStats({
          totalUsers: studentsResponse.noOfStudents,
          totalCourses: coursesResponse.noOfCourses, // TODO: Add API endpoint for total courses
          totalRevenue: incomeResponse.income || 0,
          activeInstructors: instructorsResponse.noOfInstructors
        });
      } else {
        throw new Error('Failed to fetch some dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF6E9' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#A0C878' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF6E9' }}>
      <div className="flex-1 flex justify-center items-start p-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
            <div className="flex flex-col items-center sm:items-start w-full sm:w-1/4">
              <LearnHubLogo />
            </div>
            <h1 className="text-2xl font-bold text-center w-full sm:w-auto mt-2 sm:mt-0" style={{ color: '#2E4057' }}>
              Admin Dashboard
            </h1>
            <div className="w-full sm:w-1/4 flex justify-center sm:justify-end mt-2 sm:mt-0">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-[#2E4057] hover:bg-[#DDEB9D] transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AdminStats
              icon={<Users className="w-6 h-6 text-white" />}
              title="Total Users"
              value={stats.totalUsers}
              color="#A0C878"
            />
            <AdminStats
              icon={<BookOpen className="w-6 h-6 text-white" />}
              title="Total Courses"
              value={stats.totalCourses}
              color="#A0C878"
            />
            <AdminStats
              icon={<DollarSign className="w-6 h-6 text-white" />}
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString()}`}
              color="#A0C878"
            />
            <AdminStats
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              title="Active Instructors"
              value={stats.activeInstructors}
              color="#A0C878"
            />
          </div>

          {/* Pending Requests Section */}
          <PendingRequestsSection />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default Dashboard; 