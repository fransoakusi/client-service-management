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
  FiHome,
  FiAlertCircle,
  FiHelpCircle,
  FiShare2,
  FiCalendar
} from "react-icons/fi";
import "./enquiry.css";

const Enquiry = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    enquiryId: `ENQ${String(Math.floor(1000 + Math.random() * 9000))}`,
    name: "",
    age: "",
    mode: "",
    gender: "",
    disability: "",
    contact: "",
    status: "Pending",
    brief: "",
    date: new Date().toISOString().split('T')[0], // Added date field
  });

  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch enquiries from backend
  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5001/enquiry/get_enquiry");
      const enquiryData = response.data.map((enquiry, index) => ({
        id: index + 1,
        ...enquiry,
        date: enquiry.date || new Date().toISOString().split('T')[0] // Handle missing dates
      }));
      setEnquiries(enquiryData);
      setFilteredEnquiries(enquiryData);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save new enquiry
  const handleSave = async () => {
    if (!formData.name || !formData.contact) {
      alert("Please fill in required fields (Name and Contact)");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/enquiry/add_enquiry", 
        {
          ...formData,
          date: formData.date || new Date().toISOString().split('T')[0] // Ensure date is always set
        }, 
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        alert("Enquiry saved successfully!");
        fetchEnquiries();
        clearForm();
      }
    } catch (error) {
      console.error("Error saving enquiry:", error);
      alert("Failed to save enquiry. Please try again.");
    }
  };

  // Handle row selection in DataGrid
  const handleRowSelection = (params) => {
    const selectedEnquiry = enquiries.find((enquiry) => enquiry.id === params.id);
    if (selectedEnquiry) {
      setSelectedEnquiryId(selectedEnquiry._id);
      setFormData(selectedEnquiry);
    }
  };

  // Update enquiry information
  const handleUpdate = async () => {
    if (!selectedEnquiryId) {
      alert("Please select an enquiry to update.");
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:5001/enquiry/update_enquiry/${selectedEnquiryId}`, 
        {
          ...formData,
          date: formData.date || new Date().toISOString().split('T')[0] // Ensure date is always set
        }, 
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Enquiry updated successfully!");
        fetchEnquiries();
        clearForm();
      }
    } catch (error) {
      console.error("Error updating enquiry:", error);
      alert("Failed to update enquiry. Please try again.");
    }
  };

  // Delete enquiry
  const handleDelete = async () => {
    if (!selectedEnquiryId) {
      alert("Please select an enquiry to delete.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this enquiry record?")) {
      try {
        const response = await axios.delete(
          `http://127.0.0.1:5001/enquiry/delete_enquiry/${selectedEnquiryId}`
        );

        if (response.status === 200) {
          alert("Enquiry deleted successfully!");
          fetchEnquiries();
          clearForm();
        }
      } catch (error) {
        console.error("Error deleting enquiry:", error);
        alert("Failed to delete enquiry. Please try again.");
      }
    }
  };

  // Clear form fields
  const clearForm = () => {
    setFormData({
      enquiryId: `ENQ${String(Math.floor(1000 + Math.random() * 9000))}`,
      name: "",
      age: "",
      mode: "",
      gender: "",
      disability: "",
      contact: "",
      status: "Pending",
      brief: "",
      date: new Date().toISOString().split('T')[0] // Reset date to current date
    });
    setSelectedEnquiryId(null);
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = enquiries.filter(
      (enquiry) =>
        enquiry.enquiryId.toLowerCase().includes(term) ||
        enquiry.name.toLowerCase().includes(term) ||
        enquiry.contact.toLowerCase().includes(term) ||
        enquiry.status.toLowerCase().includes(term) ||
        (enquiry.date && enquiry.date.toLowerCase().includes(term)) // Include date in search
    );
    setFilteredEnquiries(filtered);
  };

  // Table columns for DataGrid
  const columns = [
    { field: "id", headerName: "#", width: 60, headerClassName: "grid-header" },
    { field: "enquiryId", headerName: "ENQUIRY ID", width: 130, headerClassName: "grid-header" },
    { field: "name", headerName: "NAME", width: 150, headerClassName: "grid-header" },
    { field: "age", headerName: "AGE", width: 100, headerClassName: "grid-header" },
    { field: "mode", headerName: "MODE OF ENQUIRY", width: 180, headerClassName: "grid-header" },
    { field: "gender", headerName: "GENDER", width: 100, headerClassName: "grid-header" },
    { field: "disability", headerName: "DISABILITY", width: 120, headerClassName: "grid-header" },
    { field: "contact", headerName: "CONTACT", width: 150, headerClassName: "grid-header" },
    { 
      field: "status", 
      headerName: "STATUS", 
      width: 120, 
      headerClassName: "grid-header",
      renderCell: (params) => (
        <div className={`status-cell ${params.value.toLowerCase()}`}>
          {params.value}
        </div>
      )
    },
    { 
      field: "date", 
      headerName: "DATE", 
      width: 120, 
      headerClassName: "grid-header",
      renderCell: (params) => (
        <div className="date-cell">
          <FiCalendar className="date-icon" />
          {params.value}
        </div>
      )
    },
    { field: "brief", headerName: "BRIEF OF ENQUIRY", width: 200, headerClassName: "grid-header" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="enquiry-management-container">
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
            <li>
              <Link to="/user/complaints" className="nav-link">
                <FiAlertCircle className="nav-icon" />
                <span>Complaints</span>
              </Link>
            </li>
            <li className="active">
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
          <h1>Enquiry Response Form</h1>
          <div className="header-actions">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search enquiries..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="card form-card">
            <div className="card-header">
              <h2>Enquiry Response</h2>
              <div className="card-actions">
                <span className={`status-indicator ${selectedEnquiryId ? "edit-mode" : "add-mode"}`}>
                  {selectedEnquiryId ? "Edit Mode" : "Add Mode"}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Enquiry ID</label>
                  <input
                    type="text"
                    name="enquiryId"
                    value={formData.enquiryId}
                    onChange={handleChange}
                    className="input-field"
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Name of Enquirer <span className="required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter full name"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Date of Enquiry</label>
                  <div className="input-with-icon">
                    <FiCalendar className="input-icon" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="input-field"
                      disabled
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Age Bracket</label>
                  <select
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="input-field"
                    disabled
                  >
                    <option value="">Select Age</option>
                    <option value="18 to 35">18 to 35</option>
                    <option value="36 to 60">36 to 60</option>
                    <option value="60 to 80">60 to 80</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Mode of Enquiry</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="input-field"
                    disabled
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
                    disabled
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
                    disabled
                  >
                    <option value="">Select Option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Enquirer Contact <span className="required">*</span></label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Phone number"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value="Pending"
                        checked={formData.status === "Pending"}
                        onChange={handleChange}
                      />
                      Pending
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value="Responded"
                        checked={formData.status === "Responded"}
                        onChange={handleChange}
                      />
                      Responded
                    </label>
                  </div>
                </div>

                <div className="form-group span-2">
                  <label>Brief of Enquiry</label>
                  <textarea
                    name="brief"
                    value={formData.brief}
                    onChange={handleChange}
                    className="input-field"
                    rows="3"
                    placeholder="Brief description of the enquiry"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" onClick={handleSave}>
                  <FiSave className="btn-icon" />
                  Save Enquiry
                </button>
                <button className="btn btn-secondary" onClick={handleUpdate} disabled={!selectedEnquiryId}>
                  <FiEdit2 className="btn-icon" />
                  Update
                </button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={!selectedEnquiryId}>
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
              <h2>Enquiry Records</h2>
              <div className="card-actions">
                <span className="record-count">{filteredEnquiries.length} records</span>
              </div>
            </div>
            <div className="card-body">
              <div className="data-grid-container">
                <DataGrid
                  rows={filteredEnquiries}
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
                    params.id === selectedEnquiryId ? "selected-row" : ""
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

export default Enquiry;