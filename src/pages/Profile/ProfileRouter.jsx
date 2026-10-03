import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Phone, MapPin, LogOut, Briefcase, Store, ChevronRight } from "lucide-react";
import { getUserRole, getUserType } from "../../utils/role";
import { logout } from "../../redux/slices/authSlice";
import MyBookings from "../../components/MyBookings/MyBookings";
// Your existing customer profile page
import UserProfile from "./Profile";
import "./Profile.css";

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// "Home Services|Activity" -> ["Home Services", "Activity"]
const splitTypes = (type) =>
  String(type || "")
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);

const VendorProfile = ({ user }) => {
  const dispatch = useDispatch();
  const type = getUserType(user);
  const typeList = splitTypes(type);

  const contacts = [
    { key: "email", Icon: Mail, label: "Email", value: user.email },
    { key: "mobile", Icon: Phone, label: "Mobile", value: user.mobile_number },
    { key: "location", Icon: MapPin, label: "Location", value: user.location },
  ].filter((c) => c.value);

  return (
    <div className="section profile-page">
      <div className="container">
        {/* ---------- Header ---------- */}
        <header className="profile-header">
          {user.profile_image ? (
            <img src={user.profile_image} alt={user.name} className="profile-avatar" />
          ) : (
            <div className="profile-avatar profile-avatar-fallback" aria-hidden="true">
              {initialsOf(user.name)}
            </div>
          )}

          <div className="profile-header-text">
            <h1>{user.name}</h1>
            <div className="profile-meta">
              <span className="profile-badge">Vendor</span>
              {typeList.map((t) => (
                <span key={t} className="profile-tag">{t}</span>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline profile-logout"
            onClick={() => dispatch(logout())}
          >
            <LogOut size={14} /> Logout
          </button>
        </header>

        {/* ---------- Body ---------- */}
        <div className="profile-layout">
          <aside className="profile-side">
            <section className="profile-card">
              <h3>Contact details</h3>
              {contacts.length > 0 ? (
                <ul className="profile-info-list">
                  {contacts.map(({ key, Icon, label, value }) => (
                    <li key={key}>
                      <span className="profile-ico"><Icon size={14} /></span>
                      <span className="profile-info-text">
                        <small>{label}</small>
                        <span>{value}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="profile-empty">No contact details added yet.</p>
              )}
            </section>

            <section className="profile-card">
              <h3>Quick links</h3>
              <div className="profile-links">
                <Link to={type ? `/become-vendor?type=${encodeURIComponent(type)}` : "/become-vendor"}>
                  <span className="profile-link-ico"><Store size={15} /></span>
                  <span>Manage my vendor listing</span>
                  <ChevronRight size={16} className="profile-link-go" />
                </Link>
                <Link to="/service">
                  <span className="profile-link-ico"><Briefcase size={15} /></span>
                  <span>Browse services</span>
                  <ChevronRight size={16} className="profile-link-go" />
                </Link>
              </div>
            </section>
          </aside>

          <main className="profile-main">
            <MyBookings userId={user.id} />
          </main>
        </div>
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