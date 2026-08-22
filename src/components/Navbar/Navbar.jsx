import { useState } from "react";
import { Link, NavLink} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  LogIn,
  Home,
  Wrench,
  Activity,
  Store,
  Building2,
} from "lucide-react";
import { logout } from "../../redux/slices/authSlice";
import "./Navbar.css";
import logo from "../../assets/logo.jpg"

const navItems = [
  { label: "Home", to: "/", icon: Home },
  { label: "Service", to: "/vendors", icon: Wrench },
  { label: "Activity", to: "/act", icon: Activity },
  { label: "Nearby Stall", to: "/nearby-stall", icon: Store },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <header className="lk-navbar">
      <div className="lk-navbar-top">
        <div className="lk-navbar-container lk-navbar-top-inner">
          <span className="lk-navbar-location"></span>
          <div className="lk-navbar-top-links">
            <Link to="/become-vendor">Offer Your Services</Link>
            <span className="lk-dot">•</span>
            <a href="#help">Find Trusted Services Nearby</a>
          </div>
        </div>
      </div>

      <div className="lk-navbar-container lk-navbar-main">
        <Link to="/" className="lk-navbar-logo">
          <img
            className="lk-navbar-logo-mark"
            src={logo}
            alt="Lokal"
          />
          <span>
            Lokal
            <small>Find trusted help, nearby</small>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="lk-navbar-nav lk-navbar-nav-desktop">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/become-vendor">Become Vendor</NavLink>

          <div className="lk-navbar-account">
            {user ? (
              <div className="lk-navbar-user">
                <Link to="/profile" className="lk-navbar-user-chip">
                  <img
                    src={
                      user.profile_image ||
                      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&q=80&auto=format&fit=crop"
                    }
                    alt={user.name}
                  />
                  {user.name}
                  <ChevronDown size={14} />
                </Link>
                <div className="lk-navbar-user-menu">
                  <Link to="/profile">
                    <User size={14} /> My Profile
                  </Link>
                  <button onClick={() => dispatch(logout())}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="lk-navbar-login-btn">
                <LogIn size={14} />
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile toggle button */}
        <button
          type="button"
          className="lk-navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {open && <div className="lk-navbar-backdrop" onClick={closeMenu} />}

      {/* Mobile drawer */}
      <nav className={`lk-navbar-drawer ${open ? "is-open" : ""}`}>
        <div className="lk-drawer-header">
          {user ? (
            <Link to="/profile" className="lk-drawer-user" onClick={closeMenu}>
              <img
                src={
                  user.profile_image ||
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&q=80&auto=format&fit=crop"
                }
                alt={user.name}
              />
              <div>
                <strong>{user.name}</strong>
                <span>View Profile</span>
              </div>
            </Link>
          ) : (
            <Link to="/login" className="lk-drawer-login" onClick={closeMenu}>
              <LogIn size={16} />
              Login / Sign up
            </Link>
          )}
          <button
            type="button"
            className="lk-drawer-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="lk-drawer-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={closeMenu}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <NavLink to="/become-vendor" onClick={closeMenu}>
            <Building2 size={18} />
            <span>Become Vendor</span>
          </NavLink>
        </div>

        {user && (
          <button
            type="button"
            className="lk-drawer-logout"
            onClick={() => {
              dispatch(logout());
              closeMenu();
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        )}

        <div className="lk-drawer-footer">
          <span>Find trusted help, nearby</span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;