import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt_decode from "jsonwebtoken";

const ProtectedRoute = ({ element }) => {
  const { token } = useSelector((state) => state.auth);

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwt_decode.decode(token);
      if (decoded.exp * 1000 < Date.now()) {
        return true;
      }
      return false;
    } catch (error) {
      return true; // If there's any error, treat the token as expired
    }
  };

  // Check if the user has a token and if it's expired
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/sign-in" />;
  }

  return element;
};

export default ProtectedRoute;
