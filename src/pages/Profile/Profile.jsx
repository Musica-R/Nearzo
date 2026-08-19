import { Navigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Mail, Phone, MapPin, LogOut, CalendarCheck, Briefcase, Store } from "lucide-react";
import { logout } from "../../redux/slices/authSlice";
import "./Profile.css";

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="section profile-page">
      <div className="container">
        <div className="profile-header">
          <img
            src={
              user.profile_image ||
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80&auto=format&fit=crop"
            }
            alt={user.name}
          />
          <div>
            <h1>{user.name}</h1>
            <p className="text-muted">Member since {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          <button className="btn btn-outline profile-logout" onClick={() => dispatch(logout())}>
            <LogOut size={15} /> Logout
          </button>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <h3>Contact Details</h3>
            <ul className="profile-info-list">
              <li><Mail size={15} /> {user.email}</li>
              <li><Phone size={15} /> {user.mobile_number}</li>
              <li><MapPin size={15} /> {user.location}</li>
            </ul>
          </div>

          <div className="profile-card">
            <h3>Quick Links</h3>
            <div className="profile-links">
              <Link to="/activity">
                <CalendarCheck size={16} /> My Activity
              </Link>
              <Link to="/become-vendor">
                <Store size={16} /> Become a Vendor
              </Link>
              <Link to="/service">
                <Briefcase size={16} /> Browse Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
