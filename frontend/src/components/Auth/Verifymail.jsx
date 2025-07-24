import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../api/auth';
import useAuthStore from '../../zustand/authStore';
import toast from 'react-hot-toast';

const Verifymail = () => {

  const initialize = useAuthStore((state) => state.initialize);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  //const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await verifyEmail(email, otp);
      
      if (data.success) {
        console.log("hii");
        initialize();
        setSuccess(true);
        toast(`Welcome ${data.email}`)
        navigate('/dashboard');
        // setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <p>No email provided. Please register again.</p>
          <Link
            to="/register"
            className="mt-4 inline-block text-[#A0C878] hover:underline"
          >
            Go to Register
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <p className="text-green-600">Email verified! Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Email</h2>
        <p className="mb-4 text-center">Enter the OTP sent to {email}</p>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="OTP"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A0C878] text-white p-2 rounded hover:bg-[#8fb862] disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verifymail;