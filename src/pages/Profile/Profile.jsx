import { Navigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Mail,
  Phone,
  MapPin,
  LogOut,
  CalendarCheck,
  Briefcase,
  Store,
  ChevronRight,
} from "lucide-react";
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

const memberSince = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
};

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  if (!user) return <Navigate to="/login" replace />;

  const since = memberSince(user.created_at);

  const contacts = [
    { key: "email", Icon: Mail, label: "Email", value: user.email },
    { key: "mobile", Icon: Phone, label: "Mobile", value: user.mobile_number },
    { key: "location", Icon: MapPin, label: "Location", value: user.location },
  ].filter((c) => c.value);

  const links = [
    { to: "/activity", Icon: CalendarCheck, text: "My activity" },
    { to: "/nearby-stall", Icon: Store, text: "Browse nearby shops" },
    { to: "/vendors", Icon: Briefcase, text: "Browse services" },
  ];

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
              <span className="profile-badge">Customer</span>
              {since && <span className="profile-since">Member since {since}</span>}
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
                {links.map(({ to, Icon, text }) => (
                  <Link key={to} to={to}>
                    <span className="profile-link-ico"><Icon size={15} /></span>
                    <span>{text}</span>
                    <ChevronRight size={16} className="profile-link-go" />
                  </Link>
                ))}
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

export default Profile;