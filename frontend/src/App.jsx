

import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import 'remixicon/fonts/remixicon.css';
import axios from "axios";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AboutPage from "./components/About";
import ContactPage from "./components/Contact";
import Analysis from "./components/Analysis";
import Notifications from "./components/Notification";
import Report from "./components/Report";
import Advanced from "./components/Advanced";
import VerifyEmail from "./components/verifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./components/History"; // ✅ Newly added
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import protected route

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // "admin" or "user"

  // Fetch authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/isAuthenticated', {
          withCredentials: true
        });
        setIsAuthenticated(response.data.isAuthenticated);
        setUserRole(response.data.role); // Assuming backend returns { isAuthenticated, role }
        setUserRole(response.data.role); // Assuming your backend returns { isAuthenticated, role }
      } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };
    checkAuth();
  }, []);
  }, []); // Empty dependency array ensures this runs only once

  return (
    <Router>
      <NavbarWrapper isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/advanced" element={<Advanced />} />

        {/* ✅ Protected Routes for Admin */}
        <Route
          path="/analysis"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <Analysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* ✅ Protected Route for Report */}

        {/* Protected Routes for Admin */}
        <Route
          path="/analysis"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <Analysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Protected Route for Report */}
        <Route
          path="/report"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <Report />
            </ProtectedRoute>
          }
        />

        {/* ✅ New Protected Route for History */}
        <Route
          path="/history"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <History />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

// Helper to hide navbar on certain routes
const NavbarWrapper = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup', '/verify-email'];

  return (
    !hideNavbarRoutes.includes(location.pathname) &&
    <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
  );
};

export default App;

