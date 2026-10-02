import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Heart, ChevronRight, Send, Grid2X2, Users, Home, GraduationCap, Dumbbell, Store, UserPlus, FileText, HelpCircle, ShieldCheck } from "lucide-react";
import "./Footer.css";


const exploreLinks = [
  { label: "Home Services", to: "/service", icon: Home },
  { label: "Learning & Training", to: "/service", icon: GraduationCap },
  { label: "Sports & Fitness", to: "/service", icon: Dumbbell },
  { label: "Nearby Shops", to: "/nearby-stall", icon: Store },
];

const companyLinks = [
  // { label: "Become a Vendor", to: "/become-vendor", icon: UserPlus },
  { label: "My Activity", to: "/activity", icon: FileText },
  // { label: "Help & Support", href: "#help", icon: HelpCircle },
  { label: "Terms & Conditions", to: "/terms", icon: ShieldCheck },
  { label: "Privacy Policy", to: "/privacy", icon: ShieldCheck },
];

const Footer = () => (
  <footer className="lf-footer">
    <div className="lf-glow" aria-hidden="true" />
    <div className="lf-dots" aria-hidden="true" />

    <div className="lf-wrap">
      <div className="lf-grid">
        <div className="lf-brand">
          <div className="lf-brand-mark">
            <span className="lf-brand-mark-letter">T</span>
            <span className="lf-brand-mark-name">Thozhaa</span>
          </div>
          <p className="lf-brand-copy">
            Discover trusted service workers and local stalls near you — book,
            connect and get it done, all in one place.
          </p>
          {/* <div className="lf-social">
            <a href="#facebook" aria-label="Facebook"><FacebookGlyph /></a>
            <a href="#instagram" aria-label="Instagram"><InstagramGlyph /></a>
            <a href="#youtube" aria-label="Youtube"><YoutubeGlyph /></a>
            <a href="#twitter" aria-label="Twitter"><TwitterGlyph /></a>
          </div> */}
        </div>

        <div className="lf-col">
          <div className="lf-col-heading">
            <span className="lf-col-icon"><Grid2X2 size={18} /></span>
            <h4>Explore</h4>
          </div>
          <ul className="lf-links">
            {exploreLinks.map(({ label, to, icon: Icon }) => (
              <li key={label}>
                <Link to={to} className="lf-link-row">
                  <span className="lf-link-left">
                    <Icon size={16} />
                    <span>{label}</span>
                  </span>
                  <ChevronRight size={16} className="lf-chevron" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lf-col">
          <div className="lf-col-heading">
            <span className="lf-col-icon"><Users size={18} /></span>
            <h4>Company</h4>
          </div>
          <ul className="lf-links">
            {companyLinks.map(({ label, to, href, icon: Icon }) => {
              const inner = (
                <>
                  <span className="lf-link-left">
                    <Icon size={16} />
                    <span>{label}</span>
                  </span>
                  <ChevronRight size={16} className="lf-chevron" />
                </>
              );
              return (
                <li key={label}>
                  {to ? (
                    <Link to={to} className="lf-link-row">{inner}</Link>
                  ) : (
                    <a href={href} className="lf-link-row">{inner}</a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lf-col">
          <div className="lf-col-heading">
            <span className="lf-col-icon"><Send size={18} /></span>
            <h4>Get in touch</h4>
          </div>
          <ul className="lf-contact-list">
            <li>
              <span className="lf-contact-icon"><MapPin size={16} /></span>
              <span>Salem, Tamil Nadu, India</span>
            </li>
            <li>
              <span className="lf-contact-icon"><Phone size={16} /></span>
              <span>+919487812715</span>
            </li>
            <li>
              <span className="lf-contact-icon"><Mail size={16} /></span>
              <span>info.mpeoples@gmail.com</span>
            </li>
            <li>
              <span className="lf-contact-icon"><Clock size={16} /></span>
              <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* <div className="lf-divider">
        <span className="lf-divider-line" />
        <span className="lf-divider-heart"><Heart size={14} /></span>
        <span className="lf-divider-line" />
      </div> */}

      <div className="lf-bottom">
        <div className="lf-trust">
          <span className="lf-trust-icon"><ShieldCheck size={20} /></span>
          <div>
            <p className="lf-trust-title">100% Trusted Platform</p>
            <p className="lf-trust-sub">Safe payments • Verified professionals • 24/7 Support</p>
          </div>
        </div>
        <span className="lf-copyright">© {new Date().getFullYear()} Thozhaa. All rights reserved.</span>
        <span className="lf-tagline">Powered by MPeoples</span>
      </div>
    </div>
  </footer>
);

export default Footer;