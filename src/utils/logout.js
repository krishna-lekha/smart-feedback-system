export const logout = (navigate) => {
    localStorage.removeItem('userRole'); // Clear the user role from localStorage
    alert('Logged out successfully!'); // Show alert message
    navigate('/'); // Redirect to the home page or login page
  };