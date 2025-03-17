import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { FaUser, FaClipboardList, FaPhone, FaUsers, FaBell, FaUserCircle } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/user/dashboard" },
    { name: "Visitors", path: "/user/visit" },
    { name: "Complaint", path: "/user/complaints" },
    { name: "Enquiry", path: "/other/enquiry" },
    { name: "Enquiry Response", path: "/user/enquiry-response" },
    { name: "Referral", path: "/user/referral" },
    { name: "Report", path: "/user/report" }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="title">CLIENT FLOW - NORTH TONGU CLIENT SERVICE MANAGEMENT SYSTEM</div>
        <div className="datetime">
          <span>{time.toDateString()}</span>
          <span>{time.toLocaleTimeString()}</span>
        </div>
        <div className="user-section">
          <FaBell className="icon" />
          <span className="amount">0.00</span>
          <FaUserCircle className="icon" />
          <span>Afful Bismark</span>
        </div>
      </header>

      <nav className="dashboard-nav">
        {navItems.map((item) => (
          <button key={item.name} onClick={() => navigate(item.path)}>
            {item.name}
          </button>
        ))}
        <button className="logout" onClick={() => navigate("/")}>Logout</button>
      </nav>

      <main className="dashboard-content">
        <div className="card-grid">
          <div className="card red"><FaUser /> <span>Total Visitors</span> <strong>0</strong></div>
          <div className="card gray"><FaClipboardList /> <span>Total Complaints</span> <strong>0</strong></div>
          <div className="card yellow"><FaPhone /> <span>Total Enquiries</span> <strong>0</strong></div>
          <div className="card pink"><FaUsers /> <span>Total Referrals</span> <strong>0</strong></div>
        </div>
      </main>

      <footer className="dashboard-footer">
        Designed by: <strong>KABTECH</strong> 0545041128
      </footer>
    </div>
  );
};

export default Dashboard;
