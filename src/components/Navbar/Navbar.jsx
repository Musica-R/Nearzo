import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// Add FiGlobe to your existing react-icons/fi import at the top:
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiArrowRight,
  FiHome,
  FiGrid,
  FiCalendar,
  FiMapPin,
  FiInfo,
  FiPhone,
  FiSearch,
  FiGlobe,
} from "react-icons/fi";

import { HiOutlineOfficeBuilding } from "react-icons/hi";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa6";
import { logout } from "../../redux/slices/authSlice";
import "./Navbar.css";
import logo from "../../assets/logo.jpg";

const navItems = [
  { label: "Home", to: "/", icon: FiHome },
  { label: "Service", to: "/vendors", icon: FiGrid },
  { label: "Activity", to: "/act", icon: FiCalendar },
  { label: "Nearby Stall", to: "/nearby-stall", icon: FiMapPin },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/people/Readers-Menu/61563438916723/?rdid=FyqISX8POUA0Tag7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Ltt6HP6Rr%2F", Icon: FaFacebookF },
  { label: "Instagram", href: "https://www.instagram.com/mpeoples_official/", Icon: FaInstagram },
  { label: "WhatsApp", href: "https://wa.me/919487812715", Icon: FaWhatsapp },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/mpeoples-business-solutions-private-limited/", Icon: FaLinkedinIn },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <header className="lk-navbar">
      {/* ---------- Top bar ---------- */}
      <div className="lk-navbar-top">
        <div className="lk-navbar-container lk-navbar-top-inner">
          <div className="lk-navbar-social">
            <span className="lk-navbar-connected-label">Stay Connected:</span>
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="lk-social-link"
              >
                <Icon />
              </a>
            ))}
          </div>


          <div className="lk-navbar-top-links">
            <Link to="/become-vendor">Offer Your Services</Link>
            <span className="lk-dot">•</span>
            <Link to="/about">About Us</Link>
            <span className="lk-dot">•</span>
            <Link to="/contact">Contact Us</Link>
            <span className="lk-dot">•</span>

            <Link to="/business-portfolio" className="lk-portfolio-btn">
              <FiGlobe size={14} />
              <span className="text">Your Business Portfolio</span>
            </Link>

          </div>


        </div>
      </div>

      {/* ---------- Main bar ---------- */}
      <div className="lk-navbar-container lk-navbar-main">
        <Link to="/" className="lk-navbar-logo">
          <img className="lk-navbar-logo-mark" src={logo} alt="Lokal" />
          <span>
            Lokal
            <small>Find trusted help, nearby</small>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="lk-navbar-nav lk-navbar-nav-desktop">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="lk-nav-item-inner">
                  <Icon size={16} />
                  {item.label}
                  {item.label === "Service" && <FiChevronDown size={14} />}
                </span>
              </NavLink>
            );
          })}
          <NavLink to="/become-vendor">
            <span className="lk-nav-item-inner">
              <HiOutlineOfficeBuilding size={16} />
              Become Vendor
            </span>
          </NavLink>

          {/* <button
            type="button"
            className="lk-navbar-search-btn"
            aria-label="Search"
          >
            <FiSearch size={17} />
          </button> */}

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
                  <FiChevronDown size={14} />
                </Link>
                <div className="lk-navbar-user-menu">
                  <Link to="/profile">
                    <FiUser size={14} /> My Profile
                  </Link>
                  <button onClick={() => dispatch(logout())}>
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="lk-navbar-login-btn">
                <FiArrowRight size={16} />
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
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
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
              <FiArrowRight size={16} />
              Login / Sign up
            </Link>
          )}
          <button
            type="button"
            className="lk-drawer-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <FiX size={20} />
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
            <HiOutlineOfficeBuilding size={18} />
            <span>Become Vendor</span>
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            <FiInfo size={18} />
            <span>About Us</span>
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            <FiPhone size={18} />
            <span>Contact Us</span>
          </NavLink>
          <NavLink to="/business-portfolio" onClick={closeMenu}>
            <FiGlobe size={18} />
            <span>Your Business Portfolio</span>
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
            <FiLogOut size={16} /> Logout
          </button>
        )}

        <div className="lk-drawer-social">
          {socialLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="lk-social-link"
            >
              <Icon />
            </a>
          ))}
        </div>

        <div className="lk-drawer-footer">
          <span>Find trusted help, nearby</span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;