import { Navigate } from "react-router-dom";

const AdminRoute = ({ isAuthenticated, children }) => {
  const email = localStorage.getItem("email");
  const isAdmin = isAuthenticated && email === "safestreet456@gmail.com";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AdminRoute;
