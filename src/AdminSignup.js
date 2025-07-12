import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserSignup.css';
import blackBackground from './images/bg2.png';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'email') {
      validateEmail(value);
    }
    if (name === 'username') {
      validateUsername(value);
    }
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validateUsername = (username) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      username: username.length < 3 ? 'Username must be at least 3 characters long' : ''
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domainAllowed = email.endsWith('@admin.com');

    setErrors((prevErrors) => ({
      ...prevErrors,
      email: emailRegex.test(email) && domainAllowed
        ? ''
        : 'Email must end with @admin.com',
    }));
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    setErrors((prevErrors) => ({
      ...prevErrors,
      password: passwordRegex.test(password)
        ? ''
        : 'Password must be at least 8 characters, include uppercase, lowercase, number, and a special character.',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    validateEmail(formData.email);
    validateUsername(formData.username);
    validatePassword(formData.password);

    // Check for any errors
    if (errors.email || errors.username || errors.password) {
      alert('Please fix all errors before submitting.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Signup successful!');
        navigate('/admin/login');
      } else {
        alert(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      alert('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="user-signup-container" style={{ backgroundImage: `url(${blackBackground})` }}>
      <div className="user-signup-box">
        <h2>Admin Signup</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Field - Now First */}
          <div className="form-group">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error-input' : ''}`}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* Username Field - Now in Middle */}
          <div className="form-group">
            <input
              name="username"
              type="text"
              placeholder="Admin Username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'error-input' : ''}`}
              required
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>

          {/* Password Field - Now Last */}
          <div className="form-group">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error-input' : ''}`}
              required
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <p className="note">
            * Admins must use a valid institutional email (@admin.com)
          </p>

          <button
            type="submit"
            className="signup-button"
            disabled={errors.email || errors.username || errors.password}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;