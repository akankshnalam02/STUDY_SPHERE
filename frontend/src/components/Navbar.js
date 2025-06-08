import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="logo" onClick={() => navigate("/")}>Study Sphere</h1>
      </div>
      <div className="navbar-center">
        {userRole && <span className="role-display">{userRole === "admin" ? "Admin Mode" : "User Mode"}</span>}
      </div>
      <nav className="navbar-right">
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
};

export default Navbar;
