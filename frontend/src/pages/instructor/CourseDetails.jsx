import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Video,
  FileText,
  X,
  LogOut,
  Users,
  Clock,
  BookOpen,
  Image,
  Download,
  HelpCircle,
} from "lucide-react";
import AddLessonModal from "../../components/instructor/AddLessonModal";
import LogoutConfirmationModal from "../../components/Common/LogoutConfirmationModal";
import useAuthStore from "../../zustand/authStore";
import { getCurrentCourse } from "../../api/instructor";
import toast from "react-hot-toast";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState({});
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [imageError, setImageError] = useState(false);
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await getCurrentCourse(courseId);
      if (response.data.success) {
        setCourse(response.data.course);
        setLessons(response.data.arrayOfLessons || []);
      } else {
        toast.error("Failed to load course data");
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const toggleLesson = (lessonId) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
    setSelectedContent(null);
  };

  const handleContentSelect = (lessonId, type) => {
    setSelectedContent({ lessonId, type });
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFFDF6" }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0C878]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFFDF6" }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#2E4057" }}>
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <button
            onClick={() => navigate("/instructor/dashboard")}
            className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105"
            style={{ backgroundColor: "#A0C878" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: "#FFFDF6" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/instructor/dashboard")}
          className="flex items-center text-[#2E4057] hover:text-[#A0C878] transition-colors"
        >
          <X className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 rounded-lg text-[#2E4057] font-medium transition-all hover:bg-[#DDEB9D]"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
          <button
            onClick={() => setIsAddLessonModalOpen(true)}
            className="flex items-center px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105"
            style={{ backgroundColor: "#A0C878" }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Lesson
          </button>
        </div>
      </div>

      {/* Course Overview */}
      <div
        className="bg-white rounded-xl shadow-sm overflow-hidden mb-8"
        style={{ backgroundColor: "#FAF6E9" }}
      >
        <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
          {!imageError && course.photoUrl ? (
            <div className="w-full h-full">
              <img
                src={course.photoUrl}
                alt={course.name}
                className="w-full h-full object-cover object-center"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <Image className="w-16 h-16 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">No image available</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">
              {course.name}
            </h1>
            <p className="text-white/90 text-sm sm:text-base line-clamp-2">
              {course.description}
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" style={{ color: "#2E4057" }} />
              <div>
                <p className="text-sm text-gray-600">Lessons</p>
                <p className="font-medium" style={{ color: "#2E4057" }}>
                  {lessons.length}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" style={{ color: "#2E4057" }} />
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="font-medium" style={{ color: "#2E4057" }}>
                  {course.students || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" style={{ color: "#2E4057" }} />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium" style={{ color: "#2E4057" }}>
                  {course.duration || 0}h
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-medium" style={{ color: "#A0C878" }}>
                  ₹{course.price || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
        style={{ backgroundColor: "#FAF6E9" }}
      >
        <h2
          className="text-xl sm:text-2xl font-bold mb-6"
          style={{ color: "#2E4057" }}
        >
          Lessons
        </h2>
        {lessons.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No lessons added yet. Add your first lesson to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="border rounded-lg overflow-hidden"
                style={{ borderColor: "#DDEB9D" }}
              >
                <button
                  onClick={() => toggleLesson(lesson._id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-[#DDEB9D] transition-colors"
                >
                  <div className="flex items-center">
                    <span
                      className="font-medium mr-3"
                      style={{ color: "#2E4057" }}
                    >
                      {lesson.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      {lesson.duration || 0} min
                    </span>
                  </div>
                  {expandedLessons[lesson._id] ? (
                    <ChevronUp
                      className="w-5 h-5"
                      style={{ color: "#2E4057" }}
                    />
                  ) : (
                    <ChevronDown
                      className="w-5 h-5"
                      style={{ color: "#2E4057" }}
                    />
                  )}
                </button>
                {expandedLessons[lesson._id] && (
                  <div
                    className="p-4 border-t"
                    style={{ borderColor: "#DDEB9D" }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {lesson.videoUrl && (
                        <button
                          onClick={() =>
                            handleContentSelect(lesson._id, "video")
                          }
                          className={`flex items-center p-3 rounded-lg transition-colors ${
                            selectedContent?.lessonId === lesson._id &&
                            selectedContent?.type === "video"
                              ? "bg-[#A0C878] text-white"
                              : "hover:bg-[#DDEB9D] text-[#2E4057]"
                          }`}
                        >
                          <Video className="w-5 h-5 mr-2" />
                          <span>Video Lesson</span>
                        </button>
                      )}
                      {lesson.notesUrl && (
                        <button
                          onClick={() =>
                            handleContentSelect(lesson._id, "file")
                          }
                          className={`flex items-center p-3 rounded-lg transition-colors ${
                            selectedContent?.lessonId === lesson._id &&
                            selectedContent?.type === "file"
                              ? "bg-[#A0C878] text-white"
                              : "hover:bg-[#DDEB9D] text-[#2E4057]"
                          }`}
                        >
                          <FileText className="w-5 h-5 mr-2" />
                          <span>Course Material</span>
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/instructor/quiz/${lesson._id}`)}
                        className="flex items-center p-3 rounded-lg transition-colors hover:bg-[#DDEB9D] text-[#2E4057]"
                      >
                        <HelpCircle className="w-5 h-5 mr-2" />
                        <span>Manage Quiz</span>
                      </button>
                    </div>
                    {selectedContent?.lessonId === lesson._id && (
                      <div className="mt-4">
                        {selectedContent.type === "video" ? (
                          <div>
                            <p className="text-gray-600 mb-4">
                              {lesson.description}
                            </p>
                            <video
                              src={lesson.videoUrl}
                              controls
                              className="w-full rounded-lg"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-600 mb-4">
                              {lesson.description}
                            </p>
                            <div
                              className="bg-white p-4 rounded-lg border"
                              style={{ borderColor: "#DDEB9D" }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <FileText
                                    className="w-6 h-6 mr-3"
                                    style={{ color: "#2E4057" }}
                                  />
                                  <div>
                                    <p
                                      className="font-medium"
                                      style={{ color: "#2E4057" }}
                                    >
                                      {lesson.title} - Course Material
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {lesson.notesUrl.split("/").pop()}
                                    </p>
                                  </div>
                                </div>
                                <a
                                  href={lesson.notesUrl}
                                  download
                                  className="flex items-center px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105"
                                  style={{ backgroundColor: "#A0C878" }}
                                >
                                  <Download className="w-5 h-5 mr-2" />
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Lesson Modal */}
      <AddLessonModal
        isOpen={isAddLessonModalOpen}
        onClose={() => setIsAddLessonModalOpen(false)}
        courseId={courseId}
        onLessonAdded={() => {
          fetchCourseData();
        }}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default CourseDetails;
