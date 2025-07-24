import React from 'react';
import { Home, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSidebarStore } from '../../zustand/useSidebarStore'; // ensure correct path
import LearnHubLogo from '../Common/LearnHubLogo';
import useAuthStore from '../../zustand/authStore'; // ensure correct path

const Sidebar = ({ isOpen, onClose, className = "" }) => {
  const { activeTab, setActiveTab } = useSidebarStore();

  const handleclick = async (clickedTab) => {
    setActiveTab(clickedTab);
    const { initialize } = useAuthStore.getState();
    await initialize();
    // Close mobile sidebar when item is clicked
    if (onClose) {
      onClose();
    }
  };

  const menuItems = [
    { compId: 'dashboard', label: 'Dashboard', icon: Home },
    { compId: 'browse', label: 'Browse Courses', icon: BookOpen },
  ];

  return (
    <>
      {/* Desktop Sidebar - Always visible on lg+ screens */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 shadow-lg z-50 transition-all duration-300" style={{ backgroundColor: '#FFFDF6' }}>
        {/* Brand Section */}
        <div className="p-6 border-b flex items-center justify-start" style={{ borderColor: '#DDEB9D' }}>
          <LearnHubLogo />
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1">
          <ul className="space-y-2">
            {menuItems.map(({ compId, label, icon: Icon }) => {
              const isActive = activeTab === compId;

              return (
                <li key={compId}>
                  <Link to={`/${compId}`}>
                    <button
                      onClick={() => handleclick(compId)}
                      className={`w-full flex items-center justify-start px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive ? 'text-white shadow-md' : 'text-gray-700 hover:text-gray-900'
                      }`}
                      style={{
                        backgroundColor: isActive ? '#A0C878' : 'transparent',
                      }}
                    >
                      <Icon size={20} className="mr-3 flex-shrink-0" />
                      <span className="font-medium">{label}</span>
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile/Tablet Sidebar - Slides in when open */}
      <div 
        className={`lg:hidden fixed left-0 top-0 h-full w-64 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className}`}
        style={{ backgroundColor: '#FFFDF6' }}
      >
        {/* Brand Section */}
        <div className="p-4 sm:p-6 border-b flex items-center justify-start" style={{ borderColor: '#DDEB9D' }}>
          <LearnHubLogo />
        </div>

        {/* Navigation */}
        <nav className="mt-4 sm:mt-6 px-2 sm:px-3 flex-1">
          <ul className="space-y-2">
            {menuItems.map(({ compId, label, icon: Icon }) => {
              const isActive = activeTab === compId;

              return (
                <li key={compId}>
                  <Link to={`/${compId}`}>
                    <button
                      onClick={() => handleclick(compId)}
                      className={`w-full flex items-center justify-start px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                        isActive ? 'text-white shadow-md' : 'text-gray-700 hover:text-gray-900'
                      }`}
                      style={{
                        backgroundColor: isActive ? '#A0C878' : 'transparent',
                      }}
                    >
                      <Icon size={18} className="mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="font-medium">{label}</span>
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Compact Bottom Navigation for very small screens (optional alternative) */}
      <div 
        className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 px-2 py-2"
        style={{ backgroundColor: '#FFFDF6', borderColor: '#DDEB9D' }}
      >
        <div className="flex justify-around items-center max-w-md mx-auto">
          {menuItems.map(({ compId, label, icon: Icon }) => {
            const isActive = activeTab === compId;

            return (
              <Link key={compId} to={`/${compId}`} className="flex-1">
                <button
                  onClick={() => handleclick(compId)}
                  className={`w-full flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={{
                    backgroundColor: isActive ? '#A0C878' : 'transparent',
                  }}
                >
                  <Icon size={20} className="mb-1" />
                  <span className="text-xs font-medium truncate w-full text-center">{label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;