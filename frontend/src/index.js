import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/Home.css";   // Global styles for Home
import "./styles/Navbar.css"; // Global Navbar styles
import "./styles/Auth.css";   // Global styles for Login/Signup
import '@fortawesome/fontawesome-free/css/all.min.css';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
