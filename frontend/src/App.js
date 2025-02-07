import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Admin/Home";
import CreateUser from "./components/Admin/CreateUser";
import Dashboard from "./components/User/Dashboard";
import Profile from "./components/User/Profile";

const App = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        {isAuthenticated ? (
          <>
            <Route path="/admin/home" element={<Home/>} />
            <Route path="/admin/create-user" element={<CreateUser />} />
            <Route path="/user/dashboard" element={<Dashboard />} />
            <Route path="/user/profile" element={<Profile />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
