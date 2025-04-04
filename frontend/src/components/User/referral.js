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
  FiTrash2,
  FiHome,
  FiAlertCircle,
  FiHelpCircle,
  FiShare2,
  FiCalendar
} from "react-icons/fi";


const ClientFlow = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    referralId: `REF${String(Math.floor(1000 + Math.random() * 9000))}`,
    complaintId: "",
    name: "",
    contact: "",
    office: "",
    brief: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReferralId, setSelectedReferralId] = useState(null);

  // Fetch referrals from backend
  const fetchReferrals = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5001/referral/get_referral");
      const referralData = response.data.map((referral, index) => ({
        id: index + 1,
        ...referral,
        date: referral.date || new Date().toISOString().split('T')[0]
      }));
      setReferrals(referralData);
      setFilteredReferrals(referralData);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle complaint ID search
  const handleComplaintIdSearch = async () => {
    if (!formData.complaintId) {
      alert("Please enter a Complaint ID");
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/complaints/get_complaint/${formData.complaintId}`
      );
      
      if (response.data) {
        setFormData({
          ...formData,
          name: response.data.name || "",
          contact: response.data.contact || "",
          brief: response.data.brief || ""
        });
      } else {
        alert("No complaint found with that ID");
      }
    } catch (error) {
      console.error("Error fetching complaint:", error);
      alert("Failed to fetch complaint details. Please try again.");
    }
  };

  // Save new referral
  const handleSave = async () => {
    if (!formData.complaintId || !formData.office) {
      alert("Please fill in required fields (Complaint ID and Office Referred To)");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/referral/add_referral", 
        formData, 
        { 
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}` // If using auth
          } 
        }
      );
  
      if (response.status === 201) {
        // Show success notification
        alert("Referral created successfully!");
        
        // Refresh the referrals list
        await fetchReferrals();
        
        // Clear the form and generate new referral ID
        clearForm();
        
        // Optional: Scroll to top or focus on first field
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Error saving referral:", error);
      
      // Enhanced error handling
      if (error.response) {
        // Server responded with error status
        alert(`Error: ${error.response.data.message || "Failed to save referral"}`);
      } else if (error.request) {
        // Request was made but no response
        alert("Network error - please check your connection");
      } else {
        // Other errors
        alert("An unexpected error occurred");
      }
    }
  };

  // Delete referral
  const handleDelete = async () => {
    if (!selectedReferralId) {
      alert("Please select a referral to delete.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this referral record?")) {
      try {
        const response = await axios.delete(
          `http://127.0.0.1:5001/referral/delete_referral/${selectedReferralId}`
        );

        if (response.status === 200) {
          alert("Referral deleted successfully!");
          fetchReferrals();
          clearForm();
        }
      } catch (error) {
        console.error("Error deleting referral:", error);
        alert("Failed to delete referral. Please try again.");
      }
    }
  };

  // Clear form fields
  const clearForm = () => {
    setFormData({
      referralId: `REF${String(Math.floor(1000 + Math.random() * 9000))}`,
      complaintId: "",
      name: "",
      contact: "",
      office: "",
      brief: "",
      date: new Date().toISOString().split('T')[0]
    });
    setSelectedReferralId(null);
  };

  // Handle row selection in DataGrid
  const handleRowSelection = (params) => {
    const selectedReferral = referrals.find((referral) => referral.id === params.id);
    if (selectedReferral) {
      setSelectedReferralId(selectedReferral._id);
      setFormData(selectedReferral);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = referrals.filter(
      (referral) =>
        referral.referralId.toLowerCase().includes(term) ||
        referral.complaintId.toLowerCase().includes(term) ||
        referral.name.toLowerCase().includes(term)
    );
    setFilteredReferrals(filtered);
  };

  // Table columns for DataGrid
  const columns = [
    { field: "id", headerName: "#", width: 60, headerClassName: "grid-header" },
    { field: "referralId", headerName: "REFERRAL ID", width: 130, headerClassName: "grid-header" },
    { field: "complaintId", headerName: "COMPLAINT ID", width: 130, headerClassName: "grid-header" },
    { field: "name", headerName: "NAME", width: 150, headerClassName: "grid-header" },
    { field: "contact", headerName: "CONTACT", width: 150, headerClassName: "grid-header" },
    { field: "office", headerName: "OFFICE REFERRED TO", width: 180, headerClassName: "grid-header" },
    { field: "brief", headerName: "BRIEF OF COMPLAINT", width: 200, headerClassName: "grid-header" },
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
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="referral-management-container">
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
            <li className="active">
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
          <h1>Referral Form</h1>
          <div className="header-actions">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search referrals..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="card form-card">
            <div className="card-header">
              <h2>Referrals</h2>
              <div className="card-actions">
                <span className={`status-indicator ${selectedReferralId ? "edit-mode" : "add-mode"}`}>
                  {selectedReferralId ? "Edit Mode" : "Add Mode"}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Referral ID</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      name="referralId"
                      value={formData.referralId}
                      onChange={handleChange}
                      className="input-field"
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Complaint ID <span className="required">*</span></label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      name="complaintId"
                      value={formData.complaintId}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter complaint ID"
                    />
                    <button 
                      className="search-btn"
                      onClick={handleComplaintIdSearch}
                    >
                      <FiSearch />
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="input-field"
                    disabled
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
                  <label>Office Referred To <span className="required">*</span></label>
                  <select
                    name="office"
                    value={formData.office}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select Office</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Director">Director</option>
                    <option value="Social Welfare">Social Welfare</option>
                    <option value="Finance">Finance</option>
                    <option value="Works">Works</option>
                    <option value="Physical Planning">Physical Planning</option>
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
                    disabled
                    placeholder="Brief will auto-fill from complaint ID"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" onClick={handleSave}>
                  <FiSave className="btn-icon" />
                  Save 
                </button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={!selectedReferralId}>
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
              <h2>Referral Records</h2>
              <div className="card-actions">
                <span className="record-count">{filteredReferrals.length} records</span>
              </div>
            </div>
            <div className="card-body">
              <div className="data-grid-container">
                <DataGrid
                  rows={filteredReferrals}
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
                    params.id === selectedReferralId ? "selected-row" : ""
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

export default ClientFlow;