import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
  const { token } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/sign-in" />;
  }

  return element;
};

export default ProtectedRoute;
