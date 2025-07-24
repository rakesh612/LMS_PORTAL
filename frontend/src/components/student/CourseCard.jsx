import { ChevronRight } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCourseStore from "../../zustand/currentCourse"
import axios from "axios";
import useAuthStore from "../../zustand/authStore";
const CourseCard = ({
  id,
  image,
  topic,
  hours,
  description = "No description available.",
  rating = "4.1",
  lessons = [],
  price = 0,
  tutor,
  skills = [],
}) => {

  const [progress, setProgress] = useState(-1);
  const user = useAuthStore((state) => state.user);
  const setSelectedCourse = useCourseStore((state) => state.setSelectedCourse)
  const enrolled = user?.enrolledCourses?.includes(id) || false;

  useEffect(() => {
    
    const fetchData = async () => {
      if (!id) return;
      if(!enrolled)return;
      //setLoading(true);
      try {
       
        const progressResponse = await axios.post(
          `${import.meta.env.VITE_API_USER_URL}/getProgress`,
          { courseId: id },
          { withCredentials: true }
        );

        const progressData = progressResponse.data.progress;
        
        if (!Array.isArray(progressData)) {
          console.error("Progress data is not an array!", progressData);
          return;
        }


        
        // Assuming `progress` is your 2D array and each row has 3 items
        let total = 0;
        for (const row of progressData) {
          for (const val of row) {
            if (val >= 1) total++;
          }
        }

        // Total possible progress units: 3 items per lesson × number of lessons
        const maxPossible = 3 * lessons.length;
        total = (100*total)/maxPossible;

        const overallProgress = total > 0 ? Math.round(total) : 0;

        setProgress(overallProgress);


      } catch (progressError) {
        console.error("Error fetching progress data:", progressError);

      } finally {
        //setLoading(false);
      }
    }


    fetchData();
  }, []);







  useEffect(() => {
    if (user?.enrolledCourses?.includes(id)) {
      setProgress(0);
    }
  }, [])


  const navigate = useNavigate();
  //console.log(id);
  const handleClick = () => {
    setSelectedCourse({
      id,
      image,
      topic,
      hours,
      description,
      rating,
      lessons,
      price,
      tutor,
      skills,
      progress,
    });
    navigate(`/course/${id}`);
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 w-full bg-[#FFFDF6]">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={topic}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-[#A0C878]">
            Course
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {topic}
        </h3>

        <p className="text-sm text-gray-600 mb-2 line-clamp-3">{description}</p>

        <div className="text-sm text-gray-700 mb-2">
          <span className="font-medium">Price:</span> ₹{price}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 rounded-full border border-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Progress Tracker */}
        {enrolled == true && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#A0C878",
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Show More Button */}
        <button
          onClick={handleClick}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg border text-base font-semibold transition-all duration-200 bg-[#fdfcf5] border-[#3a4c5a]/20 group hover:shadow-md hover:bg-[#A0C878]"
        >
          <span className="text-[#1f2c3c]">Show More</span>
          <span className="ml-2 p-1 rounded-sm">
            <ChevronRight size={16} className="text-[#1f2c3c]" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
