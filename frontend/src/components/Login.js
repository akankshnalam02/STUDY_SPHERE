import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const Login = () => {
  // Disable scrolling on login page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sending login request to the backend
      const response = await axios.post("http://localhost:5000/api/auth/user/login", credentials);

      // If login is successful, save the JWT token and redirect to homepage
      const { token } = response.data;

      // Save token to localStorage
      localStorage.setItem("authToken", token);

      alert(response.data.message);
      navigate("/");  // Redirect to the home page after successful login
    } catch (error) {
      // If user is not registered or credentials are wrong
      alert(error.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs" className="auth-container">
      <Typography variant="h4" align="center">Login</Typography>
      <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
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
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
