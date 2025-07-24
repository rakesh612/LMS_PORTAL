import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, LogOut } from 'lucide-react';
import LearnHubLogo from '../Common/LearnHubLogo';
import useAuthStore from '../../zustand/authStore';
import LogoutConfirmationModal from '../Common/LogoutConfirmationModal';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users className="w-5 h-5" />, label: 'Pending Requests', path: '/admin/pending-requests' },
  ];

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out border-r`}
        style={{ 
          backgroundColor: '#FAF6E9',
          borderColor: '#DDEB9D'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6">
            <LearnHubLogo />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-[#A0C878] text-white'
                    : 'hover:bg-[#DDEB9D] text-[#2E4057]'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t" style={{ borderColor: '#DDEB9D' }}>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-[#2E4057] hover:bg-[#DDEB9D] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default AdminSidebar; 