import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [search, setSearch] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setLoggedInEmail(storedEmail);
    }
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://127.0.0.1:5001/admin/users")
      .then((response) => {
        const usersWithIds = response.data.map((user, index) => ({
          id: user._id || index + 1,
          ...user,
        }));
        setUsers(usersWithIds);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleAddUser = () => {
    axios
      .post("http://127.0.0.1:5001/admin/create-user", { email, password, role })
      .then(() => {
        fetchUsers();
        setOpen(false);
        setEmail("");
        setPassword("");
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  const handleOpenDelete = (id) => {
    setDeleteUserId(id);
    setDeleteOpen(true);
  };

  const handleDeleteUser = () => {
    if (!deleteUserId) return;

    axios
      .delete(`http://127.0.0.1:5001/admin/delete-user/${deleteUserId}`)
      .then(() => {
        fetchUsers();
        setDeleteOpen(false);
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  const handleOpenEdit = (id) => {
    setEditUserId(id);
    setEditOpen(true);
  };

  const handleUpdateUser = () => {
    if (password.trim() === "") return;
    axios
      .put(`http://127.0.0.1:5001/admin/update-user/${editUserId}`, { password })
      .then(() => {
        fetchUsers();
        setEditOpen(false);
        setPassword("");
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            onClick={() => handleOpenEdit(params.row.id)}
            variant="contained"
            color="primary"
            style={{ marginRight: 10 }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleOpenDelete(params.row.id)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Admin Panel</h2>
      {loggedInEmail && <p><strong>Logged in as:</strong> {loggedInEmail}</p>}
      <div style={{ marginBottom: "20px" }}>
        <Button onClick={handleLogout} variant="contained" color="secondary">Logout</Button>
        <TextField
          label="Search by Email"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "300px", margin: "0 10px" }}
        />
        <Button onClick={() => setOpen(true)} variant="contained" color="primary">Add User</Button>
      </div>
      <DataGrid rows={filteredUsers} columns={columns} pageSize={5} style={{ height: 400, width: "80%", margin: "auto" }} />
      
      {/* Add User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField fullWidth margin="dense" type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Receptionist">Receptionist</MenuItem>
              <MenuItem value="Director">Director</MenuItem>
              <MenuItem value="Social Welfare">Social Welfare</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Works">Works</MenuItem>
              <MenuItem value="Physical Planning">Physical Planning</MenuItem>
              <MenuItem value="DCE">DCE</MenuItem>
              <MenuItem value="Environmental Health">Environmental Health</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUser} color="primary">Add</Button>
        </DialogActions>
      </Dialog>





    {/* Edit User Dialog */}
    <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit User Password</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" type="password" label="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this user?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} color="secondary">No</Button>
          <Button onClick={handleDeleteUser} color="error">Yes, Delete</Button>
        </DialogActions>
      </Dialog>  
    </div>
  );
};

export default Home;
