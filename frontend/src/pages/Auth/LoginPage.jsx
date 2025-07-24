import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, BookOpen } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import LearnHubLogo from '../../components/Common/LearnHubLogo';
import useAuthStore from '../../zustand/authStore';
import { loginUser, googleLogin, sendOtp} from '../../api/auth';
import toast from 'react-hot-toast';

// Placeholder Loader component (replace if you have a real one)
const Loader = ({ className, size }) => (
  <svg
    className={`animate-spin ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
);

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      toast.success(`Already Logged in`)
      navigate('/dashboard');
    }
  }, [user, navigate, location.state?.from]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await loginUser(formData);
      login(data.user);
      if(data.success && !data.user.isVerified){
        
        const email = data.user.email;
        
        if(data.user.role === "user"){
          sendOtp(email);
          navigate('/verify-email', { state: { email: data.user.email } });
        }
        else if(data.user.role === "instructor"){
          navigate('/instructor/register');
        }
      }
      if(!data.success){
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (credentialResponse) => {
    try {
      const { data } = await googleLogin(credentialResponse.credential);
      if (data.success) {
        login(data.user);
      }
    } catch (err) {
      setError('Google login failed');
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
            alt="Illustration showing login concept"
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
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-sm text-gray-600">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" aria-live="assertive">
            {error && (
              <div className="text-red-600 text-center font-semibold">{error}</div>
            )}

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                placeholder="Email Address"
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>

            {/* Password Input */}
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
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition duration-200"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm hover:underline transition-colors duration-200"
                style={{ color: "#A0C878" }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg text-lg font-semibold bg-[#A0C878] transition-all duration-200 hover:bg-[#8fb862] hover:scale-105 active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin" size={18} />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <div className="px-3 text-gray-500">or</div>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleAuth}
                onError={() => setError('Google login failed')}
                shape="pill"
                theme="filled_blue"
                size="large"
                text="signin_with"
              />
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium hover:underline transition-colors duration-200"
                style={{ color: "#A0C878" }}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
