import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/logout"

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome, Finance</h1>
      <button onClick={() => logout(navigate)} style={logoutButtonStyle}>
        Logout
      </button>
    </div>
  );
};

// Custom styles for the button (optional)
const logoutButtonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "#2196F3",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Dashboard;
