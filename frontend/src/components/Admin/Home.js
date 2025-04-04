import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  useMediaQuery,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  CssBaseline,
  createTheme,
  ThemeProvider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Logout, Search, Add, Edit, Delete, Brightness4, Brightness7 } from "@mui/icons-material";

const Home = () => {
  // Theme state and configuration
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: {
                  main: '#1976d2',
                  dark: '#1565c0',
                  light: '#42a5f5',
                },
                secondary: {
                  main: '#9c27b0',
                },
                background: {
                  default: '#f5f7fa',
                  paper: '#ffffff',
                },
              }
            : {
                primary: {
                  main: '#90caf9',
                  dark: '#42a5f5',
                  light: '#e3f2fd',
                },
                secondary: {
                  main: '#ce93d8',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
              }),
        },
      }),
    [mode],
  );

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Toggle between dark and light mode
  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  }, []);

  // Application state
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
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const navigate = useNavigate();

  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:5001/admin/users")
      .then((response) => {
        const usersWithIds = response.data.map((user, index) => ({
          id: user._id || index + 1,
          ...user,
        }));
        setUsers(usersWithIds);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
        showSnackbar("Failed to fetch users", "error");
      });
  }, [showSnackbar]);

  useEffect(() => {
    fetchUsers();
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setLoggedInEmail(storedEmail);
    }
  }, [fetchUsers]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  }, [navigate]);

  const handleAddUser = useCallback(() => {
    if (!email || !password) {
      showSnackbar("Please fill all fields", "error");
      return;
    }

    axios
      .post("http://127.0.0.1:5001/admin/create-user", { email, password, role })
      .then(() => {
        fetchUsers();
        setOpen(false);
        setEmail("");
        setPassword("");
        showSnackbar("User added successfully", "success");
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        showSnackbar("Failed to add user", "error");
      });
  }, [email, password, role, fetchUsers, showSnackbar]);

  const handleOpenDelete = useCallback((id) => {
    setDeleteUserId(id);
    setDeleteOpen(true);
  }, []);

  const handleDeleteUser = useCallback(() => {
    if (!deleteUserId) return;

    axios
      .delete(`http://127.0.0.1:5001/admin/delete-user/${deleteUserId}`)
      .then(() => {
        fetchUsers();
        setDeleteOpen(false);
        showSnackbar("User deleted successfully", "success");
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        showSnackbar("Failed to delete user", "error");
      });
  }, [deleteUserId, fetchUsers, showSnackbar]);

  const handleOpenEdit = useCallback((id) => {
    setEditUserId(id);
    setEditOpen(true);
  }, []);

  const handleUpdateUser = useCallback(() => {
    if (password.trim() === "") {
      showSnackbar("Password cannot be empty", "error");
      return;
    }
    
    axios
      .put(`http://127.0.0.1:5001/admin/update-user/${editUserId}`, { password })
      .then(() => {
        fetchUsers();
        setEditOpen(false);
        setPassword("");
        showSnackbar("Password updated successfully", "success");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        showSnackbar("Failed to update password", "error");
      });
  }, [password, editUserId, fetchUsers, showSnackbar]);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "role", headerName: "Role", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={() => handleOpenEdit(params.row.id)}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Edit />}
            sx={{ textTransform: "none" }}
          >
            {!isMobile && "Edit"}
          </Button>
          <Button
            onClick={() => handleOpenDelete(params.row.id)}
            variant="contained"
            color="error"
            size="small"
            startIcon={<Delete />}
            sx={{ textTransform: "none" }}
          >
            {!isMobile && "Delete"}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin Panel
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              {loggedInEmail && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                    {loggedInEmail.charAt(0).toUpperCase()}
                  </Avatar>
                  {!isMobile && (
                    <Typography variant="body2" sx={{ color: "inherit" }}>
                      {loggedInEmail}
                    </Typography>
                  )}
                </Box>
              )}
              <Button
                onClick={handleLogout}
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<Logout />}
                sx={{ textTransform: "none" }}
              >
                {!isMobile && "Logout"}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2, alignItems: "center" }}>
              <TextField
                label="Search by Email"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                fullWidth={isMobile}
                InputProps={{
                  startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
                }}
              />
              <Button
                onClick={() => setOpen(true)}
                variant="contained"
                color="primary"
                startIcon={<Add />}
                sx={{ textTransform: "none", minWidth: isMobile ? "100%" : "auto" }}
              >
                Add User
              </Button>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ borderRadius: 2, height: 500 }}>
            {loading ? (
              <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={filteredUsers}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: theme.palette.mode === 'dark' ? 
                      theme.palette.primary.dark : theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  },
                }}
              />
            )}
          </Paper>
        </Box>

        {/* Add User Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ 
            bgcolor: theme.palette.primary.main, 
            color: theme.palette.primary.contrastText 
          }}>
            Add New User
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              size="small"
            />
            <FormControl fullWidth margin="normal" size="small">
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
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)} variant="outlined" sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} color="primary" variant="contained" sx={{ textTransform: "none" }}>
              Add User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white" }}>
            Edit User Password
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              size="small"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditOpen(false)} variant="outlined" sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} color="primary" variant="contained" sx={{ textTransform: "none" }}>
              Update Password
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ bgcolor: theme.palette.error.light, color: "white" }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography>Are you sure you want to delete this user? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteOpen(false)} variant="outlined" sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button onClick={handleDeleteUser} color="error" variant="contained" sx={{ textTransform: "none" }}>
              Delete User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Home;