import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirecting(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Wait for 3 seconds before redirecting
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111827] text-white p-4">
        <div className="text-center">
          <h1 className="text-xl">Please log in first.</h1>
          {redirecting && <h2>Redirecting to Login Page...</h2>}
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
