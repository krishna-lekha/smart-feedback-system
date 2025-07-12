import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'user') {
      alert('You are already logged in as a user. Please log out to access admin.');
      navigate('/user/dashboard');
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
      const response = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        localStorage.setItem('userRole', 'admin');
        navigate('/admin/dashboard'); 
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#1a73e8' }}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
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

export default AdminLogin;