import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Admin/Home";
import CreateUser from "./components/Admin/CreateUser";
import Dashboard from "./components/User/Dashboard";
import Director from "./components/User/Director";
import Environment from "./components/User/Environment";
import DCE from "./components/User/Dce";
import Finance from "./components/User/Finance";
import Physical from "./components/User/Physical";
import Social from "./components/User/Social";
import Works from "./components/User/Works";
import Profile from "./components/User/Profile";
import Complaint from "./components/User/complaints";
import Visit from "./components/User/visit";
import Enquiry from "./components/User/enquiry";
import EnquiryResponse from "./components/User/enquiryresponse";
import Referral from "./components/User/referral";
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
            <Route path="/user/environment" element={<Environment />} />
            <Route path="/user/director" element={<Director />} />
            <Route path="/user/dce" element={<DCE />} />
            <Route path="/user/finance" element={<Finance />} />
            <Route path="/user/physical" element={<Physical />} />
            <Route path="/user/social" element={<Social />} />
            <Route path="/user/works" element={<Works />} />
            <Route path="/user/profile" element={<Profile />} />

            
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
          
        )}
      </Routes>
      <Routes>
        <Route path="/user/complaints" element={<Complaint/>} />
        <Route path="/user/visit" element={<Visit/>} />
        <Route path="/user/enquiry" element={<Enquiry/>} />
        <Route path="/user/enquiryresponse" element={<EnquiryResponse/>} />
        <Route path="/user/referral" element={<Referral/>} />
      </Routes>
      
    </Router>
  );
};

export default App;
