import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from './utils/logout'; // Import the logout function
import "./UserDashboard.css"; // Import styling

const UserDashboard = () => {
  const navigate = useNavigate();

  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="profile-section">
          <img
            src={require("./images/profile.png")} // Profile picture
            alt="Profile"
            className="profile-pic"
          />
          <h1 className="greeting">{getGreeting()}, User!</h1>
          <button onClick={() => logout(navigate)}>Logout</button> {/* Logout button */}
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          
          {/* Post Feedback Card */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/feedback")} // Navigate to Post Feedback page
          >
            <img
              src={require("./images/feedback.png")}
              alt="Post Feedback"
              className="card-icon"
            />
            <h2>Post Feedback</h2>
          </div>

          {/* View Status Card */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/viewstatus")} // Navigate to Status page
          >
            <img
              src={require("./images/status.png")}
              alt="Status"
              className="card-icon"
            />
            <h2>View Status</h2>
          </div>

        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
