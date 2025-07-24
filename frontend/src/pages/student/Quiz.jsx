
// export default QuizPage;
import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, Award, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingScreen from '../../components/Loading';
import ReviewPage from '../../components/student/ReviewPage';

const QuizPage = () => {
    const [quizData, setQuizData] = useState({
        mcqQuestions: [],
        theoryQuestions: [],
        mcqOptions: [],
        mcqAnswers: [],
        theoryAnswers: [],
        title: ''
    });
    const { lessonId, id, lessonidx } = useParams();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [reviewData, setReviewData] = useState([]);


    const fetchData = async () => {
        const MIN_LOADING_TIME = 1000; // in ms

        const delay = new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME));

        try {
            const response = await Promise.all([
                axios.post(`/api/users/getQuiz`, {
                    lessonId: lessonId
                }, {
                    withCredentials: true
                }),
                delay
            ]);

            const data = response[0].data;

            setQuizData({
                mcqQuestions: data.mcqQuestions || [],
                theoryQuestions: data.theoryQuestions || [],
                mcqOptions: data.mcqOptions || [],
                mcqAnswers: data.mcqAnswers || [],
                theoryAnswers: data.theoryAnswers || [],
                title: data.title || 'Quiz'
            });

        } catch (error) {
            toast.error('Failed to fetch quiz data. Please try again later.');
            console.error('Error fetching quiz data:', error);
        } finally {
            setLoading(false); // This now happens after both fetch & delay complete
        }
    };

    // const fetchData = async () => {
    //     try {
    //         const response = await axios.post(`${import.meta.env.VITE_API_USER_URL}/getQuiz`, {
    //             lessonId: lessonId
    //         }, {
    //             withCredentials: true
    //         });

    //         setQuizData({
    //             mcqQuestions: response.data.mcqQuestions || [],
    //             theoryQuestions: response.data.theoryQuestions || [],
    //             mcqOptions: response.data.mcqOptions || [],
    //             mcqAnswers: response.data.mcqAnswers || [],
    //             theoryAnswers: response.data.theoryAnswers || [],
    //             title: response.data.title || 'Quiz'
    //         });

    //     } catch (error) {
    //         toast.error('Failed to fetch quiz data. Please try again later.');
    //         console.error('Error fetching quiz data:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        fetchData();
    }, [lessonId]);

    // Combine both question types for display
    const allQuestions = [
        ...quizData.mcqQuestions.map((q, i) => ({
            question: q,
            type: "mcq",
            options: quizData.mcqOptions[i] || [],
            correctAnswer: quizData.mcqAnswers[i]
        })),
        ...quizData.theoryQuestions.map((q, i) => ({
            question: q,
            type: "theory",
            correctAnswer: quizData.theoryAnswers[i]
        }))
    ];

    const handleMCQAnswer = (questionIndex, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const handleTheoryAnswer = (questionIndex, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: answer
        }));
    };

    const handleSubmit = async () => {
        try {
            const submittedTheoryAnswers = [];
            const submittedMcqOpts = [];

            allQuestions.forEach((question, index) => {
                const userAnswer = answers[index];
                if (question.type === 'mcq') {
                    submittedMcqOpts.push(userAnswer !== undefined ? userAnswer : -1);
                } else if (question.type === 'theory') {
                    submittedTheoryAnswers.push(userAnswer || '');
                }
            });

            const payload = {
                submittedTheoryAnswers,
                submittedMcqOpts,
                lessonId: lessonId,
                lessonidx: parseInt(lessonidx),
                courseId: id
            };

            const response = await axios.post(`${import.meta.env.VITE_API_USER_URL}/submitQuiz`, payload, {
                withCredentials: true
            });

            if (response.data.success) {
                setScore(response.data.marks);
                setShowResults(true);
                setShowConfirmDialog(false);
                toast.success(`Quiz submitted successfully! You scored ${response.data.marks} marks.`);
            } else {
                throw new Error(response.data.message || 'Quiz submission failed');
            }

        } catch (error) {
            console.error('Error submitting quiz:', error);
            if (error.response?.status === 403) {
                toast.error('Quiz has already been submitted for this lesson.');
            } else if (error.response?.status === 404) {
                toast.error(error.response.data.message || 'Lesson or progress not found.');
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to submit quiz. Please try again.');
            }
            setShowConfirmDialog(false);
        }
    };

    const getScoreColor = (score) => {
        const percentage = Math.round((score / allQuestions.length) * 100);
        if (percentage >= 80) return '#A0C878';
        if (percentage >= 60) return '#DDEB9D';
        return '#FF6B6B';
    };

    const getScoreMessage = (score) => {
        const percentage = Math.round((score / allQuestions.length) * 100);
        if (percentage >= 90) return 'Excellent! Outstanding performance!';
        if (percentage >= 80) return 'Great job! Well done!';
        if (percentage >= 70) return 'Good work! Keep it up!';
        if (percentage >= 60) return 'Not bad! Room for improvement.';
        return 'Keep studying and try again!';
    };

    // Loading state
    if (loading) return <LoadingScreen message="Preparing your quiz..." />;

    // No quiz data available
    if (allQuestions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFDF6' }}>
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4" style={{ color: '#2E4057' }}>
                        No Quiz Available
                    </h2>
                    <p className="text-lg" style={{ color: '#2E4057' }}>
                        There are no questions available for this lesson.
                    </p>
                </div>
            </div>
        );
    }

    // Review mode
    if (showResults && showReview) {
        return (
            <ReviewPage
                questions={reviewData}
                userAnswers={answers}
            />
        );
    }

    // Results page
    if (showResults) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: '#FFFDF6' }}>
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <Award size={64} style={{ color: getScoreColor(score) }} className="mx-auto mb-4" />
                            <h1 className="text-3xl font-bold mb-2" style={{ color: '#2E4057' }}>
                                Quiz Completed!
                            </h1>
                            <p className="text-lg" style={{ color: '#2E4057' }}>
                                {quizData.title}
                            </p>
                        </div>

                        <div className="rounded-lg p-8 mb-6" style={{ backgroundColor: '#FAF6E9' }}>
                            <div className="text-center">
                                <div className="text-6xl font-bold mb-2" style={{ color: getScoreColor(score) }}>
                                    {Math.round((score / allQuestions.length) * 100)}%
                                </div>
                                <p className="text-xl mb-4" style={{ color: '#2E4057' }}>
                                    {getScoreMessage(score)}
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-sm" style={{ color: '#2E4057' }}>Questions Correct</p>
                                        <p className="text-2xl font-bold" style={{ color: '#A0C878' }}>
                                            {score}/{allQuestions.length}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm" style={{ color: '#2E4057' }}>Total Questions</p>
                                        <p className="text-2xl font-bold" style={{ color: '#A0C878' }}>
                                            {allQuestions.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-6">
                            <button
                                onClick={() => {
                                    setReviewData(allQuestions);
                                    setShowReview(true);
                                }}
                                className="px-6 py-3 rounded-lg font-semibold transition-colors duration-200 mr-4"
                                style={{ backgroundColor: '#FAF6E9', color: '#2E4057', border: '2px solid #2E4057' }}
                            >
                                Review Answers
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main quiz interface
    return (
        <div className="min-h-screen relative" style={{ backgroundColor: '#FFFDF6' }}>
            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="rounded-xl p-6 max-w-md w-full mx-4 border-2 border-[#A0C878] shadow-lg" style={{ backgroundColor: '#FAF6E9' }}>
                        <div className="flex items-center mb-4">
                            <AlertCircle size={24} style={{ color: '#2E4057' }} className="mr-2" />
                            <h3 className="text-lg font-semibold" style={{ color: '#2E4057' }}>
                                Confirm Submission
                            </h3>
                        </div>
                        <p className="mb-6" style={{ color: '#2E4057' }}>
                            Are you sure you want to submit your quiz? You won't be able to make changes after submission.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleSubmit}
                                className="flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-colors duration-200 hover:opacity-90"
                                style={{ backgroundColor: '#A0C878' }}
                            >
                                Yes, Submit
                            </button>
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 border-2 border-[#2E4057] hover:bg-[#E8E2C7]"
                                style={{ backgroundColor: '#FAF6E9', color: '#2E4057' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold" style={{ color: '#2E4057' }}>
                            {quizData.title}
                        </h1>
                        <div className="flex items-center" style={{ color: '#2E4057' }}>
                            <Clock size={20} className="mr-2" />
                            <span>Question {currentQuestion + 1} of {allQuestions.length}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                                backgroundColor: '#A0C878',
                                width: `${((currentQuestion + 1) / allQuestions.length) * 100}%`
                            }}
                        ></div>
                    </div>
                    <p className="text-sm mt-2" style={{ color: '#2E4057' }}>
                        Progress: {Math.round(((currentQuestion + 1) / allQuestions.length) * 100)}%
                    </p>
                </div>

                {/* Question Card */}
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-lg p-6 mb-6 shadow-md" style={{ backgroundColor: '#FAF6E9' }}>
                        <div className="mb-6">
                            <div className="flex items-start mb-4">
                                <span
                                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white mr-3 mt-1"
                                    style={{ backgroundColor: allQuestions[currentQuestion].type === 'mcq' ? '#A0C878' : '#DDEB9D', color: '#2E4057' }}
                                >
                                    {allQuestions[currentQuestion].type === 'mcq' ? 'MCQ' : 'Theory'}
                                </span>
                            </div>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: '#2E4057' }}>
                                {allQuestions[currentQuestion].question}
                            </h2>
                        </div>

                        {/* MCQ Options */}
                        {allQuestions[currentQuestion].type === 'mcq' && (
                            <div className="space-y-3">
                                {allQuestions[currentQuestion].options.map((option, index) => (
                                    <label
                                        key={index}
                                        className="flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 border-2"
                                        style={{
                                            backgroundColor: answers[currentQuestion] === index ? '#DDEB9D' : '#FFFDF6',
                                            borderColor: answers[currentQuestion] === index ? '#A0C878' : '#FAF6E9'
                                        }}
                                    >
                                        <div className="mr-3">
                                            {answers[currentQuestion] === index ? (
                                                <CheckCircle size={20} style={{ color: '#A0C878' }} />
                                            ) : (
                                                <Circle size={20} style={{ color: '#2E4057' }} />
                                            )}
                                        </div>
                                        <span style={{ color: '#2E4057' }}>{option}</span>
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestion}`}
                                            value={index}
                                            checked={answers[currentQuestion] === index}
                                            onChange={() => handleMCQAnswer(currentQuestion, index)}
                                            className="sr-only"
                                        />
                                    </label>
                                ))}
                            </div>
                        )}

                        {/* Theory Answer */}
                        {allQuestions[currentQuestion].type === 'theory' && (
                            <div>
                                <textarea
                                    className="w-full p-4 border-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#A0C878]"
                                    style={{
                                        backgroundColor: '#FFFDF6',
                                        borderColor: '#FAF6E9',
                                        color: '#2E4057'
                                    }}
                                    rows="8"
                                    placeholder="Write your answer here..."
                                    value={answers[currentQuestion] || ''}
                                    onChange={(e) => handleTheoryAnswer(currentQuestion, e.target.value)}
                                />
                                <p className="text-sm mt-2" style={{ color: '#2E4057' }}>
                                    Characters: {(answers[currentQuestion] || '').length}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                            disabled={currentQuestion === 0}
                            className="px-4 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                            style={{
                                backgroundColor: currentQuestion === 0 ? '#FAF6E9' : '#DDEB9D',
                                color: '#2E4057'
                            }}
                        >
                            Previous
                        </button>

                        <div className="flex space-x-2">
                            {allQuestions.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentQuestion(index)}
                                    className="w-8 h-8 rounded-full font-semibold text-sm transition-colors duration-200 hover:opacity-90"
                                    style={{
                                        backgroundColor: index === currentQuestion ? '#A0C878' :
                                            answers[index] !== undefined ? '#DDEB9D' : '#FAF6E9',
                                        color: '#2E4057'
                                    }}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        {currentQuestion === allQuestions.length - 1 ? (
                            <button
                                onClick={() => setShowConfirmDialog(true)}
                                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-200 hover:opacity-90"
                                style={{ backgroundColor: '#A0C878' }}
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestion(Math.min(allQuestions.length - 1, currentQuestion + 1))}
                                className="px-4 py-2 rounded-lg font-semibold transition-colors duration-200 hover:opacity-90"
                                style={{ backgroundColor: '#DDEB9D', color: '#2E4057' }}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;