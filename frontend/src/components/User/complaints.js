import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiUserPlus, 
  FiSave, 
  FiEdit2, 
  FiTrash2,
  FiClock,
  FiHome,
  FiAlertCircle,
  FiHelpCircle,
  FiShare2,
  FiCalendar
} from "react-icons/fi";
import "./complaints.css";

const ComplaintManagement = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    complaintsid: `COMP${String(Math.floor(1000 + Math.random() * 9000))}`,
    name: "",
    age: "",
    mode: "",
    gender: "",
    disability: "",
    contact: "",
    status: "pending",
    actionOffice: "",
    brief: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString()
  });

  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch complaints from backend
  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5001/complaints/get_complaints");
      const complaintData = response.data.map((complaint, index) => ({
        id: index + 1,
        ...complaint,
        date: complaint.date || new Date().toISOString().split('T')[0]
      }));
      setComplaints(complaintData);
      setFilteredComplaints(complaintData);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save new complaint
  const handleSave = async () => {
    if (!formData.name || !formData.contact) {
      alert("Please fill in required fields (Name and Contact)");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/complaints/add_complaints", 
        formData, 
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        alert("Complaint saved successfully!");
        fetchComplaints();
        clearForm();
      }
    } catch (error) {
      console.error("Error saving complaint:", error);
      alert("Failed to save complaint. Please try again.");
    }
  };

  // Handle row selection in DataGrid
  const handleRowSelection = (params) => {
    const selectedComplaint = complaints.find((complaint) => complaint.id === params.id);
    if (selectedComplaint) {
      setSelectedComplaintId(selectedComplaint._id);
      setFormData(selectedComplaint);
    }
  };

  // Update complaint information
  const handleUpdate = async () => {
    if (!selectedComplaintId) {
      alert("Please select a complaint to update.");
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:5001/complaints/update_complaints/${selectedComplaintId}`, 
        formData, 
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Complaint updated successfully!");
        fetchComplaints();
        clearForm();
      }
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert("Failed to update complaint. Please try again.");
    }
  };

  // Delete complaint
  const handleDelete = async () => {
    if (!selectedComplaintId) {
      alert("Please select a complaint to delete.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this complaint record?")) {
      try {
        const response = await axios.delete(
          `http://127.0.0.1:5001/complaints/delete_complaints/${selectedComplaintId}`
        );

        if (response.status === 200) {
          alert("Complaint deleted successfully!");
          fetchComplaints();
          clearForm();
        }
      } catch (error) {
        console.error("Error deleting complaint:", error);
        alert("Failed to delete complaint. Please try again.");
      }
    }
  };

  // Clear form fields
  const clearForm = () => {
    setFormData({
      complaintsid: `COMP${String(Math.floor(1000 + Math.random() * 9000))}`,
      name: "",
      age: "",
      mode: "",
      gender: "",
      disability: "",
      contact: "",
      status: "pending",
      actionOffice: "",
      brief: "",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString()
    });
    setSelectedComplaintId(null);
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = complaints.filter(
      (complaint) =>
        complaint.complaintsid.toLowerCase().includes(term) ||
        complaint.name.toLowerCase().includes(term) ||
        complaint.contact.toLowerCase().includes(term) ||
        (complaint.date && complaint.date.toLowerCase().includes(term))
    );
    setFilteredComplaints(filtered);
  };

  // Table columns for DataGrid
  const columns = [
    { field: "id", headerName: "#", width: 60, headerClassName: "grid-header" },
    { field: "complaintsid", headerName: "COMPLAINT ID", width: 150, headerClassName: "grid-header" },
    { field: "name", headerName: "COMPLAIANT NAME", width: 180, headerClassName: "grid-header" },
    { field: "age", headerName: "AGE BRACKET", width: 120, headerClassName: "grid-header" },
    { field: "mode", headerName: "MODE", width: 120, headerClassName: "grid-header" },
    { field: "gender", headerName: "GENDER", width: 100, headerClassName: "grid-header" },
    { field: "disability", headerName: "DISABILITY", width: 120, headerClassName: "grid-header" },
    { field: "contact", headerName: "CONTACT", width: 140, headerClassName: "grid-header" },
    { 
      field: "status", 
      headerName: "STATUS", 
      width: 120, 
      headerClassName: "grid-header",
      renderCell: (params) => (
        <div className={`status-badge ${params.value}`}>
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </div>
      )
    },
    { field: "actionOffice", headerName: "ACTION OFFICE", width: 180, headerClassName: "grid-header" },
    { field: "brief", headerName: "BRIEF OF COMPLAINT", width: 180, headerClassName: "grid-header" },
    { 
      field: "date", 
      headerName: "DATE", 
      width: 120, 
      headerClassName: "grid-header",
      renderCell: (params) => (
        <div className="time-cell">
          <FiCalendar className="time-icon" />
          {params.value}
        </div>
      )
    },
    { 
      field: "time", 
      headerName: "TIME", 
      width: 120, 
      headerClassName: "grid-header",
      renderCell: (params) => (
        <div className="time-cell">
          <FiClock className="time-icon" />
          {params.value}
        </div>
      )
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="complaint-management-container">
      <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>North Tongu</h2>
          <p>Client Service System</p>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/user/dashboard" className="nav-link">
                <FiHome className="nav-icon" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/user/visit" className="nav-link">
                <FiUserPlus className="nav-icon" />
                <span>Visitors</span>
              </Link>
            </li>
            <li className="active">
              <Link to="/user/complaints" className="nav-link">
                <FiAlertCircle className="nav-icon" />
                <span>Complaints</span>
              </Link>
            </li>
            <li>
              <Link to="/user/enquiry" className="nav-link">
                <FiHelpCircle className="nav-icon" />
                <span>Enquiries</span>
              </Link>
            </li>
            <li>
              <Link to="/user/enquiryresponse" className="nav-link">
                <FiHelpCircle className="nav-icon" />
                <span>Enquiries Response</span>
              </Link>
            </li>
            <li>
              <Link to="/user/referral" className="nav-link">
                <FiShare2 className="nav-icon" />
                <span>Referrals</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">CF</div>
            <div className="user-info">
              <span className="username">Client Officer</span>
              <span className="role">User</span>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <header className="main-header">
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h1>Complaints Form</h1>
          <div className="header-actions">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="card form-card">
            <div className="card-header">
              <h2>Complaints</h2>
              <div className="card-actions">
                <span className={`status-indicator ${selectedComplaintId ? "edit-mode" : "add-mode"}`}>
                  {selectedComplaintId ? "Edit Mode" : "Add Mode"}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Complaint ID</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      name="complaintsid"
                      value={formData.complaintsid}
                      onChange={handleChange}
                      className="input-field"
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Name of Complainant <span className="required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Details <span className="required">*</span></label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Age Bracket</label>
                  <select
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select Age</option>
                    <option value="18 to 35">18 to 35</option>
                    <option value="36 to 60">36 to 60</option>
                    <option value="60 to 80">60 to 80</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Mode of Complaint</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select Mode</option>
                    <option value="Walk In">Walk In</option>
                    <option value="On Phone">On Phone</option>
                    <option value="Email">Email</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Disability?</label>
                  <select
                    name="disability"
                    value={formData.disability}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Action Office</label>
                  <select
                    name="actionOffice"
                    value={formData.actionOffice}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select Office</option>
                    <option value="Works">Works</option>
                    <option value="Planning">Planning</option>
                    <option value="Director">Director</option>
                    <option value="Finance">Finance</option>
                    <option value="Physical Planning">Physical Planning</option>
                    <option value="Social Welfare">Social Welfare</option>
                    <option value="DCE">DCE</option>
                    <option value="Environmental Health">Environmental Health</option>
                  </select>
                </div>

                <div className="form-group span-2">
                  <label>Brief of Complaint</label>
                  <textarea
                    name="brief"
                    value={formData.brief}
                    onChange={handleChange}
                    className="input-field"
                    rows="3"
                    placeholder="Detailed description of the complaint"
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <div className="input-with-icon">
                    <FiCalendar className="input-icon" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="status"
                        value="pending"
                        checked={formData.status === "pending"}
                        onChange={handleChange}
                      />
                      <span className="radio-custom"></span>
                      Pending
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="status"
                        value="responded"
                        checked={formData.status === "responded"}
                        onChange={handleChange}
                      />
                      <span className="radio-custom"></span>
                      Responded
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <div className="input-with-icon">
                    <FiClock className="input-icon" />
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="input-field"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" onClick={handleSave}>
                  <FiSave className="btn-icon" />
                  Save Complaint
                </button>
                <button className="btn btn-secondary" onClick={handleUpdate} disabled={!selectedComplaintId}>
                  <FiEdit2 className="btn-icon" />
                  Update
                </button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={!selectedComplaintId}>
                  <FiTrash2 className="btn-icon" />
                  Delete
                </button>
                <button className="btn btn-outline" onClick={clearForm}>
                  Clear Form
                </button>
              </div>
            </div>
          </div>

          <div className="card table-card">
            <div className="card-header">
              <h2>Complaint Records</h2>
              <div className="card-actions">
                <span className="record-count">{filteredComplaints.length} records</span>
              </div>
            </div>
            <div className="card-body">
              <div className="data-grid-container">
                <DataGrid
                  rows={filteredComplaints}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 20]}
                  autoHeight
                  loading={isLoading}
                  onRowClick={handleRowSelection}
                  sx={{
                    border: "none",
                    '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid #f0f0f0',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#f8f9fa',
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: '#f8f9fa',
                    },
                  }}
                  getRowClassName={(params) => 
                    params.id === selectedComplaintId ? "selected-row" : ""
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintManagement;