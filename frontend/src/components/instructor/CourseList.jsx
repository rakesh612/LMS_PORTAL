import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, DollarSign, TrendingUp, BookOpen } from 'lucide-react';
import { getCourseIncome } from '../../api/instructor';

const CourseList = ({ courses }) => {
  const navigate = useNavigate();
  const [courseIncomes, setCourseIncomes] = useState({});

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        for (const course of courses) {
          const response = await getCourseIncome(course._id);
          if (response.data.success) {
            setCourseIncomes(prev => ({
              ...prev,
              [course._id]: response.data.income
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching course incomes:', error);
      }
    };

    fetchIncomes();
  }, []);

  const handleViewDetails = (courseId) => {
    navigate(`/instructor/course/${courseId}`);
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No courses found. Create your first course to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course._id}
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          style={{ backgroundColor: '#FFFDF6' }}
        >
          <div className="relative h-48">
            <img
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#f8f8f8'
              }}
              src={course.photoUrl}
              alt={course.name}
            />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2" style={{ color: '#2E4057' }}>
              {course.name}
            </h3>
            
            {/* Course Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>{course.lessons?.length || 0} lessons</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>{course.duration || 0} hours</span>
              </div>
            </div>

            {/* Income and Price Section */}
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FAF6E9' }}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" style={{ color: '#A0C878' }} />
                  <span className="text-sm font-medium" style={{ color: '#2E4057' }}>Income</span>
                </div>
                <span className="text-lg font-bold" style={{ color: '#A0C878' }}>
                  ₹{courseIncomes[course._id] || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" style={{ color: '#2E4057' }} />
                  <span className="text-sm font-medium" style={{ color: '#2E4057' }}>Price</span>
                </div>
                <span className="text-lg font-bold" style={{ color: '#2E4057' }}>
                  ₹{course.price || 0}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleViewDetails(course._id)}
              className="w-full py-2 rounded-lg text-white font-medium transition-all hover:scale-105"
              style={{ backgroundColor: '#A0C878' }}
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList; 
