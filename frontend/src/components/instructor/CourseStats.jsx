import React from 'react';

const CourseStats = ({ icon, title, value, color }) => {
  return (
    <div 
      className="p-4 sm:p-6 rounded-xl shadow-sm transition-transform hover:scale-105"
      style={{ backgroundColor: '#FAF6E9' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm sm:text-base font-medium" style={{ color: '#2E4057' }}>{title}</p>
          <p className="text-xl sm:text-2xl font-bold mt-1" style={{ color: '#2E4057' }}>{value}</p>
        </div>
        <div 
          className="p-2 sm:p-3 rounded-lg"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default CourseStats; 