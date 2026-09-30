import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserRole, getUserType } from "../../utils/role";
// Your existing customer profile page — adjust the path/name if different
import UserProfile from "./Profile";

const VendorProfile = ({ user }) => {
  const type = getUserType(user);
  return (
    <div className="section">
      <div className="container">
        <h1>{user.name}</h1>
        <p className="text-muted">Vendor{type ? ` · ${type}` : ""}</p>
        <ul>
          <li>Email: {user.email}</li>
          {user.mobile_number && <li>Mobile: {user.mobile_number}</li>}
          {user.location && <li>Location: {user.location}</li>}
        </ul>
        <Link
          className="btn btn-primary"
          to={type ? `/become-vendor?type=${encodeURIComponent(type)}` : "/become-vendor"}
        >
          Manage my vendor listing
        </Link>
      </div>
    </div>
  );
};

/** Point your /profile route at this component. */
const ProfileRouter = () => {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  return getUserRole(user) === "vendor" ? <VendorProfile user={user} /> : <UserProfile />;
};

export default ProfileRouter;