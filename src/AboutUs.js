import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h1>About Smart Feedback System</h1>
      <p>
        Smart Feedback System collects user feedback from <strong>portal</strong>, <strong>email</strong>, and <strong>Facebook</strong>,
        analyzes it using <span className="highlight">AI</span> to detect sentiment,
        and helps admins respond faster with intelligent replies.
      </p>

      <div className="contact-section">
        <h2>📞 Contact Us</h2>
        <ul>
          <li>📧 Email: <a href="mailto:krishnalekha5580@gmail.com">krishnalekha5580@gmail.com</a></li>
          <li>📘 Facebook Page: <a href="https://www.facebook.com/profile.php?id=61560330197334" target="_blank" rel="noreferrer">Smart Feedback System</a></li>
          <li>🌐 Website: <a href="http://localhost:3000" target="_blank" rel="noreferrer">Smart Feedback Portal</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
