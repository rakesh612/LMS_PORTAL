import React, { useState } from 'react';
import { Send, User, MessageCircle, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams,useNavigate } from 'react-router-dom';

const AddDiscussion = () => {
    const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };
  const handleCancel = () => {
    setMessage(''); 
    navigate(`/courses/${id}/`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if(message.trim() === '') {
      toast.error('Message cannot be empty');
      return;
    }
    if(message.length < 10) {
      toast.error('Message must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
            const apiUrl = `${import.meta.env.VITE_API_USER_URL}/addMessage`;
    try {

        const response  = await axios.post(`${import.meta.env.VITE_API_USER_URL}/addMessage`,{
            messageBody: message,
            courseId:id 
        },{
            withCredentials: true
        })

        // Handle response
        if(response.data.success) {
            toast.success('Discussion posted successfully!');
            navigate(`/courses/${id}/`);
            setMessage('');
        }
      
    } catch (err) {
        toast.error('Failed to post discussion. Please try again.');
      console.error('Error posting discussion:', err);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF6' }}>
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Start a Discussion
          </h1>
          <p className="text-gray-600">
            Share your thoughts and questions with the community
          </p>
        </div>



        {/* Form */}
        <div className="space-y-6">
          <div 
            className="rounded-lg p-4 sm:p-6 border"
            style={{ 
              backgroundColor: '#FAF6E9',
              borderColor: '#DDEB9D'
            }}
          >

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={handleInputChange}
                rows={6}
                placeholder="What would you like to discuss? Share your thoughts, questions, or ideas..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base resize-none"
                style={{ 
                  focusRingColor: '#A0C878',
                  backgroundColor: '#FFFDF6'
                }}
                disabled={isSubmitting}
              />
              <div className="mt-2 text-xs sm:text-sm text-gray-500">
                {message.length}/500 characters
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !message.trim() }
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: '#A0C878' }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Post Discussion</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Character Count Warning */}
        {message.length > 450 && (
          <div className="mt-4 text-center">
            <span className="text-sm text-orange-600">
              {500 - message.length} characters remaining
            </span>
          </div>
        )}

        {/* Guidelines */}
        <div 
          className="mt-8 p-4 rounded-lg border"
          style={{ 
            backgroundColor: '#FAF6E9',
            borderColor: '#DDEB9D'
          }}
        >
          <h3 className="text-sm font-medium text-gray-800 mb-2">Community Guidelines</h3>
          <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
            <li>• Be respectful and constructive in your discussions</li>
            <li>• Stay on topic and provide helpful insights</li>
            <li>• Use clear and descriptive language</li>
            <li>• Avoid spam or repetitive content</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddDiscussion;
