import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Menu, 
  MenuItem, 
  IconButton,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  Avatar,
  Badge,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Paper,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { 
  FaUser, 
  FaClipboardList, 
  FaPhone, 
  FaUsers, 
  FaBell,
  FaSignOutAlt,
  FaChartLine,
  FaChartPie,
  FaCalendarAlt
} from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styled from "@emotion/styled";

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 24px;
`;

const StatCard = styled(Card)`
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const StatCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  text-align: center;
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: ${({ color }) => color};
`;

const AnalyticsCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Footer = styled.footer`
  padding: 16px;
  text-align: center;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: white;
`;

const TrendIndicator = styled.span`
  color: ${({ trend }) => trend > 0 ? '#4CAF50' : trend < 0 ? '#F44336' : '#9E9E9E'};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [time, setTime] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [stats, setStats] = useState([
    { title: "Total Visitors", value: 0, icon: <FaUser />, color: theme.palette.error.main, loading: true, trend: 0 },
    { title: "Total Complaints", value: 0, icon: <FaClipboardList />, color: theme.palette.grey[600], loading: true, trend: 0 },
    { title: "Total Enquiries", value: 0, icon: <FaPhone />, color: theme.palette.warning.main, loading: true, trend: 0 },
    { title: "Total Referrals", value: 0, icon: <FaUsers />, color: theme.palette.secondary.main, loading: true, trend: 0 },
  ]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: <MenuIcon /> },
    { name: "Visitors", path: "/user/visit", icon: <FaUser /> },
    { name: "Complaint", path: "/user/complaints", icon: <FaClipboardList /> },
    { name: "Enquiry", path: "/user/enquiry", icon: <FaPhone /> },
    { name: "Enquiry Response", path: "/user/enquiryresponse", icon: <FaPhone /> },
    { name: "Referral", path: "/user/referral", icon: <FaUsers /> },
    { name: "Report", path: "/user/report", icon: <FaClipboardList /> },
  ];

  // Sample data for charts (replace with your actual data)
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const fetchCounts = useCallback(async () => {
    try {
      setLoading(true);
      setStats(prevStats => prevStats.map(stat => ({ ...stat, loading: true })));
      
      // Simulate fetching data (replace with your actual API calls)
      const visitorsResponse = await axios.get("http://127.0.0.1:5001/clients/get_visitors");
      const complaintsResponse = await axios.get("http://127.0.0.1:5001/complaints/get_complaints");
      const enquiriesResponse = await axios.get("http://127.0.0.1:5001/enquiry/get_enquiry");
      const referralsResponse = await axios.get("http://127.0.0.1:5001/referral/get_referral");

      const visitorCount = visitorsResponse.data.length;
      const complaintCount = complaintsResponse.data.length;
      const enquiryCount = enquiriesResponse.data.length;
      const referralCount = referralsResponse.data.length;

      // Generate sample monthly data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const monthly = months.map((month, i) => ({
        name: month,
        visitors: Math.floor(Math.random() * 100) + 10,
        complaints: Math.floor(Math.random() * 30) + 5,
        enquiries: Math.floor(Math.random() * 50) + 15,
        referrals: Math.floor(Math.random() * 20) + 3
      }));

      // Generate sample category data
      const categories = [
        { name: 'General', value: Math.floor(Math.random() * 50) + 10 },
        { name: 'Technical', value: Math.floor(Math.random() * 30) + 5 },
        { name: 'Billing', value: Math.floor(Math.random() * 20) + 3 },
        { name: 'Service', value: Math.floor(Math.random() * 40) + 8 },
        { name: 'Other', value: Math.floor(Math.random() * 15) + 2 }
      ];

      setStats([
        { title: "Total Visitors", value: visitorCount, icon: <FaUser />, color: theme.palette.error.main, loading: false, trend: 5.2 },
        { title: "Total Complaints", value: complaintCount, icon: <FaClipboardList />, color: theme.palette.grey[600], loading: false, trend: -2.1 },
        { title: "Total Enquiries", value: enquiryCount, icon: <FaPhone />, color: theme.palette.warning.main, loading: false, trend: 8.7 },
        { title: "Total Referrals", value: referralCount, icon: <FaUsers />, color: theme.palette.secondary.main, loading: false, trend: 3.4 },
      ]);

      setMonthlyData(monthly);
      setCategoryData(categories);
      setLoading(false);
      
    } catch (error) {
      console.error("Error fetching counts:", error);
      setStats(prevStats => prevStats.map(stat => ({
        ...stat,
        loading: false,
        value: stat.value
      })));
      setLoading(false);
    }
  }, [theme]);

  useEffect(() => {
    fetchCounts();
    const timer = setInterval(() => setTime(new Date()), 1000);
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setLoggedInEmail(storedEmail);
    }
    return () => clearInterval(timer);
  }, [fetchCounts]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const renderTrendIndicator = (trend) => {
    const arrow = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
    return (
      <TrendIndicator trend={trend}>
        {arrow} {Math.abs(trend)}%
      </TrendIndicator>
    );
  };

  return (
    <DashboardContainer theme={theme}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CLIENT FLOW - NORTH TONGU
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2">
                {time.toDateString()}
              </Typography>
              <Typography variant="body2">
                {time.toLocaleTimeString()}
              </Typography>
            </Box>
            
            <IconButton color="inherit">
              <Badge badgeContent={0} color="error">
                <FaBell />
              </Badge>
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                {loggedInEmail ? loggedInEmail.charAt(0).toUpperCase() : 'G'}
              </Avatar>
              {!isMobile && (
                <Typography variant="body2">
                  {loggedInEmail || "Guest"}
                </Typography>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            width: 250,
            padding: '8px 0',
          },
        }}
      >
        {navItems.map((item) => (
          <MenuItem 
            key={item.name} 
            onClick={() => handleNavigation(item.path)}
            sx={{ gap: 2 }}
          >
            {item.icon}
            {item.name}
          </MenuItem>
        ))}
        <MenuItem onClick={handleLogout} sx={{ gap: 2 }}>
          <FaSignOutAlt />
          Logout
        </MenuItem>
      </Menu>

      <ContentContainer>
        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
          Dashboard Overview
        </Typography>
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard>
                <StatCardContent>
                  <IconWrapper color={stat.color}>
                    {stat.icon}
                  </IconWrapper>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  {stat.loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <>
                      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                        {stat.value}
                      </Typography>
                      {renderTrendIndicator(stat.trend)}
                    </>
                  )}
                </StatCardContent>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        {/* Analytics Section */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3, mt: 4 }}>
          Analytics Overview
        </Typography>

        <Grid container spacing={3}>
          {/* Monthly Trends Chart */}
          <Grid item xs={12} md={8}>
            <AnalyticsCard>
              <Box display="flex" alignItems="center" mb={2}>
                <FaChartLine style={{ marginRight: 8, color: theme.palette.primary.main }} />
                <Typography variant="h6">Monthly Trends</Typography>
              </Box>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visitors" fill="#F44336" name="Visitors" />
                    <Bar dataKey="complaints" fill="#9E9E9E" name="Complaints" />
                    <Bar dataKey="enquiries" fill="#FF9800" name="Enquiries" />
                    <Bar dataKey="referrals" fill="#4CAF50" name="Referrals" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </AnalyticsCard>
          </Grid>

          {/* Categories Pie Chart */}
          <Grid item xs={12} md={4}>
            <AnalyticsCard>
              <Box display="flex" alignItems="center" mb={2}>
                <FaChartPie style={{ marginRight: 8, color: theme.palette.primary.main }} />
                <Typography variant="h6">Complaint Categories</Typography>
              </Box>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </AnalyticsCard>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <AnalyticsCard>
              <Box display="flex" alignItems="center" mb={2}>
                <FaCalendarAlt style={{ marginRight: 8, color: theme.palette.primary.main }} />
                <Typography variant="h6">Recent Activity</Typography>
              </Box>
              <Box>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Box key={item} sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
                    </Typography>
                    <Typography variant="body1">
                      {['New visitor registered', 'Complaint resolved', 'Enquiry responded', 'Referral completed'][item % 4]}
                    </Typography>
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                ))}
              </Box>
            </AnalyticsCard>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <AnalyticsCard>
              <Box display="flex" alignItems="center" mb={2}>
                <FaClipboardList style={{ marginRight: 8, color: theme.palette.primary.main }} />
                <Typography variant="h6">Performance Metrics</Typography>
              </Box>
              <Grid container spacing={2}>
                {[
                  { title: "Response Time", value: "2.4h", trend: -0.5 },
                  { title: "Resolution Rate", value: "92%", trend: 1.2 },
                  { title: "Satisfaction", value: "4.5/5", trend: 0.3 },
                  { title: "New Clients", value: "24", trend: 3.8 }
                ].map((metric, index) => (
                  <Grid item xs={6} key={index}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        {metric.title}
                      </Typography>
                      <Box display="flex" alignItems="baseline" gap={1}>
                        <Typography variant="h6">{metric.value}</Typography>
                        {renderTrendIndicator(metric.trend)}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AnalyticsCard>
          </Grid>
        </Grid>
      </ContentContainer>

      <Footer theme={theme}>
        <Typography variant="body2">
          Designed by: <strong>KABTECH</strong> | 0545041128
        </Typography>
      </Footer>
    </DashboardContainer>
  );
};

export default Dashboard;