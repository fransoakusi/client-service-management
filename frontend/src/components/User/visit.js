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
import "./visit.css";

const VisitorManagement = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    visitId: `VIS${String(Math.floor(1000 + Math.random() * 9000))}`,
    name: "",
    contact: "",
    location: "",
    gender: "",
    officeDirected: "",
    purpose: "",
    date: new Date().toISOString().split('T')[0], // Default to current date
    timeIn: "",
    timeOut: "",
  });

  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [selectedVisitorId, setSelectedVisitorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch visitors from backend
  const fetchVisitors = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5001/clients/get_visitors");
      const visitorData = response.data.map((visitor, index) => ({
        id: index + 1,
        ...visitor,
      }));
      setVisitors(visitorData);
      setFilteredVisitors(visitorData);
    } catch (error) {
      console.error("Error fetching visitors:", error);
    } finally {
      setIsLoading(false);
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
    if (!formData.name || !formData.contact) {
      alert("Please fill in required fields (Name and Contact)");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/clients/add_visitor", 
        formData, 
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        alert("Visitor saved successfully!");
        fetchVisitors();
        setFormData({
          ...formData,
          visitId: `VIS${String(Math.floor(1000 + Math.random() * 9000))}`,
          name: "",
          contact: "",
          location: "",
          gender: "",
          officeDirected: "",
          purpose: "",
          date: new Date().toISOString().split('T')[0],
          timeIn: "",
          timeOut: "",
        });
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
      const response = await axios.put(
        `http://127.0.0.1:5001/clients/update_visitor/${selectedVisitorId}`, 
        formData, 
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Visitor updated successfully!");
        fetchVisitors();
        setFormData({
          ...formData,
          visitId: `VIS${String(Math.floor(1000 + Math.random() * 9000))}`,
          name: "",
          contact: "",
          location: "",
          gender: "",
          officeDirected: "",
          purpose: "",
          date: new Date().toISOString().split('T')[0],
          timeIn: "",
          timeOut: "",
        });
        setSelectedVisitorId(null);
      }
    } catch (error) {
      console.error("Error updating visitor:", error);
      alert("Failed to update visitor. Please try again.");
    }
  };

  // Delete visitor
  const handleDelete = async () => {
    if (!selectedVisitorId) {
      alert("Please select a visitor to delete.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this visitor record?")) {
      try {
        const response = await axios.delete(
          `http://127.0.0.1:5001/clients/delete_visitor/${selectedVisitorId}`
        );

        if (response.status === 200) {
          alert("Visitor deleted successfully!");
          fetchVisitors();
          setFormData({
            ...formData,
            visitId: `VIS${String(Math.floor(1000 + Math.random() * 9000))}`,
            name: "",
            contact: "",
            location: "",
            gender: "",
            officeDirected: "",
            purpose: "",
            date: new Date().toISOString().split('T')[0],
            timeIn: "",
            timeOut: "",
          });
          setSelectedVisitorId(null);
        }
      } catch (error) {
        console.error("Error deleting visitor:", error);
        alert("Failed to delete visitor. Please try again.");
      }
    }
  };

  // Clear form fields
  const clearForm = () => {
    setFormData({
      visitId: `VIS${String(Math.floor(1000 + Math.random() * 9000))}`,
      name: "",
      contact: "",
      location: "",
      gender: "",
      officeDirected: "",
      purpose: "",
      date: new Date().toISOString().split('T')[0],
      timeIn: "",
      timeOut: "",
    });
    setSelectedVisitorId(null);
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = visitors.filter(
      (visitor) =>
        visitor.visitId.toLowerCase().includes(term) ||
        visitor.name.toLowerCase().includes(term) ||
        visitor.contact.toLowerCase().includes(term) ||
        (visitor.date && visitor.date.toLowerCase().includes(term))
    );
    setFilteredVisitors(filtered);
  };

  // Table columns for DataGrid
  const columns = [
    { field: "id", headerName: "#", width: 60, headerClassName: "grid-header" },
    { field: "visitId", headerName: "VISIT ID", width: 120, headerClassName: "grid-header" },
    { field: "name", headerName: "CLIENT NAME", width: 180, headerClassName: "grid-header" },
    { field: "contact", headerName: "CONTACT", width: 140, headerClassName: "grid-header" },
    { field: "location", headerName: "LOCATION", width: 140, headerClassName: "grid-header" },
    { field: "gender", headerName: "GENDER", width: 100, headerClassName: "grid-header" },
    { field: "officeDirected", headerName: "OFFICE", width: 180, headerClassName: "grid-header" },
    { field: "purpose", headerName: "PURPOSE", width: 220, headerClassName: "grid-header" },
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
      field: "timeIn", 
      headerName: "TIME IN", 
      width: 120, 
      headerClassName: "grid-header",
      renderCell: (params) => (
        <div className="time-cell">
          <FiClock className="time-icon" />
          {params.value}
        </div>
      )
    },
    { 
      field: "timeOut", 
      headerName: "TIME OUT", 
      width: 120, 
      headerClassName: "grid-header",
      renderCell: (params) => (
        <div className="time-cell">
          <FiClock className="time-icon" />
          {params.value || "-"}
        </div>
      )
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="visitor-management-container">
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
            <li className="active">
              <Link to="/user/visit" className="nav-link">
                <FiUserPlus className="nav-icon" />
                <span>Visitors</span>
              </Link>
            </li>
            <li>
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
          <h1>Visitors Form</h1>
          <div className="header-actions">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="card form-card">
            <div className="card-header">
              <h2>Visitors</h2>
              <div className="card-actions">
                <span className={`status-indicator ${selectedVisitorId ? "edit-mode" : "add-mode"}`}>
                  {selectedVisitorId ? "Edit Mode" : "Add Mode"}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Visit ID</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      name="visitId"
                      value={formData.visitId}
                      onChange={handleChange}
                      className="input-field"
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Name of Client <span className="required">*</span></label>
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
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Residential address"
                  />
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
                  <label>Date of Visit</label>
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
                  <label>Office Directed To</label>
                  <input
                    type="text"
                    name="officeDirected"
                    value={formData.officeDirected}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Department/Office"
                  />
                </div>

                <div className="form-group span-2">
                  <label>Purpose of Visit</label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="input-field"
                    rows="3"
                    placeholder="Brief description of visit purpose"
                  />
                </div>

                <div className="form-group">
                  <label>Time In</label>
                  <div className="input-with-icon">
                    <FiClock className="input-icon" />
                    <input
                      type="time"
                      name="timeIn"
                      value={formData.timeIn}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Time Out</label>
                  <div className="input-with-icon">
                    <FiClock className="input-icon" />
                    <input
                      type="time"
                      name="timeOut"
                      value={formData.timeOut}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" onClick={handleSave}>
                  <FiSave className="btn-icon" />
                  Save Visitor
                </button>
                <button className="btn btn-secondary" onClick={handleUpdate} disabled={!selectedVisitorId}>
                  <FiEdit2 className="btn-icon" />
                  Update
                </button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={!selectedVisitorId}>
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
              <h2>Visitor Records</h2>
              <div className="card-actions">
                <span className="record-count">{filteredVisitors.length} records</span>
              </div>
            </div>
            <div className="card-body">
              <div className="data-grid-container">
                <DataGrid
                  rows={filteredVisitors}
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
                    params.id === selectedVisitorId ? "selected-row" : ""
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

export default VisitorManagement;