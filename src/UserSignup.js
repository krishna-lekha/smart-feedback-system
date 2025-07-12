import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserSignup.css";
import blackBackground from "./images/bg2.png";
import emailjs from "@emailjs/browser"; // <-- Import EmailJS

const UserSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "email") validateEmail(value);
    if (name === "password") validatePassword(value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: isValid ? "" : "Invalid email format.",
    }));
    return isValid;
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    const isValid = passwordRegex.test(password);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: isValid
        ? ""
        : "Password must be at least 8 characters, include uppercase, lowercase, number, and a special character.",
    }));
    return isValid;
  };

  const sendEmail = () => {
    const templateParams = {
      username: formData.username,
      email: formData.email,
    };

    emailjs
      .send(
        "service_xr7jlj2", // replace with your actual service ID
        "template_7umj7c7", // replace with your actual template ID
        templateParams,
        "N069I81lT_wx8_ONU" // replace with your actual public key
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response.text);
        },
        (error) => {
          console.error("Email send error:", error);
        }
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);

    if (!isEmailValid || !isPasswordValid) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        sendEmail(); // send welcome email after successful signup
        navigate("/user/login");
      } else {
        alert(result.error || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("An error occurred during signup.");
    }
  };

  return (
    <div
      className="user-signup-container"
      style={{ backgroundImage: `url(${blackBackground})` }}
    >
      <div className="user-signup-box">
        <h2>User Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "error-input" : ""}`}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? "error-input" : ""}`}
              required
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          <p className="note">* Use your registration number as your username.</p>

          <button
            type="submit"
            className="signup-button"
            disabled={errors.email || errors.password}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
