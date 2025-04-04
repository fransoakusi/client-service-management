import React from 'react';


const ClientFlow = () => {
  return (
    <div className="client-flow-container">
      {/* Header */}
      <header className="header">
        <h1>CLIENT FLOW</h1>
        <h2>NORTH TONGU CLIENT SERVICE MANAGEMENT SYSTEM</h2>
      </header>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-buttons">
          <button className="nav-btn">DASHBOARD</button>
          <button className="nav-btn">VISITORS</button>
          <button className="nav-btn">COMPLAINT</button>
          <button className="nav-btn">ENQUIRY</button>
          <button className="nav-btn">RESPONSE</button>
          <button className="nav-btn active">REFERRAL</button>
          <button className="nav-btn">REPORT</button>
          <button className="nav-btn">LOGOUT</button>
        </div>
        <div className="datetime">
          <span>DATE: 24-DEC-2024</span>
          <span>TIME: 09:14:49</span>
        </div>
      </nav>

      {/* Form Section */}
      <div className="form-container">
        <div className="form-left">
          <div className="form-group">
            <label>REFERRAL ID</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>COMPLAINT ID</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>NAME</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>CONTACT</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>COMPLAINT REFERRED TO</label>
            <select>
              <option value="">Select</option>
            </select>
          </div>
        </div>
        <div className="form-right">
          <label>BRIEF OF COMPLAINT</label>
          <textarea rows="10"></textarea>
          <button className="search-btn">SEARCH</button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-btn add-new">ADD NEW</button>
        <button className="action-btn save">SAVE</button>
        <button className="action-btn update">UPDATE</button>
        <button className="action-btn clear">CLEAR</button>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>REFERRAL ID</th>
              <th>COMPLAINT ID</th>
              <th>NAME</th>
              <th>CONTACT</th>
              <th>OFFICE REFERRED TO</th>
              <th>BRIEF OF COMPLAINT</th>
            </tr>
          </thead>
          <tbody>
            {/* Table rows can be dynamically populated */}
            <tr>
              <td colSpan="7">No data available</td>
            </tr>
          </tbody>
        </table>
        <button className="search-btn table-search">SEARCH</button>
      </div>
    </div>
  );
};

export default ClientFlow;