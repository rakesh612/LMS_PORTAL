import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X, ArrowLeft, Check, X as XIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { addQuiz, getQuiz } from "../../api/instructor";

const QuizManagement = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [theoryQuestions, setTheoryQuestions] = useState([]);
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [mcqOptions, setMcqOptions] = useState([]);
  const [mcqAnswers, setMcqAnswers] = useState([]);
  const [theoryAnswers, setTheoryAnswers] = useState([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    type: "mcq",
    options: [""],
    answer: "",
  });
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(`quiz_${lessonId}`);
    if (savedData) {
      const { theoryQuestions, mcqQuestions, mcqOptions, mcqAnswers, theoryAnswers } = JSON.parse(savedData);
      setTheoryQuestions(theoryQuestions);
      setMcqQuestions(mcqQuestions);
      setMcqOptions(mcqOptions);
      setMcqAnswers(mcqAnswers);
      setTheoryAnswers(theoryAnswers);
    }
  }, [lessonId]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const quizData = {
      theoryQuestions,
      mcqQuestions,
      mcqOptions,
      mcqAnswers,
      theoryAnswers,
    };
    if(theoryQuestions.length > 0 || mcqQuestions.length > 0)
      localStorage.setItem(`quiz_${lessonId}`, JSON.stringify(quizData));
  }, [theoryQuestions, mcqQuestions, mcqOptions, mcqAnswers, theoryAnswers, lessonId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await getQuiz(lessonId);
      if (response.data.success) {
        
        // Only update state if there's no local data
        const savedData = localStorage.getItem(`quiz_${lessonId}`);
        console.log(savedData);
        if (!savedData) {
          setTheoryQuestions(response.data.theoryQuestions || []);
          setMcqQuestions(response.data.mcqQuestions || []);
          setMcqOptions(response.data.mcqOptions || []);
          setMcqAnswers(response.data.mcqAnswers || []);
          setTheoryAnswers(response.data.theoryAnswers || []);
        }
      } else {
        toast.error("Failed to load questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [lessonId]);

  const handleAddOption = () => {
    setNewQuestion((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const handleOptionChange = (index, value) => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt)),
    }));
  };

  const handleRemoveOption = (index) => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitQuestion = async () => {
    if (!newQuestion.question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (newQuestion.type === "mcq") {
      if (newQuestion.options.some((opt) => !opt.trim())) {
        toast.error("Please fill all options");
        return;
      }
      if (!newQuestion.answer.trim()) {
        toast.error("Please select the correct answer");
        return;
      }

      // Add MCQ question to frontend state
      setMcqQuestions((prev) => [...prev, newQuestion.question]);
      setMcqOptions((prev) => [...prev, newQuestion.options]);
      // Store the index of the correct answer instead of the text
      const correctAnswerIndex = newQuestion.options.findIndex(
        (opt) => opt === newQuestion.answer
      );
      setMcqAnswers((prev) => [...prev, correctAnswerIndex]);
      
    } else {
      if (!newQuestion.answer.trim()) {
        toast.error("Please enter the answer");
        return;
      }

      // Add theory question to frontend state
      setTheoryQuestions((prev) => [...prev, newQuestion.question]);
      setTheoryAnswers((prev) => [...prev, newQuestion.answer]);
      
    }
    
    // Reset form
    setNewQuestion({
      question: "",
      type: "mcq",
      options: [""],
      answer: "",
    });
    setIsAddingQuestion(false);
    toast.success("Question added successfully!");
  };

  const handleSubmitQuiz = async () => {
    try {
      const quizData = {
        lessonId,
        theoryQuestions,
        Mcqs: mcqQuestions,
        McqOpts: mcqOptions,
        McqAnswers: mcqAnswers,
        theoryAnswers,
      };

      const response = await addQuiz(quizData);
      if (response.data.success) {
        // Clear localStorage after successful submission
        localStorage.removeItem(`quiz_${lessonId}`);
        toast.success("Quiz submitted successfully!");
        navigate(-1);
      } else {
        toast.error(response.data.message || "Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz");
    }
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

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: "#FFFDF6" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#2E4057] hover:text-[#A0C878] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Lesson
        </button>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleSubmitQuiz}
            className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg text-white text-sm sm:text-base font-medium transition-all hover:scale-105 shadow-sm hover:shadow-md"
            style={{ backgroundColor: "#A0C878" }}
          >
            Submit Quiz
          </button>
          <button
            onClick={() => setIsAddingQuestion(true)}
            className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg text-white text-sm sm:text-base font-medium transition-all hover:scale-105 shadow-sm hover:shadow-md"
            style={{ backgroundColor: "#A0C878" }}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Add Question
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8"
        style={{ backgroundColor: "#FAF6E9" }}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: "#2E4057" }}>
          Quiz Questions
        </h2>
        {theoryQuestions.length === 0 && mcqQuestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No questions added yet. Add your first question to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* MCQ Questions */}
            {mcqQuestions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3
                  className="text-lg sm:text-xl font-semibold mb-6 flex items-center"
                  style={{ color: "#2E4057" }}
                >
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#A0C878] text-white flex items-center justify-center mr-3 text-sm sm:text-base">
                    {mcqQuestions.length}
                  </span>
                  Multiple Choice Questions
                </h3>
                <div className="space-y-6">
                  {mcqQuestions.map((question, qIndex) => (
                    <div
                      key={qIndex}
                      className="border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow bg-white"
                      style={{ borderColor: "#DDEB9D" }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-start">
                            <span className="text-lg font-medium text-[#2E4057] w-8">
                              {qIndex + 1}.
                            </span>
                            <p
                              className="text-lg font-medium flex-1"
                              style={{ color: "#2E4057" }}
                            >
                              {question}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setMcqQuestions((prev) =>
                              prev.filter((_, i) => i !== qIndex)
                            );
                            setMcqOptions((prev) =>
                              prev.filter((_, i) => i !== qIndex)
                            );
                            setMcqAnswers((prev) =>
                              prev.filter((_, i) => i !== qIndex)
                            );
                          }}
                          className="p-2 text-red-500 hover:text-red-700 ml-4 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-2 pl-8">
                        {mcqOptions[qIndex].map((option, oIndex) => (
                          <div
                            key={oIndex}
                            className={`flex items-center p-3 rounded-lg transition-colors ${
                              oIndex === mcqAnswers[qIndex]
                                ? "bg-[#A0C878] text-white"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <span className="font-medium mr-3">
                              {String.fromCharCode(65 + oIndex)}.
                            </span>
                            <span className="flex-1">{option}</span>
                            {oIndex === mcqAnswers[qIndex] && (
                              <Check className="w-5 h-5 ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Theory Questions */}
            {theoryQuestions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3
                  className="text-lg sm:text-xl font-semibold mb-6 flex items-center"
                  style={{ color: "#2E4057" }}
                >
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#A0C878] text-white flex items-center justify-center mr-3 text-sm sm:text-base">
                    {theoryQuestions.length}
                  </span>
                  Theory Questions
                </h3>
                <div className="space-y-6">
                  {theoryQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow bg-white"
                      style={{ borderColor: "#DDEB9D" }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start">
                            <span className="text-lg font-medium text-[#2E4057] w-8">
                              {index + 1}.
                            </span>
                            <p
                              className="text-lg font-medium flex-1"
                              style={{ color: "#2E4057" }}
                            >
                              {question}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setTheoryQuestions((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            setTheoryAnswers((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                          className="p-2 text-red-500 hover:text-red-700 ml-4 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className=" pl-8">
                        <p className="text-[#A0C878] text-lg font-medium">{theoryAnswers[index]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      {isAddingQuestion && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: "#2E4057" }}>
                Add New Question
              </h3>
              <button
                onClick={() => setIsAddingQuestion(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A0C878] focus:border-transparent shadow-sm"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  value={newQuestion.type}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A0C878] focus:border-transparent shadow-sm"
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="theory">Theory</option>
                </select>
              </div>

              {newQuestion.type === "mcq" ? (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#A0C878] focus:border-transparent shadow-sm"
                        placeholder={`Option ${index + 1}`}
                      />
                      {index > 0 && (
                        <button
                          onClick={() => handleRemoveOption(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleAddOption}
                    className="flex items-center text-[#2E4057] hover:text-[#A0C878] transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </button>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <select
                      value={newQuestion.answer}
                      onChange={(e) =>
                        setNewQuestion((prev) => ({
                          ...prev,
                          answer: e.target.value,
                        }))
                      }
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A0C878] focus:border-transparent shadow-sm"
                    >
                      <option value="">Select correct answer</option>
                      {newQuestion.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer
                  </label>
                  <input
                    type="text"
                    value={newQuestion.answer}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({
                        ...prev,
                        answer: e.target.value,
                      }))
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A0C878] focus:border-transparent shadow-sm"
                    placeholder="Enter the answer"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsAddingQuestion(false)}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitQuestion}
                  className="px-3 sm:px-4 py-2 rounded-lg text-white text-sm sm:text-base font-medium transition-all hover:scale-105 shadow-sm hover:shadow-md"
                  style={{ backgroundColor: "#A0C878" }}
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
