import React, { useState, useMemo } from 'react';
import { Search, X, User, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import CourseCard from './CourseCard';
import useAuthStore from '../../zustand/authStore';
import axios from 'axios';
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom';
import { useSidebarStore } from '../../zustand/useSidebarStore'; // ensure correct path


const CourseGrid = ({ courses }) => {

  const { activeTab, setActiveTab } = useSidebarStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) {
      return courses;
    }

    return courses.filter(course =>
      course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skills?.some(skill =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, courses]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsProfileOpen(false);
  };

  const confirmLogout = async () => {
    const logout = useAuthStore.getState().logout;

    try {
      await logout(); // this handles API call + Zustand cleanup
      toast.success("Logged out successfully");
      setActiveTab('dashboard');
      navigate("/register");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Something went wrong. Please try again.");
    }

    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FAF6E9' }}>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
          <div
            className="bg-white rounded-xl p-4 sm:p-6 max-w-sm w-[90%] mx-4"
            style={{
              backgroundColor: '#FFFDF6',
              border: '2px solid #DDEB9D'
            }}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Confirm Logout</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-2 sm:space-x-3">
              <button
                onClick={cancelLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base text-gray-800 font-medium transition-all duration-200 hover:bg-gray-100"
                style={{ backgroundColor: '#FAF6E9' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base text-white font-medium transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: '#A0C878' }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Profile Dropdown */}
      <div className="fixed top-2 sm:top-4 right-2 sm:right-4 md:right-6 lg:right-8 z-40">
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-full hover:bg-white transition-all duration-200"
            style={{ backgroundColor: isProfileOpen ? '#FFFDF6' : 'transparent' }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0C878' }}>
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            {isProfileOpen ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#A0C878' }} />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#A0C878' }} />
            )}
          </button>

          {isProfileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 sm:w-64 rounded-xl shadow-lg overflow-hidden"
              style={{
                backgroundColor: '#FFFDF6',
                border: '2px solid #DDEB9D'
              }}
            >
              <div className="p-3 sm:p-4 border-b" style={{ borderColor: '#DDEB9D' }}>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0C878' }}>
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-gray-800">{user.name}</p>
                    <p className="text-xs sm:text-sm" style={{ color: '#A0C878' }}>{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  style={{ backgroundColor: '#FAF6E9' }}
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#A0C878' }} />
                  <span className="text-sm sm:text-base text-gray-800">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 sm:pt-12">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
            Discover Amazing Courses
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6">
            Find the perfect course to advance your skills and career
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8 max-w-4xl mx-auto px-2 sm:px-4">
          <div className="relative">
            <div
              className={`relative bg-white rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 ${isSearchFocused ? 'shadow-lg' : 'shadow-md'}`}
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF6 100%)',
                border: isSearchFocused ? '2px solid #A0C878' : '2px solid #DDEB9D'
              }}
            >
              <div className="flex items-center p-2 sm:p-3 md:p-4">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3" style={{ backgroundColor: '#A0C878' }}>
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search courses..."
                  className="flex-1 text-sm sm:text-base text-gray-800 placeholder-gray-500 bg-transparent border-none outline-none"
                />

                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="ml-1 sm:ml-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  </button>
                )}

                <button
                  className="ml-1 sm:ml-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base text-white font-semibold transition-all duration-200 hover:shadow-md transform hover:scale-102"
                  style={{ backgroundColor: '#A0C878' }}
                >
                  Search
                </button>
              </div>
            </div>

            <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 rounded-full animate-pulse" style={{ backgroundColor: '#DDEB9D' }}></div>
            <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-pulse delay-1000" style={{ backgroundColor: '#A0C878' }}></div>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-4 sm:mb-6 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              {filteredCourses.length === 0 ? (
                <span className="text-red-500">No courses found for "{searchQuery}"</span>
              ) : (
                <span>
                  Found <span className="font-semibold text-green-600">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''}
                  {searchQuery && <span> for "<span className="font-semibold" style={{ color: '#A0C878' }}>{searchQuery}</span>"</span>}
                </span>
              )}
            </p>
          </div>
        )}

        {/* No Courses Available (when not searching) */}
        {!searchQuery && courses.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DDEB9D' }}>
              <X className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#A0C878' }} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No courses available</h3>
            <p className="text-sm sm:text-base text-gray-600">Check back later for new courses or contact support.</p>
          </div>
        )}

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {filteredCourses.map((course, index) => (
              <CourseCard
                key={course._id || index}
                id={course._id}
                image={course.photoUrl}
                topic={course.name}
                description={course.description}
                lessons={course.lessons}
                price={course.price}
                tutor={course.tutor}
                skills={course.skills}
              />
            ))}
          </div>
        ) : searchQuery ? (
          // No Results Found for search
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DDEB9D' }}>
              <Search className="w-8 h-8 sm:w-12 sm:h-12" style={{ color: '#A0C878' }} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">Try searching with different keywords or browse our popular courses below.</p>
            <button
              onClick={clearSearch}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base text-white font-semibold transition-all duration-200 hover:shadow-md transform hover:scale-102"
              style={{ backgroundColor: '#A0C878' }}
            >
              Clear Search
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CourseGrid;
