import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from './utils/logout'; // Import the logout function
import "./AdminDashboard.css"; // For styling

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  const handleFetchEmails = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/fetch-emails");
    const data = await res.json();
   alert(data.message || "Something went wrong");
  } catch (err) {
    console.error("Fetch failed:", err);
    alert("Failed to fetch emails");
  }
};

const handleFetchFacebookComments = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/facebook/fetch-facebook");
    const data = await res.json();

    if (res.ok) {
      alert(data.message || `✅ Facebook comments fetched successfully.`);
    } else {
      alert("❌ Failed to fetch Facebook comments: " + data.error);
    }
  } catch (err) {
    console.error("Facebook fetch error:", err);
    alert("❌ Error occurred while fetching Facebook feedbacks.");
  }
};

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="profile-section">
          <img
            src={require("./images/profile.png")}
            alt="Profile"
            className="profile-pic"
          />
          <h1 className="greeting">{getGreeting()}, Admin!</h1>
          <button onClick={() => logout(navigate)}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">

          <div
            className="dashboard-card"
            onClick={() => navigate("/view-feedback")}
          >
            <img
              src={require("./images/feedback.png")}
              alt="Feedback"
              className="card-icon"
            />
            <h2>View Feedback</h2>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/status")}
          >
            <img
              src={require("./images/status.png")}
              alt="Status"
              className="card-icon"
            />
            <h2>Update Status</h2>
          </div>
          <div
              className="dashboard-card"
              onClick={() => navigate("/analysis")}
            >
              <img
                src={require("./images/analysis.png")}  // make sure this image exists
                alt="Analysis"
                className="card-icon"
                style={{ width: "80px", height: "80px" }} 
              />
              <h2>Visualize Analysis</h2>
          </div>
                   
        <div className="fetch-buttons-card">
          <button
            onClick={handleFetchEmails}
            className="fetch-button"
          >
            Fetch New Email Feedbacks
          </button>

          <button
            onClick={handleFetchFacebookComments}
            className="fetch-button"
          >
            Fetch Facebook Comments
          </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
