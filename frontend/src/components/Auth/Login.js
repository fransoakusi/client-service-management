import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Import external CSS for styling
import logo from "./../../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Receptionist");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Add a class to trigger the entrance animation
    document.body.classList.add("login-page-loaded");
    return () => {
      document.body.classList.remove("login-page-loaded");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

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

      navigate(roleRoutes[role] || "/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className={`login-box ${shake ? "shake" : ""}`}>
        <div className="login-header">
          <div className="logo-container">
            <img src={logo} alt="Company Logo" className="login-logo" />
          </div>
          <h2 className="login-title">Client Service Management</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {error && (
          <div className="error-message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
            <div className="input-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="input-icon"
              >
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
              </svg>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div className="input-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="input-icon"
              >
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              </svg>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role" className="input-label">
              Role
            </label>
            <div className="input-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="input-icon"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
              </svg>
              <select
                id="role"
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
            </div>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Having trouble signing in? <a href="/support" className="support-link">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;