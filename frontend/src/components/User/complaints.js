import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import "./complaints.css";

const ClientComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch saved complaints from the database (mocked here)
    fetch("/api/complaints")
      .then((res) => res.json())
      .then((data) => setComplaints(data))
      .catch((err) => console.error("Error fetching complaints:", err));
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "age", headerName: "Age", width: 100 },
    { field: "mode", headerName: "Mode of Complaint", width: 180 },
    { field: "gender", headerName: "Gender", width: 120 },
    { field: "disability", headerName: "Disability", width: 120 },
    { field: "contact", headerName: "Contact", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "actionOffice", headerName: "Action Office", width: 150 },
    { field: "time", headerName: "Time", width: 150 },
  ];

  return (
    <div className="container">
      <header>
        <h3>CLIENT FLOW - NORTH TONGU CLIENT SERVICE MANAGEMENT SYSTEM</h3>
        
      </header>
      <nav>
        <button onClick={() => navigate("/user/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/user/visit")}>Visitors</button>
        <button className="active" onClick={() => navigate("/complaints")}>Complaint</button>
        <button onClick={() => navigate("/user/enquiry")}>Enquiry</button>
        <button onClick={() => navigate("/user/enquiry-response")}>Enquiry Response</button>
        <button onClick={() => navigate("/user/referral")}>Referral</button>
        <button onClick={() => navigate("/user/report")}>Report</button>
        <button onClick={() => navigate("/user/logout")}>Logout</button>
      </nav>
      <div className="form-section">
        <div className="form-group">
          <label>COMPLIANT ID</label>
          <input type="text" value="COM0001" readOnly />
        </div>
        <div className="form-group">
          <label>Name of Compliant</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Age Bracket</label>
          <select>
            <option>Select</option>
            <option>18 to 35</option>
            <option>36 to 60</option>
            <option>60 to 80</option>
          </select>
        </div>
        <div className="form-group">
          <label>Mode of Complaint</label>
          <select>
            <option>Select</option>
            <option>Walk In</option>
            <option>On Phone</option>
          </select>
        </div>
        <div className="form-group">
          <label>Client Contact</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select>
            <option>Select</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Disability?</label>
          <select>
            <option>Select</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div className="form-group">
          <label>Disability Type</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Action Office</label>
          <select>
            <option>Select</option>
            <option>Works</option>
            <option>Planning</option>
            <option>Director</option>
            <option>Finance</option>
            <option>Physical Planning</option>
            <option>Social Welfare</option>
            <option>DCE</option>
            <option>Environmental Health</option>
          </select>
        </div>
      </div>
      <div className="textarea-group">
        <label>Brief of Complaint</label>
        <textarea></textarea>
      </div>
      <div className="status-group">
        <label>Status</label>
        <div>
          <input type="radio" name="status" /> Pending
          <input type="radio" name="status" /> Responded
        </div>
      </div>
      <div className="action-buttons">
        <button className="btn add">Add New</button>
        <button className="btn save">Save</button>
        <button className="btn update">Update</button>
        <button className="btn clear">Clear</button>
      </div>
      <div className="datagrid-container">
        <h3>Complaint Records</h3>
        <DataGrid rows={complaints} columns={columns} pageSize={5} autoHeight checkboxSelection />
      </div>
    </div>
  );
};

export default ClientComplaint;
