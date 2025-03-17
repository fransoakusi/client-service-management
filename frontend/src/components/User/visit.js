import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "./visit.css";

const VisitorManagement = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    visitId: "",
    name: "",
    contact: "",
    location: "",
    gender: "",
    officeDirected: "",
    purpose: "",
    timeIn: "",
    timeOut: "",
  });

  const [visitors, setVisitors] = useState([]);
  const [selectedVisitorId, setSelectedVisitorId] = useState(null);

  // Fetch visitors from backend
  const fetchVisitors = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5001/clients/get_visitors");
      const visitorData = response.data.map((visitor, index) => ({
        id: index + 1, // DataGrid requires an `id` field
        ...visitor,
      }));
      setVisitors(visitorData);
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save new visitor
  const handleSave = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5001/clients/add_visitor", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        alert("Visitor saved successfully!");
        fetchVisitors(); // Refresh visitors list
        clearForm();
      }
    } catch (error) {
      console.error("Error saving visitor:", error);
      alert("Failed to save visitor. Please try again.");
    }
  };

  // Handle row selection in DataGrid
  const handleRowSelection = (params) => {
    const selectedVisitor = visitors.find((visitor) => visitor.id === params.id);
    if (selectedVisitor) {
      setSelectedVisitorId(selectedVisitor._id);
      setFormData(selectedVisitor);
    }
  };

  // Update visitor information
  const handleUpdate = async () => {
    if (!selectedVisitorId) {
      alert("Please select a visitor to update.");
      return;
    }

    try {
      const response = await axios.put(`http://127.0.0.1:5001/clients/update_visitor/${selectedVisitorId}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert("Visitor updated successfully!");
        fetchVisitors(); // Refresh visitors list
        clearForm();
      }
    } catch (error) {
      console.error("Error updating visitor:", error);
      alert("Failed to update visitor. Please try again.");
    }
  };

  // Clear form fields
  const clearForm = () => {
    setFormData({
      visitId: `VIS${String(visitors.length + 1).padStart(4, "0")}`,
      name: "",
      contact: "",
      location: "",
      gender: "",
      officeDirected: "",
      purpose: "",
      timeIn: "",
      timeOut: "",
    });
    setSelectedVisitorId(null);
  };

  // Handle logout


  // Table columns for DataGrid
  const columns = [
    { field: "id", headerName: "#", width: 50 },
    { field: "visitId", headerName: "Visit ID", width: 100 },
    { field: "name", headerName: "Client Name", width: 150 },
    { field: "contact", headerName: "Contact", width: 120 },
    { field: "location", headerName: "Location", width: 120 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "officeDirected", headerName: "Office Directed To", width: 160 },
    { field: "purpose", headerName: "Purpose", width: 200 },
    { field: "timeIn", headerName: "Time In", width: 100 },
    { field: "timeOut", headerName: "Time Out", width: 100 },
  ];

  return (
    <div className="container">
      <div className="headerv">CLIENT FLOW - NORTH TONGU CLIENT SERVICE MANAGEMENT SYSTEM</div>

      <div className="navbar">
  <button className="nav-button" onClick={() => navigate("/user/dashboard")}>Dashboard</button>
  <button className="nav-button" onClick={() => navigate("/user/visit")}>Visitors</button>
  <button className="nav-button" onClick={() => navigate("/user/complaints")}>Complaint</button>
  <button className="nav-button" onClick={() => navigate("/user/enquiry")}>Enquiry</button>
  <button className="nav-button" onClick={() => navigate("/enquiry-response")}>Enquiry Response</button>
  <button className="nav-button" onClick={() => navigate("/referral")}>Referral</button>
  <button className="nav-button" onClick={() => navigate("/report")}>Report</button>
  
</div>


      
      <div className="form-container">
        <div className="form-grid">
          {[
            { label: "Visit ID", name: "visitId", readOnly: true },
            { label: "Name of Client", name: "name" },
            { label: "Contact Details", name: "contact" },
            { label: "Location", name: "location" },
            { label: "Office Directed To", name: "officeDirected" },
          ].map(({ label, name, readOnly }) => (
            <div className="form-group small-input" key={name}>
              <label>{label}</label>
              <input type="text" name={name} value={formData[name]} onChange={handleChange} className="input-box" readOnly={readOnly} />
            </div>
          ))}
          <div className="form-group small-input">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="input-box">
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-group purpose">
            <label>Purpose of Visit</label>
            <textarea name="purpose" value={formData.purpose} onChange={handleChange} className="input-box" />
          </div>
          <div className="form-group small-input">
            <label>Time In</label>
            <input type="time" name="timeIn" value={formData.timeIn} onChange={handleChange} className="input-box" />
          </div>
          <div className="form-group small-input">
            <label>Time Out</label>
            <input type="time" name="timeOut" value={formData.timeOut} onChange={handleChange} className="input-box" />
          </div>
        </div>
        <div className="button-group">
          <button className="btn add" onClick={clearForm}>Add New</button>
          <button className="btn save" onClick={handleSave}>Save</button>
          <button className="btn update" onClick={handleUpdate}>Update</button>
          <button className="btn clear" onClick={clearForm}>Clear</button>
        </div>
      </div>
      <div className="table-container">
        <DataGrid
          rows={visitors}
          columns={columns}
          pageSize={5}
          autoHeight
          className="custom-datagrid"
          onRowClick={handleRowSelection}
        />
      </div>
    </div>
  );
};

export default VisitorManagement;
