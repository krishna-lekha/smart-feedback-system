import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const isUserPage = path.startsWith("/user");
  const isAdminPage = path.startsWith("/admin");
  const isHome = path === "/";

  return (
    <nav>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>

        {isHome && (
          <>
            <li><Link to="/user/signup">User Signup</Link></li>
            <li><Link to="/user/login">User Login</Link></li>
            <li><Link to="/admin/signup">Admin Signup</Link></li>
            <li><Link to="/admin/login">Admin Login</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </>
        )}

        {isUserPage && (
          <>
            <li><Link to="/user/signup">User Signup</Link></li>
            <li><Link to="/user/login">User Login</Link></li>
          </>
        )}

        {isAdminPage && (
          <>
            <li><Link to="/admin/signup">Admin Signup</Link></li>
            <li><Link to="/admin/login">Admin Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
