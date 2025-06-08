import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";  // Make sure to add proper styling

const Signup = () => {
  // To prevent body overflow on this page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  // Handle input field changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle the signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // Sending the registration request to the backend
    try {
      const response = await axios.post("http://localhost:5000/api/auth/user/register", user);

      // If signup is successful, alert the user and navigate to login page
      alert(response.data.message);
      navigate("/login");  // Redirect to login page after successful registration
    } catch (error) {
      // If there's an error (e.g., user already exists)
      alert(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs" className="auth-container">
      <Typography variant="h4" align="center">Sign Up</Typography>
      <Box component="form" onSubmit={handleSignup} sx={{ mt: 2 }}>
        <TextField 
          fullWidth 
          label="Username" 
          name="username" 
          margin="normal" 
          onChange={handleChange} 
          required 
        />
        <TextField 
          fullWidth 
          label="Email" 
          name="email" 
          margin="normal" 
          onChange={handleChange} 
          required 
        />
        <TextField 
          fullWidth 
          label="Password" 
          name="password" 
          type="password" 
          margin="normal" 
          onChange={handleChange} 
          required 
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default Signup;
