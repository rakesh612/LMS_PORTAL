import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/student/Sidebar';
import CourseGrid from '../../components/student/CourseGrid';
import axios from "axios";
import useAuthStore from '../../zustand/authStore';
import LoadingScreen from '../../components/Loading';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchCourses = async () => {
    if(!user) return; // Ensure user is defined before making API call
    try {
      
      const response = await axios.post(
        `/api/users/getAllCourses`,
        {},
        { withCredentials: true }
      );
      
      
      const userCourses = await user?.enrolledCourses || [];
      const res = response.data.courses.filter(
        course => userCourses.includes(course._id)
      );
      
      setEnrolledCourses(res);
      setDataLoaded(true);
    } catch (error) {
      console.error("Failed to fetch courses", error);
      setDataLoaded(true); // Mark data as loaded even on error
    }
  };

  useEffect(() => {
    // Start minimum loading timer
    const minLoadingTimer = setTimeout(() => {
      setMinLoadingTimePassed(true);
    }, 1000);

    // Fetch data
    fetchCourses();

    return () => {
      clearTimeout(minLoadingTimer);
    };
  }, [user]);

  useEffect(() => {
    // Hide loading screen when both conditions are met:
    // 1. Minimum 1 second has passed
    // 2. Data has been loaded (success or error)
    if (minLoadingTimePassed && dataLoaded) {
      setLoading(false);
    }
  }, [minLoadingTimePassed, dataLoaded]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  if (loading) return <LoadingScreen message="Loading your courses..." />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF6E9' }}>
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden p-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-700 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar - Fixed with higher z-index */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out bg-white shadow-lg`}
        >
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full lg:w-[calc(100%-16rem)] relative">
          {/* Blur overlay for mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 z-30 bg-black bg-opacity-20 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          <div className={`w-full p-4 transition-all duration-300 ${isSidebarOpen ? 'lg:blur-0 blur-sm' : ''}`}>
            <CourseGrid courses={enrolledCourses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;