import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      axios.get(`http://localhost:5000/verify-email?token=${token}`)
        .then((response) => {
          setMessage(response.data.message);
        })
        .catch((error) => {
          setMessage(error.response?.data?.message || 'Something went wrong.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setMessage('Invalid or missing token.');
      setLoading(false);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Email Verification
        </h1>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6">
            {/* Pulse Loading Animation */}
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute top-0 w-full h-full rounded-full bg-indigo-500 opacity-75 animate-ping"></div>
              <div className="relative w-full h-full rounded-full bg-indigo-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 font-medium">Verifying your email...</p>
          </div>
        ) : (
          <div className="py-6">
            {message.includes('success') || message.includes('verified') ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-800 mb-2">{message}</p>
                <p className="text-gray-600">You can now return to the application and log in.</p>
                <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                    onClick={() => navigate('/login')}>
                  Go to Login
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-800 mb-2">Verification Failed</p>
                <p className="text-gray-600">{message}</p>
                <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                    onClick={() => navigate('/signup')}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="mt-8 text-center text-gray-500 text-sm">
        &copy; 2025 Your Company. All rights reserved.
      </p>
    </div>
  );
};

export default VerifyEmail;