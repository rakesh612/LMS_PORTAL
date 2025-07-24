import React, { useState, useEffect } from 'react';
import { ChevronDown, MessageCircle, Calendar, User } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
const DiscussionList = () => {
    const { id } = useParams();
  const [discussions, setDiscussions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  
  const DISCUSSIONS_PER_PAGE = 9;



  
  // Get current discussions based on page
  const getCurrentDiscussions = () => {
    const startIndex = (currentPage - 1) * DISCUSSIONS_PER_PAGE;
    const endIndex = startIndex + DISCUSSIONS_PER_PAGE;
    return discussions.slice(startIndex, endIndex);
  };
  useEffect(() => {
    // Fetch discussions when component mounts
    getCurrentDiscussions();
  }, [currentPage, discussions]);

  // Simulate API call - replace with your actual axios call
  const fetchDiscussions = async () => {
    setLoading(true);
    
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_USER_URL}/getDiscussion`, {
            courseId: id, 
        },{
            withCredentials: true
        })
        setDiscussions(response.data.messages || []);
        setTotalPages(Math.ceil(response.data.messages.length / DISCUSSIONS_PER_PAGE));

    } catch (error) {
        console.error('Error fetching discussions:', error);
        toast.error('Failed to load discussions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleShowMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF6' }}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Discussions
          </h1>
          <p className="text-gray-600">
            Showing {getCurrentDiscussions().length} of {discussions.length} discussions
          </p>
        </div>

        <div className="space-y-4">
          {getCurrentDiscussions().map((discussion) => (
            <div
              key={discussion.id}
              className="rounded-lg p-4 sm:p-6 hover:shadow-md transition-all duration-200 border"
              style={{ 
                backgroundColor: '#FAF6E9',
                borderColor: '#DDEB9D'
              }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#A0C878' }}
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {discussion.username}
                    </h3>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{formatDate(discussion.createdAt)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {discussion.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#A0C878' }}></div>
          </div>
        )}

        {currentPage < totalPages && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleShowMore}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-md"
              style={{ backgroundColor: '#A0C878' }}
            >
              Show More
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {currentPage >= totalPages && !loading && discussions.length > DISCUSSIONS_PER_PAGE && (
          <div className="text-center mt-8 py-4">
            <p className="text-gray-500">You've reached the end of discussions</p>
          </div>
        )}

        {discussions.length === 0 && !loading && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No discussions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionList;
