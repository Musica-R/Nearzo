import { Navigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Mail, Phone, MapPin, LogOut, CalendarCheck, Briefcase, Store } from "lucide-react";
import { logout } from "../../redux/slices/authSlice";
import MyBookings from "../../components/MyBookings/MyBookings";
import "./Profile.css";

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="section profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-banner" />
          <div className="profile-header-body">
            {user.profile_image ? (
              <img src={user.profile_image} alt={user.name} className="profile-avatar" />
            ) : (
              <div className="profile-avatar profile-avatar-fallback">{initialsOf(user.name)}</div>
            )}
            <div className="profile-header-text">
              <h1>{user.name}</h1>
              <p className="text-muted">
                Customer
                {user.created_at ? ` · Member since ${new Date(user.created_at).toLocaleDateString()}` : ""}
              </p>
            </div>
            <button className="btn btn-outline profile-logout" onClick={() => dispatch(logout())}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        <div className="profile-layout">
          <aside className="profile-side">
            <div className="profile-card">
              <h3>Contact Details</h3>
              <ul className="profile-info-list">
                {user.email && (
                  <li>
                    <span className="profile-ico"><Mail size={14} /></span> {user.email}
                  </li>
                )}
                {user.mobile_number && (
                  <li>
                    <span className="profile-ico"><Phone size={14} /></span> {user.mobile_number}
                  </li>
                )}
                {user.location && (
                  <li>
                    <span className="profile-ico"><MapPin size={14} /></span> {user.location}
                  </li>
                )}
              </ul>
            </div>

            <div className="profile-card">
              <h3>Quick Links</h3>
              <div className="profile-links">
                <Link to="/activity">
                  <CalendarCheck size={16} /> My Activity
                </Link>
                <Link to="/nearby-stall">
                  <Store size={16} /> Browse Nearby Shop
                </Link>
                <Link to="/vendors">
                  <Briefcase size={16} /> Browse Services
                </Link>
              </div>
            </div>
          </aside>

          <main className="profile-main">
            <MyBookings userId={user.id} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;