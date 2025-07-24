
import React, { useState, useEffect, useMemo } from 'react'
import { Menu, X, Play, FileText, HelpCircle, ChevronDown, ChevronRight, Lock, ArrowLeft, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import ContentViewer from '../../components/student/ContentViewer'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'
import useCourseStore from '../../zustand/currentCourse'
import useAuthStore from '../../zustand/authStore'
import LockScreen from '../../components/student/LockScreen'
import LoadingScreen from '../../components/Loading'
import toast from 'react-hot-toast'

const ViewCourseContent = () => {
  const navigate = useNavigate();
  const [expandedLessons, setExpandedLessons] = useState({})
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedContent, setSelectedContent] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [progress, setProgress] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false) // New state for mobile sidebar
  const course = useCourseStore((state) => state.selectedCourse);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!course?.id) return;
      setLoading(true);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_USER_URL}/getCurrentCourse`,
          { courseId: course.id },
          { withCredentials: true }
        );

        if (response.data.success) {
          const enrolled = user?.enrolledCourses?.includes(course.id) || false;
          setIsEnrolled(enrolled);

          const lessonsData = enrolled ?
            response.data.arrayOfLessons :
            (response.data.arrayOfLessons[0] ? [response.data.arrayOfLessons[0]] : []);

          setLessons(lessonsData);

          // Fetch progress data from server
          try {
            const progressResponse = await axios.post(
              `${import.meta.env.VITE_API_USER_URL}/getProgress`,
              { courseId: course.id },
              { withCredentials: true }
            );

            const progressData = progressResponse.data.progress;
            console.log("here",progressResponse)
            const initialProgress = {};

            lessonsData?.forEach((lesson, index) => {
              const key = lesson.id || `lesson-${index}`;

              // Initialize with backend data if available, else defaults
              if (index < progressData?.length && progressData[index]) {
                const [videoProgress, quizProgress, fileProgress] = progressData[index];

                initialProgress[key] = {
                  video: videoProgress >= 1,  // 1 = completed
                  quiz: quizProgress >= 1,    // -1 = not available, 0 = not completed
                  file: fileProgress >= 1
                };
              } else {
                // Default state for new lessons
                initialProgress[key] = {
                  video: false,
                  quiz: false,
                  file: false
                };
              }
            });

            setProgress(initialProgress);

          } catch (progressError) {
            console.error("Error fetching progress data:", progressError);
            // Initialize with default values if progress fetch fails
            const initialProgress = {};
            lessonsData.forEach((lesson, index) => {
              const key = lesson.id || `lesson-${index}`;
              initialProgress[key] = {
                video: false,
                quiz: false,
                file: false
              };
            });
            setProgress(initialProgress);
          }
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        if (error.response?.status === 403) {
          navigate('/courses');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [course?.id, user?.enrolledCourses]);

  // Calculate overall progress percentage
  const overallProgress = useMemo(() => {
    if (Object.keys(progress).length === 0) return 0;

    let totalItems = 0;
    let completedItems = 0;

    Object.values(progress).forEach(lessonProgress => {
      Object.values(lessonProgress).forEach(status => {
        totalItems++;
        if (status) completedItems++;
      });
    });

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [progress]);

  // Calculate lesson progress
  const getLessonProgress = (lessonKey) => {
    if (!progress[lessonKey]) return 0;

    const items = Object.values(progress[lessonKey]);
    const completed = items.filter(status => status).length;
    return items.length > 0 ? Math.round((completed / items.length) * 100) : 0;
  };

  const convertProgressToVector = (progressObj) => {
    return [
      progressObj.video ? 1 : 0,
      progressObj.quiz ? 2 : 0,
      progressObj.file ? 1 : 0
    ];
  };

  const markAsCompleted = async (lessonKey, contentType) => {
    if(item.type === 'quiz')return;
    // Get current progress state for this lesson
    const currentProgress = progress[lessonKey];

    // Update local state first
    setProgress(prev => ({
      ...prev,
      [lessonKey]: {
        ...prev[lessonKey],
        [contentType]: true
      }
    }));

    try {
      // Find lesson index from lessons array
      const lessonIndex = lessons.findIndex(
        lesson => (lesson.id || `lesson-${lessons.indexOf(lesson)}`) === lessonKey
      );

      if (lessonIndex === -1) {
        console.error("Lesson not found");
        return;
      }

      // Convert progress state to vector format
      const progressVector = convertProgressToVector({
        ...currentProgress,
        [contentType]: true  // Include the new completion
      });


      const response = await axios.post(
        `/api/users/updateProgress`,
        {
          courseId: course.id,
          lessonidx: lessonIndex,  // Add lesson index
          progressVector           // Send as array
        },
        { withCredentials: true }
      );

    } catch (error) {
      console.error("Update failed:", error);
      // Revert UI on error
      setProgress(prev => ({
        ...prev,
        [lessonKey]: currentProgress  // Restore previous state
      }));
    }
  };

  // Update handleContentClick to use contentType directly
  const handleContentClick = (item, type, title, lessonKey,index,status) => {
    setSelectedContent({ type, data: item, title });
    // Close sidebar on mobile when content is selected
    
    if(type == 'quiz') {
      if(status == true) {
        toast.success("Quiz already completed");
        return;
      }
      // Navigate to quiz page with lessonKey and index
      navigate(`/course/${course.id}/viewCourse/${lessonKey}/${index}`);
    }
    setSidebarOpen(false);
  };

  const handleBackButton = () => {
    navigate(`/course/${course.id}`)
  }

  const toggleLessonExpansion = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }))
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return <Play size={14} className="text-blue-500" />
      case 'pdf':
      case 'file':
        return <FileText size={14} className="text-red-500" />
      case 'quiz':
        return <HelpCircle size={14} className="text-green-500" />
      default:
        return null
    }
  }

  const renderLessonContent = (lesson, lessonKey) => {
    const contentItems = []

    if (lesson.videoUrl) {
      contentItems.push({
        type: 'video',
        title: lesson.video,
        data: lesson.videoUrl || lesson.video,
        duration: lesson.videoDuration
      })
    }

    if (lesson.notesUrl) {
      contentItems.push({
        type: 'file',
        title: lesson.pdf,
        data: lesson.notesUrl || lesson.pdf
      })
    }

    if (lesson.quizId) {
      contentItems.push({
        type: 'quiz',
        title: lesson.quiz,
        data: lesson.quizData || lesson.quiz
      })
    }

    if (lesson.content && Array.isArray(lesson.content)) {
      contentItems.push(...lesson.content)
    }

    // Add lessonKey to each content item
    return contentItems.map(item => ({ ...item, lessonKey }));
  }

  // Circular progress component
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
            stroke={percentage === 100 ? "#10B981" : "#3B82F6"} // Green for complete, blue for partial
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

  if(loading) return <LoadingScreen/>
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF6' }}>
      {/* Header with progress tracker */}
      <header className="bg-white shadow-sm border-b relative">
        <div className="flex items-center justify-between px-3 sm:px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={handleBackButton}
              className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors mr-3 sm:mr-4"
            >
              <ArrowLeft size={20} className="text-gray-600 sm:w-6 sm:h-6" />
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors mr-3 sm:mr-4 lg:hidden"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            
            <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold truncate" style={{ color: '#2E4057' }}>
              View Course Content
            </h1>
          </div>

          {/* Overall Progress Tracker */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs sm:text-sm font-medium text-gray-600 hidden sm:block">Course Progress</span>
              <span className="text-sm sm:text-lg font-bold" style={{ color: '#2E4057' }}>
                {overallProgress}%
              </span>
            </div>
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#2E4057"
                  strokeWidth="3"
                  strokeDasharray={`${overallProgress}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-[#2E4057]">
                {overallProgress}%
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-3 bg-gray-200">
          <div
            className="h-full bg-[#A0C878] transition-all duration-500 ease-in-out"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-screen relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Lesson Sidebar */}
        <div className={`
          fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
          w-80 sm:w-96 lg:w-80 xl:w-96 bg-white border-r shadow-sm overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          inset-y-0 left-0 lg:block
        `}>
          <div className="p-3 sm:p-4">
            {/* Mobile close button */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: '#2E4057' }}>
                Course Lessons
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="hidden lg:flex items-center justify-between mb-4">
              <h2 className="text-lg xl:text-xl font-bold" style={{ color: '#2E4057' }}>
                Course Lessons
              </h2>
              {!isEnrolled && (
                <Lock size={20} className="text-gray-400" />
              )}
            </div>

            {!isEnrolled && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs sm:text-sm text-yellow-800">
                  <Lock size={14} className="inline mr-2" />
                  Only first lesson available in preview mode
                </p>
              </div>
            )}

            {loading && (
              <LoadingScreen/>
            )}

            {!loading && lessons?.length === 0 && (
              <div className="flex items-center justify-center p-8">
                <div className="text-sm opacity-70" style={{ color: '#2E4057' }}>No lessons available</div>
              </div>
            )}

            {!loading && lessons.length > 0 && (
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const lessonKey = lesson.id || `lesson-${index}`;
                  const currLessonId=lesson._id
                  const lessonProgress = getLessonProgress(lessonKey);
                  const contentItems = renderLessonContent(lesson, lessonKey);

                  return (
                    <div key={lessonKey} className="border rounded-lg overflow-hidden" style={{ backgroundColor: lessonProgress === 100 ? '#A0C878' : '#FAF6E9' }}>
                      {/* Lesson Header */}
                      <div
                        className="p-3 sm:p-4 cursor-pointer hover:bg-opacity-80 transition-all duration-200"
                        onClick={() => toggleLessonExpansion(lessonKey)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs sm:text-sm font-semibold" style={{ color: '#2E4057' }}>
                                Lesson {index + 1}
                              </span>
                              {expandedLessons[lessonKey] ?
                                <ChevronDown size={16} style={{ color: '#2E4057' }} /> :
                                <ChevronRight size={16} style={{ color: '#2E4057' }} />
                              }
                            </div>
                            <h3 className="font-bold text-xs sm:text-sm truncate" style={{ color: '#2E4057' }}>
                              {lesson.title || `Lesson ${index + 1} Content`}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#2E4057' }}>
                              <span>{contentItems.length} Items</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lesson Content Dropdown */}
                      {expandedLessons[lessonKey] && (
                        <div className="border-t bg-white bg-opacity-50">
                          <div className="p-2">
                            {contentItems.map((item, itemIndex) => {
                              const isCompleted = progress[lessonKey]?.[item.type];

                              return (
                                <button
                                  key={itemIndex}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleContentClick(item.data, item.type, item.title, currLessonId,index,isCompleted)
                                  }}
                                  className="w-full flex items-center gap-2 sm:gap-3 p-2 rounded hover:bg-white hover:bg-opacity-70 transition-colors text-xs sm:text-sm text-left"
                                >
                                  <button
                                    onClick={() => markAsCompleted(lessonKey, item.type)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <CircularProgress
                                        className="cursor-pointer"
                                        percentage={isCompleted ? 100 : 0}
                                        size={18}
                                        strokeWidth={2}
                                      />
                                      {getContentIcon(item.type)}
                                    </div>
                                  </button>
                                  <span
                                    className="flex-1 truncate"
                                    style={{ color: '#2E4057' }}
                                  >
                                    {item.title || `${item.type} content`}
                                  </span>
                                  {item.duration && (
                                    <span className="text-xs opacity-70 hidden sm:block" style={{ color: '#2E4057' }}>
                                      {item.duration}
                                    </span>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {!isEnrolled && (
                  <div className="border rounded-lg overflow-hidden bg-gray-100 opacity-60">
                    <div className="p-3 sm:p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Lock size={16} className="text-gray-400" />
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-gray-500">
                            More Lessons Available
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            Enroll to unlock all course content
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6">
          {selectedContent ? (
            <ContentViewer
              selectedItem={selectedContent.data}
              selectedType={selectedContent.type}
              title={selectedContent.title}
            />
          ) : !isEnrolled ? (
            <LockScreen />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-4">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4" style={{ color: '#2E4057' }}>
                  Welcome to the Course
                </h2>
                <p className="text-sm sm:text-base lg:text-lg opacity-70" style={{ color: '#2E4057' }}>
                  {window.innerWidth < 1024 ? 
                    "Tap the menu button to view lessons" : 
                    "Click on any lesson from the sidebar to expand and view its content"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewCourseContent