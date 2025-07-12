import React,{ useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import AboutUs from "./AboutUs";
import UserSignup from './UserSignup';
import UserLogin from './UserLogin';
import AdminSignup from './AdminSignup';
import AdminLogin from './AdminLogin';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import Feedback from './Feedback';
import Home from './Home';
import ViewFeedback from './ViewFeedback';
import StatusPage from './StatusPage';
import VisualizeAnalysis from "./VisualizeAnalysis";
import ViewStatus from './ViewStatus';
import blackBackground from './images/bg2.png'; 
import './App.css';

const BackgroundWrapper = ({ children }) => {
  const location = useLocation();

  // Conditional background based on the route
  const isHomePage = location.pathname === '/';
  const backgroundStyle = {
    backgroundImage: isHomePage ? 'none' : `url(${blackBackground})`, // Fixed template literal
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center', 
    minHeight: '95vh',
    width: '100%',
    marginTop:'2rem',
  };

  return <div style={backgroundStyle}>{children}</div>;
};


// Main App Component
const App = () => {
    // ✅ Hooks MUST be inside this function
  const [roleUpdated, setRoleUpdated] = useState(false);

  useEffect(() => {
    const onStorageChange = () => setRoleUpdated(prev => !prev);
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return (
    <Router>
      <Navbar roleUpdated={roleUpdated} />
      <BackgroundWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/view-feedback" element={<ViewFeedback />} />
          <Route path="/analysis" element={<VisualizeAnalysis />} />
          {/* <Route path="/external-feedbacks" element={<ExternalFeedbacks />} /> */}
          <Route path="/status" element={<StatusPage />} />
          <Route path="/viewstatus" element={<ViewStatus />} />
        </Routes>
      </BackgroundWrapper>
    </Router>
  );
};

export default App;