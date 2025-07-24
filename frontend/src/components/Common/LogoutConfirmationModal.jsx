import React from 'react';
import { LogOut } from 'lucide-react';

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4"
          style={{ backgroundColor: '#FAF6E9' }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full" style={{ backgroundColor: '#A0C878' }}>
              <LogOut className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-center mb-2" style={{ color: '#2E4057' }}>
            Confirm Logout
          </h3>
          
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to log out of your account?
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ backgroundColor: '#A0C878' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutConfirmationModal; 