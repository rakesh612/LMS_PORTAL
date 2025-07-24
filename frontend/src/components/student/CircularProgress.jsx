import { Check } from 'lucide-react';
import React from 'react'

const CircularProgress = ({ percentage, size = 24, strokeWidth = 2 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={percentage === 100 ? "#A0C878" : "#2E4057"} // Green for complete, blue for partial
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        {percentage === 100 ? (
          <Check
            size={size * 0.6} 
            className="absolute inset-0 m-auto text-green-500" 
            strokeWidth={3}
          />
        ) : (
          <span 
            className="absolute inset-0 flex items-center justify-center text-xs font-bold"
            style={{ color: percentage > 0 ? "#3B82F6" : "#9CA3AF" }}
          >
            {percentage}%
          </span>
        )}
      </div>
    );
  };

export default CircularProgress
