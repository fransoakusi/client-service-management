export const logout = (navigate) => {
    // Clear any stored data (like tokens) for user session
    localStorage.removeItem("authToken"); // Assuming you store a token
    localStorage.removeItem("userRole");
  
    // Navigate back to the login page
    navigate("/");
  };
  