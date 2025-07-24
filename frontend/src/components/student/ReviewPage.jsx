import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useParams,useNavigate } from 'react-router-dom';

const ReviewPage = ({ questions, userAnswers }) => {
  const {id} = useParams();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF6' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4" style={{ color: '#2E4057' }}>
              Quiz Review
            </h1>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="rounded-lg p-6 mb-6" style={{ backgroundColor: '#FAF6E9' }}>
              <div className="flex items-start mb-4">
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white mr-3 mt-1"
                  style={{ backgroundColor: question.type === 'mcq' ? '#A0C878' : '#DDEB9D', color: '#2E4057' }}
                >
                  {question.type === 'mcq' ? 'MCQ' : 'Theory'}
                </span>
                <h2 className="text-xl font-semibold" style={{ color: '#2E4057' }}>
                  {question.question}
                </h2>
              </div>

              {question.type === 'mcq' ? (
                <div>
                  <h3 className="font-medium mb-2" style={{ color: '#2E4057' }}>Your Answer:</h3>
                  <div className="flex items-center p-3 rounded-lg mb-4" 
                       style={{ 
                         backgroundColor: '#FFFDF6',
                         border: '2px solid ' + (userAnswers[index] === question.correctAnswer ? '#A0C878' : '#FF6B6B')
                       }}>
                    {question.options[userAnswers[index]]}
                    {userAnswers[index] === question.correctAnswer ? (
                      <CheckCircle size={20} className="ml-auto" style={{ color: '#A0C878' }} />
                    ) : (
                      <AlertCircle size={20} className="ml-auto" style={{ color: '#FF6B6B' }} />
                    )}
                  </div>

                  <h3 className="font-medium mb-2" style={{ color: '#2E4057' }}>Correct Answer:</h3>
                  <div className="flex items-center p-3 rounded-lg" 
                       style={{ backgroundColor: '#FFFDF6', border: '2px solid #A0C878' }}>
                    {question.options[question.correctAnswer]}
                    <CheckCircle size={20} className="ml-auto" style={{ color: '#A0C878' }} />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-2" style={{ color: '#2E4057' }}>Your Answer:</h3>
                  <div className="p-4 rounded-lg mb-4 min-h-[100px]" style={{ backgroundColor: '#FFFDF6' }}>
                    {userAnswers[index] || 'No answer provided'}
                  </div>
                  
                  <h3 className="font-medium mb-2" style={{ color: '#2E4057' }}>Model Answer:</h3>
                  <div className="p-4 rounded-lg min-h-[100px]" style={{ backgroundColor: '#FFFDF6' }}>
                    {question.correctAnswer}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate(`/course/${id}/viewCourse`)}
              
              className="px-6 py-2 bg-[#A0C878] text-white rounded-lg hover:bg-[#8BB968] transition-colors"
            >
              Back to Lesson
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewPage;