// src/pages/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">403 - Unauthorized</h1>
        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-[#A0C878] text-white rounded-md hover:bg-[#8fb862]"
        >
          Go back to home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
