import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Import external CSS for styling
import logo from "./../../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Receptionist"); // Default role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5001/auth/login", {
        email,
        password,
        role,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", role);

      // Redirect user based on role
      const roleRoutes = {
        Receptionist: "/user/dashboard",
        Director: "/user/director",
        "Social Welfare": "/user/social",
        Finance: "user//finance",
        Works: "user/works",
        "Physical Planning": "/user/physical",
        DCE: "/user/dce",
        "Environmental Health": "/user/environment",
        Admin: "/admin/home",
      };

      navigate(roleRoutes[role] || "/user/dashboard"); // Default to user dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Client Service Management</h2>

        {/* Logo Section */}
        <div className="logo-container">
          <img src={logo} alt="Company Logo" className="login-logo" />
        </div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </label>
          <label>
            Role:
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="login-input"
              required
            >
              <option value="Receptionist">Receptionist</option>
              <option value="Director">Director</option>
              <option value="Social Welfare">Social Welfare</option>
              <option value="Finance">Finance</option>
              <option value="Works">Works</option>
              <option value="Physical Planning">Physical Planning</option>
              <option value="DCE">DCE</option>
              <option value="Environmental Health">Environmental Health</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
