import React from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
import LandingImage from "./images/—Pngtree—contact our male customer service_5412873.png";
import "./Home.css";

const Home = () => {
  return (
    <div className="homepage">
      
      {/* Main Content */}
      <main className="main-content">
        <br></br><br></br>
        {/* Image Section */}
        <div className="image-section">
          <img src={LandingImage} alt="Customer Support Representative" />
        </div>

        {/* Text Section */}
        <div className="text-section">
          <h1>🏦 Smart Feedback System</h1>
          <h2>AI-Powered Banking Feedback Platform</h2>
          <p className="main-text">
         
            Submit your banking feedback easily, track its status, and get intelligent responses powered by AI.          </p>
           <div className="bg-gray-100 p-4 rounded-xl shadow-md mb-6">
             <h3 className="text-lg font-semibold mb-4">Key Features</h3>
              <div className="space-y-2 text-gray-700">
                <div>📩 Feedback via Portal, Gmail & Facebook</div>
                <div>📊 AI Sentiment Analysis & Visual Reports</div>
                <div>🔁 Auto-Responses via Email or Facebook</div>
                <div>📍 Real-Time Status Tracking</div>
              </div>
            </div>
            <br></br>
            <p className="text-center text-lg font-medium text-green-600">
              Your voice matters. Make banking better — one feedback at a time.
            </p>
        </div>
      </main>
    </div>
  );
};

export default Home;