import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blackBackground from "./images/bg2.png"; // Import black background

const UserLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email:'',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      alert('You are already logged in as an admin. Please log out to access user.');
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(result.message);
        localStorage.setItem('userRole', 'user');
        localStorage.setItem("userName", result.name);
        localStorage.setItem("userEmail", formData.email);
        navigate('/user/dashboard');
      } else {
        alert(result.error || 'Login failed. Please check your credentials.');
      }

    } catch (error) {
      console.error('Login Error:', error);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <div 
      className="user-login-container"
      style={{ backgroundImage: `url(${blackBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="user-login-box">
        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#1a73e8' }}>User Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-input"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              required // 👈 Make required if needed
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              type="text"
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              type="password"
              required
            />
          </div>
          <button className="common-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
  
};

export default UserLogin;