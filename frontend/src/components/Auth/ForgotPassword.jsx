import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp, resetPassword } from '../../api/auth';

const ForgotPassword = ({onSubmit}) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await sendOtp(email);
      if (data.success) {
        setMessage('OTP sent to email');
        setStep(2);
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await resetPassword(email, otp, newPassword);
      if (data.success) {
        setMessage('Password reset. Redirecting to login...');
        onSubmit();
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Email"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A0C878] text-white p-2 rounded hover:bg-[#8fb862] disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="OTP"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="New Password"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A0C878] text-white p-2 rounded hover:bg-[#8fb862] disabled:opacity-60"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        
        <div className="text-center mt-4">
          <Link to="/login" className="text-[#A0C878] hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;