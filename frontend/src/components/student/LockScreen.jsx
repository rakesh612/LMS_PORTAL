import { Lock } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const LockScreen = () => {
    return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200 max-w-md mx-4">
        <div className="mb-6">
          <Lock size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#2E4057' }}>
            Course Locked
          </h2>
          <p className="text-lg opacity-70 mb-6" style={{ color: '#2E4057' }}>
            Enroll to access the full course content
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm opacity-60" style={{ color: '#2E4057' }}>
            You can only view the first lesson as a preview. 
            To unlock all lessons and course materials, please enroll in this course.
          </p>
          <button 
            className="w-full bg-[#A0C878] hover:cursor-pointer text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => {
              // Navigate to enrollment page or show enrollment modal
              // You can implement this based on your app's flow
              console.log('Navigate to enrollment');
            }}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
    )
}

export default LockScreen