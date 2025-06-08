import React, { useEffect } from "react";
import anime from "animejs";
import "../styles/UserDashboard.css"; // Create this file as needed

const UserDashboard = () => {
  useEffect(() => {
    // Wave Animation (if not already handled elsewhere)
    const wavePath1 = document.querySelector("#wavePath1");
    const wavePath2 = document.querySelector("#wavePath2");
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

    // Toggle Button Logic
    const toggleBtn = document.getElementById("toggleBtn");
    const pdfOptions = document.getElementById("pdfOptions");
    const timeTableOptions = document.getElementById("timeTableOptions");

    if (toggleBtn && pdfOptions && timeTableOptions) {
      // Set default: active for PDF options
      toggleBtn.classList.add("active");
      pdfOptions.style.display = "flex";
      timeTableOptions.style.display = "none";

      const toggleHandler = () => {
        toggleBtn.classList.toggle("active");
        const isActive = toggleBtn.classList.contains("active");
        pdfOptions.style.display = isActive ? "flex" : "none";
        timeTableOptions.style.display = isActive ? "none" : "flex";
      };

      toggleBtn.addEventListener("click", toggleHandler);

      // Cleanup listener on component unmount
      return () => {
        toggleBtn.removeEventListener("click", toggleHandler);
      };
    }
  }, []);

  return (
    <div className="user-dashboard-container">
      {/* Wave Background */}
      <div className="wave-container">
        <svg className="wave-svg" viewBox="0 0 1280 600" preserveAspectRatio="xMidYMid meet">
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
          <path
            id="wavePath1"
            fill="url(#waveGradient1)"
            d="M0,300 C300,200 600,400 900,300 C1200,200 1440,350 1440,350 L1440,600 L0,600 Z"
          ></path>
          <path
            id="wavePath2"
            fill="url(#waveGradient2)"
            d="M0,350 C350,400 700,150 1050,350 C1400,400 1440,300 1440,300 L1440,600 L0,600 Z"
          ></path>
        </svg>
      </div>

      {/* Main Dashboard Container */}
      <div className="dashboard-container">
        <div className="toggle-container">
          <span className="toggle-label">Time Table</span>
          <div className="toggle-button" id="toggleBtn"></div>
          <span className="toggle-label">PDF</span>
        </div>
        {/* PDF Options */}
        <div className="dropdown-container" id="pdfOptions">
          <select>
            <option>Select Year</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
          <select>
            <option>Select Subject</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Computer Science</option>
          </select>
          <select>
            <option>Select Teacher</option>
            <option>Dr. Rao</option>
            <option>Prof. Sharma</option>
            <option>Ms. Patel</option>
          </select>
          <button className="submit-btn">Submit</button>
        </div>
        {/* Time Table Options */}
        <div className="dropdown-container" id="timeTableOptions">
          <select>
            <option>Select Year</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
          <select>
            <option>Select Branch</option>
            <option>CSE</option>
            <option>ECE</option>
            <option>EEE</option>
            <option>MECH</option>
            <option>CIVIL</option>
          </select>
          <select>
            <option>Select Section</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
          </select>
          <button className="submit-btn">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
