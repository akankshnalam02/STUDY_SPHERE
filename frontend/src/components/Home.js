import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import anime from "animejs";
import "../styles/Home.css"; // Make sure this file exists with the provided styles

const Home = ({ userRole, setUserRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Animate waves using Anime.js
    const wavePath1 = document.querySelector("#wavePath1");
    const wavePath2 = document.querySelector("#wavePath2");

    if (wavePath1 && wavePath2) {
      const wave1Orig =
        "M0,300 C300,200 600,400 900,300 C1200,200 1440,350 1440,350 L1440,600 L0,600 Z";
      const wave1Morph =
        "M0,340 C300,450 600,250 900,340 C1200,450 1440,320 1440,320 L1440,600 L0,600 Z";
      const wave2Orig =
        "M0,350 C350,400 700,150 1050,350 C1400,400 1440,300 1440,300 L1440,600 L0,600 Z";
      const wave2Morph =
        "M0,400 C350,200 700,450 1050,400 C1400,200 1440,350 1440,350 L1440,600 L0,600 Z";

      anime.timeline({
        loop: true,
        direction: "alternate",
      })
        .add({
          targets: wavePath1,
          d: [wave1Orig, wave1Morph],
          easing: "easeInOutQuad",
          duration: 4000,
        })
        .add({
          targets: wavePath2,
          d: [wave2Orig, wave2Morph],
          easing: "easeInOutQuad",
          duration: 4000,
          offset: "-=2000",
        });
    }

    // Disable scrolling on the home page for a focused UI
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleRoleChange = (role) => {
    setUserRole(role);
  };

  const handleContinue = () => {
    // Navigate to the respective dashboard based on the role selected
    if (userRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  return (
    <div className="home-container">
      {/* Wave Background */}
      <div className="wave-container">
        <svg className="wave-svg" viewBox="0 0 1300 600" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFA500" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFA500" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF4500" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path id="wavePath1" fill="url(#waveGradient1)" d="M0,300 C300,200 600,400 900,300 C1200,200 1440,350 1440,350 L1440,600 L0,600 Z"></path>
          <path id="wavePath2" fill="url(#waveGradient2)" d="M0,350 C350,400 700,150 1050,350 C1400,400 1440,300 1440,300 L1440,600 L0,600 Z"></path>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <h2 className="headline">
          Explore <span>Study Schedules</span> & Resources
        </h2>
        <p className="subtext">
          Empower your learning journey with curated PDFs and dynamic timetables.
        </p>
        <div className="toggle-section">
          <p>Select Mode:</p>
          <button className="toggle-btn" onClick={() => handleRoleChange("user")}>
            User
          </button>
          <button className="toggle-btn" onClick={() => handleRoleChange("admin")}>
            Admin
          </button>
        </div>
        <button className="continue-btn" onClick={handleContinue}>
          Continue
          <span className="arrow-circle">
            <i className="fas fa-arrow-right"></i>
          </span>
        </button>
      </section>
    </div>
  );
};

export default Home;
