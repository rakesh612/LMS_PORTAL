import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import useAuthStore from '../../zustand/authStore';
import { addCourse } from '../../api/instructor';
import toast from 'react-hot-toast';
import { uploadFile } from '../../api/fileUpload';    
const AddCourseModal = ({ isOpen, onClose, onCourseAdded }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    instructor: user?.name || '',
    description: '',
    skills: '',
    price: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setErrors(prev => ({
          ...prev,
          image: 'Photo size should be less than 2MB'
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setErrors(prev => ({
        ...prev,
        image: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price || !formData.image) {
      toast.error('Please fill in all fields and upload a photo');
      return;
    }

    try {
      setLoading(true);
      const tempFormData = new FormData();
      tempFormData.append('file', formData.image);
      let photoUrl = null;
      try {
        const tempResponse = await uploadFile(tempFormData);
        photoUrl = tempResponse.fileUrl; 
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload file');
        return;
      }
      const skillArray = formData.skills.split(',').map(skill => skill.trim());
      const newFormData = {
        name: formData.title,
        description: formData.description,
        price: formData.price,
        photoUrl: photoUrl,
        instructor: formData.instructor,
        skills: skillArray
      }

      const response = await addCourse(newFormData);
      console.log(response.data);
      if (response.data.success) {
        toast.success('Course added successfully');
        onCourseAdded();
        onClose();
        setFormData({
          title: '',
          image: null,
          instructor: user?.name || '',
          description: '',
          skills: '',
          price: ''
        });
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Failed to add course');
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

        <h2 className="text-2xl font-bold mb-6" style={{ color: '#2E4057' }}>Add New Course</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2E4057' }}>
              Course Name
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#A0C878]"
              style={{ backgroundColor: '#FFFDF6', borderColor: '#DDEB9D' }}
              placeholder="Enter course name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2E4057' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#A0C878]"
              style={{ backgroundColor: '#FFFDF6', borderColor: '#DDEB9D' }}
              rows="4"
              placeholder="Enter course description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E4057' }}>
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#A0C878]"
                style={{ backgroundColor: '#FFFDF6', borderColor: '#DDEB9D' }}
                placeholder="Enter course price"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E4057' }}>
                Skills (comma-separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#A0C878]"
                style={{ backgroundColor: '#FFFDF6', borderColor: '#DDEB9D' }}
                placeholder="e.g., JavaScript, React, Node.js"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2E4057' }}>
              Course Photo
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center px-4 py-2 rounded-lg border cursor-pointer transition-colors hover:bg-[#DDEB9D]"
                style={{ borderColor: '#DDEB9D' }}
              >
                <Upload className="w-5 h-5 mr-2" style={{ color: '#2E4057' }} />
                <span style={{ color: '#2E4057' }}>
                  {formData.image ? formData.image.name : 'Upload Photo'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg text-white font-medium transition-all hover:scale-105 disabled:opacity-50"
              style={{ backgroundColor: '#A0C878' }}
            >
              {loading ? 'Adding...' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal; 
