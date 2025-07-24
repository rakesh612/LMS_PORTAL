import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { addLesson } from '../../api/instructor';
import toast from 'react-hot-toast';
import { uploadFile } from '../../api/fileUpload';
const AddLessonModal = ({ isOpen, onClose, courseId, onLessonAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [notesFile, setNotesFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !duration || !videoFile || !notesFile) {
      toast.error('Please fill in all fields and upload both video and notes');
      return;
    }

    try {
      setLoading(true);
      let tempFormData = new FormData();
      tempFormData.append('file', videoFile);
      let videoUrl = null;
      try {
        const tempResponse = await uploadFile(tempFormData);
        videoUrl = tempResponse.fileUrl;
      } catch (error) {
        console.error('Error uploading video:', error);
        toast.error('Failed to upload video');
        return;
      }
      tempFormData = new FormData();
      tempFormData.append('file', notesFile);
      let notesUrl = null;
      try {
        const tempResponse = await uploadFile(tempFormData);
        notesUrl = tempResponse.fileUrl;
      } catch (error) {
        console.error('Error uploading notes:', error);
        toast.error('Failed to upload notes');
        return;
      }
      const formData = {
        title: title,
        description: description,
        courseId: courseId,
        videoUrl: videoUrl,
        notesUrl: notesUrl,
        duration: duration,
      };

      const response = await addLesson(formData);
      if (response.data.success) {
        toast.success('Lesson added successfully');
        onLessonAdded();
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to add lesson');
      }
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error('Failed to add lesson');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4" style={{ backgroundColor: '#FAF6E9' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6" style={{ color: '#2E4057' }}>Add New Lesson</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2E4057' }}>
              Lesson Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#A0C878]"
              style={{ backgroundColor: '#FFFDF6', borderColor: '#DDEB9D' }}
              placeholder="Enter lesson title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2E4057' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#A0C878]"
              style={{ backgroundColor: '#FFFDF6', borderColor: '#DDEB9D' }}
              rows="4"
              placeholder="Enter lesson description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2E4057' }}>
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#A0C878]"
              style={{ backgroundColor: '#FFFDF6', borderColor: '#DDEB9D' }}
              placeholder="Enter lesson duration in minutes"
              min="1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E4057' }}>
                Video File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="flex items-center justify-center px-4 py-2 rounded-lg border cursor-pointer transition-colors hover:bg-[#DDEB9D]"
                  style={{ borderColor: '#DDEB9D' }}
                >
                  <Upload className="w-5 h-5 mr-2 flex-shrink-0" style={{ color: '#2E4057' }} />
                  <span className="truncate max-w-[200px]" style={{ color: '#2E4057' }}>
                    {videoFile ? videoFile.name : 'Upload Video'}
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E4057' }}>
                Course Material
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setNotesFile(e.target.files[0])}
                  className="hidden"
                  id="notes-upload"
                />
                <label
                  htmlFor="notes-upload"
                  className="flex items-center justify-center px-4 py-2 rounded-lg border cursor-pointer transition-colors hover:bg-[#DDEB9D]"
                  style={{ borderColor: '#DDEB9D' }}
                >
                  <FileText className="w-5 h-5 mr-2 flex-shrink-0" style={{ color: '#2E4057' }} />
                  <span className="truncate max-w-[200px]" style={{ color: '#2E4057' }}>
                    {notesFile ? notesFile.name : 'Upload Material'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg text-white font-medium transition-all hover:scale-105 disabled:opacity-50"
              style={{ backgroundColor: '#A0C878' }}
            >
              {loading ? 'Adding...' : 'Add Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonModal; 