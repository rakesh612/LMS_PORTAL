// src/pages/Auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, GraduationCap, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LearnHubLogo from '../../components/Common/LearnHubLogo';
import { registerUser,tempRegisterInstructor } from '../../api/auth';

const RegisterPage = (onRegister) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if(formData.role === 'teacher'){
        try{
          const response = await tempRegisterInstructor(formData);
          if (response.data.success) {
            onRegister();
          }
        } catch (err) {
          setError(err.message || 'An error occurred');
        }
      }
      else{
        const response = await registerUser(formData);
        if (response.data.success) {
          navigate('/verify-email', { state: { email: formData.email,name:formData.name } });
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white items-center justify-center px-4">
      <header className="w-full max-w-5xl flex items-center p-4">
        <LearnHubLogo />
      </header>

      <div className="flex w-full max-w-5xl h-[90vh] rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="w-1/2 h-full hidden md:flex items-center justify-center bg-white-100">
          <img
            src="/logo.jpg"
            alt="Register Visual"
            className="object-contain w-full h-full max-h-full"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#A0C878' }}
            >
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Join Us</h2>
            <p className="text-sm text-gray-600">Create your new account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 text-center font-semibold">{error}</div>
            )}

            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300"
                placeholder="Full Name"
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300"
                placeholder="Email Address"
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300"
                placeholder="Password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition duration-200"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-between gap-4">
              {['student', 'teacher'].map((role) => (
                <label key={role} className="w-1/2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleInputChange}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div
                    className={`border-2 rounded-lg p-3 text-center transition ${
                      formData.role === role ? 'bg-green-50' : ''
                    }`}
                    style={{
                      borderColor: formData.role === role ? '#A0C878' : '#ccc',
                      backgroundColor:
                        formData.role === role ? '#A0C87820' : '#fff',
                    }}
                  >
                    {role === 'student' ? (
                      <GraduationCap className="mx-auto mb-1 text-gray-600" />
                    ) : (
                      <BookOpen className="mx-auto mb-1 text-gray-600" />
                    )}
                    <span className="text-sm font-medium capitalize">{role}</span>
                  </div>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg text-lg font-semibold bg-[#A0C878] transition-all duration-200 hover:bg-[#8fb862] hover:scale-105 active:scale-95 disabled:opacity-60"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium hover:underline transition-colors duration-200"
                style={{ color: "#A0C878" }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
