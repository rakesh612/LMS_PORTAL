import React, { useState, useEffect } from "react";
import { BookOpen, ChevronRight, Plus, LogOut } from "lucide-react";
import CourseStats from "../../components/instructor/CourseStats";
import CourseList from "../../components/instructor/CourseList";
import useAuthStore from "../../zustand/authStore";
import AddCourseModal from "../../components/instructor/AddCourseModal";
import LogoutConfirmationModal from "../../components/Common/LogoutConfirmationModal";
import { getMyCourses, getTotalIncome, addCourse } from "../../api/instructor";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalIncome: 0,
  });
  const [courses, setCourses] = useState([]);
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch courses
      const coursesResponse = await getMyCourses();
      const coursesData = coursesResponse.data.courses || [];

      setCourses(coursesData);

      // Fetch total income
      const incomeResponse = await getTotalIncome();
      const totalIncome = incomeResponse.data.income || 0;

      setStats({
        totalCourses: coursesData.length,
        totalIncome,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // useEffect(() => {
  //   fetchDashboardData();
  // }, [isAddCourseModalOpen]);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFFDF6" }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0C878]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFDF6" }}>
      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "#2E4057" }}
            >
              Welcome back, {user?.name || "Instructor"}!
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Here's what's happening with your courses today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center px-4 py-2 rounded-lg text-[#2E4057] font-medium transition-all hover:bg-[#DDEB9D]"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span>Logout</span>
            </button>
            <button
              onClick={() => setIsAddCourseModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105"
              style={{ backgroundColor: "#A0C878" }}
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>Add Course</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <CourseStats
            icon={<BookOpen className="w-6 h-6" />}
            title="Total Courses"
            value={stats.totalCourses}
            color="#A0C878"
          />
          <CourseStats
            icon={<BookOpen className="w-6 h-6" />}
            title="Total Income"
            value={`₹${stats.totalIncome}`}
            color="#DDEB9D"
          />
        </div>

        {/* Course List */}
        <div
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
          style={{ backgroundColor: "#FAF6E9" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold" style={{ color: "#2E4057" }}>
              Your Courses
            </h2>
            <button
              className="flex items-center text-sm self-start sm:self-auto"
              style={{ color: "#A0C878" }}
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <CourseList courses={courses} />
        </div>
      </div>

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onCourseAdded={fetchDashboardData}
      />

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
