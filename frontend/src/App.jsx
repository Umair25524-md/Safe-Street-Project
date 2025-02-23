import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import 'remixicon/fonts/remixicon.css';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Signup from "./components/Signup";
import axios from "axios";
import AboutPage from "./components/About";
import ContactPage from "./components/Contact";
import AdminPanel from './AdminPanel';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/isAuthenticated', {
          withCredentials: true
        });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } 
    }
    checkAuth();
  }, []);

  return (
    <Router>
      <NavbarWrapper isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

const NavbarWrapper = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];

  return (
    !hideNavbarRoutes.includes(location.pathname) && 
    <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
  );
}

export default App;
