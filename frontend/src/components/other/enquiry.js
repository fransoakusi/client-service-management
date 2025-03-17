import React from "react";


const Enquiry = () => {
  return (
    <div className="containere">
      <nav className="navbar">
        <h2>CLIENT FLOW</h2>
        <ul>
          <li><button>DASHBOARD</button></li>
          <li><button>VISITORS</button></li>
          <li><button>COMPLAINT</button></li>
          <li><button>ENQUIRY</button></li>
          <li><button>ENQUIRY RESPONSE</button></li>
          <li><button>REFERRAL</button></li>
          <li><button>REPORT</button></li>
          <li><button>LOGOUT</button></li>
        </ul>
      </nav>
      <h2 className="title">CLIENT ENQUIRY FORM</h2>
      <div className="form-container">
        <div className="form-group">
          <label>ENQUIRY ID</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>AGE BRACKET</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>NAME OF COMPLAINANT</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>MODE OF ENQUIRY</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>GENDER</label>
          <select>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>DISABILITY?</label>
          <select>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div className="form-group">
          <label>CLIENT CONTACT</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>DISABILITY TYPE</label>
          <input type="text" />
        </div>
      </div>
      <div className="form-group full-width">
        <label>BRIEF OF ENQUIRY</label>
        <textarea rows="4"></textarea>
      </div>
      <div className="status-group">
        <label>STATUS</label>
        <div>
          <input type="radio" name="status" /> Pending
          <input type="radio" name="status" /> Responded
        </div>
      </div>
      <div className="button-group">
        <button className="btn">ADD NEW</button>
        <button className="btn">SAVE</button>
        <button className="btn">UPDATE</button>
        <button className="btn">CLEAR</button>
      </div>
      <table className="enquiry-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ENQUIRY ID</th>
            <th>NAME</th>
            <th>AGE</th>
            <th>MODE OF ENQUIRY</th>
            <th>GENDER</th>
            <th>DISABILITY</th>
            <th>DISABILITY TYPE</th>
            <th>CONTACT</th>
            <th>STATUS</th>
            <th>BRIEF OF ENQUIRY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>*</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Enquiry;
