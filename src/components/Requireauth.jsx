import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Wrap pages that need a logged-in user (e.g. /become-vendor).
 * Guests are sent to /login, and after a successful login the Login page
 * sends them back to the page they asked for.
 */
const RequireAuth = ({ children }) => {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectTo: location.pathname + location.search }}
      />
    );
  }
  return children;
};

export default RequireAuth;