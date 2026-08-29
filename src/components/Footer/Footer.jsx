import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  ChevronRight,
  Send,
  Grid2X2,
  Users,
  Home,
  GraduationCap,
  Dumbbell,
  Store,
  UserPlus,
  FileText,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import "./Footer.css";

// lucide-react no longer ships brand/social icons, so these are small
// inline SVGs kept local to this file (no extra dependency needed).
const FacebookGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6C16.4 3.56 15.4 3.5 14.24 3.5c-2.4 0-4.04 1.47-4.04 4.16V9.9H7.5V13h2.7v8h3.3Z" />
  </svg>
);

const InstagramGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21.6 7.7a2.7 2.7 0 0 0-1.9-1.9C18 5.3 12 5.3 12 5.3s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.7 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.3 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.3ZM10 15V9l5.2 3-5.2 3Z" />
  </svg>
);

const TwitterGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.4 22H1.2l8.1-9.3L1 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20Z" />
  </svg>
);

const exploreLinks = [
  { label: "Home Services", to: "/service", icon: Home },
  { label: "Learning & Training", to: "/service", icon: GraduationCap },
  { label: "Sports & Fitness", to: "/service", icon: Dumbbell },
  { label: "Nearby Shops", to: "/nearby-stall", icon: Store },
];

const companyLinks = [
  { label: "Become a Vendor", to: "/become-vendor", icon: UserPlus },
  { label: "My Activity", to: "/activity", icon: FileText },
  // { label: "Help & Support", href: "#help", icon: HelpCircle },
  { label: "Terms & Conditions", to: "/terms", icon: ShieldCheck },
  { label: "Privacy Policy", to: "/privacy", icon: ShieldCheck },
];

const Footer = () => (
  <footer className="lf-footer">
    <div className="lf-glow" aria-hidden="true" />
    <div className="lf-dots" aria-hidden="true" />
    <svg className="lf-india" viewBox="0 0 200 220" fill="none" aria-hidden="true">
      <path
        d="M96 6c4 0 7 3 10 4 4 1 8-2 11 1 2 2 1 6 3 8 3 3 8 1 11 4 2 2 1 6 3 8 4 4 10 3 13 7 2 3 0 7 2 10 3 4 9 4 11 8 2 4-1 9 1 13 2 5 8 6 9 11 1 4-2 8-1 12 1 5 6 8 6 13 0 4-3 8-5 12-2 5-1 10-4 14-2 4-7 5-10 8-3 3-3 8-6 11-3 3-8 3-11 6-3 3-2 8-6 10-4 2-9-1-13 1-4 2-5 7-9 8-4 1-8-2-12-1-4 1-6 5-10 5-4 0-7-4-11-4-4 0-7 4-11 4-4 0-6-4-10-5-4-1-8 2-12 1-4-1-5-6-9-8-4-2-9 1-13-1-4-2-3-7-6-10-3-3-8-3-11-6-3-3-3-8-6-11-3-3-8-4-10-8-3-4-2-9-4-14-2-4-5-8-5-12 0-5 5-8 6-13 1-4-2-8-1-12 1-5 7-6 9-11 2-4-1-9 1-13 2-4 8-4 11-8 2-3 0-7 2-10 3-4 9-3 13-7 2-2 1-6 3-8 3-3 8-1 11-4 2-2 1-6 3-8 3-3 7 0 11-1 3-1 6-4 10-4z"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.4"
      />
    </svg>

    <div className="lf-wrap">
      <div className="lf-grid">
        <div className="lf-brand">
          <div className="lf-brand-mark">
            <span className="lf-brand-mark-letter">L</span>
            <span className="lf-brand-mark-name">Lokal</span>
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
              <span>mpeoplesofficial@gmail.com</span>
            </li>
            <li>
              <span className="lf-contact-icon"><Clock size={16} /></span>
              <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="lf-divider">
        <span className="lf-divider-line" />
        <span className="lf-divider-heart"><Heart size={14} /></span>
        <span className="lf-divider-line" />
      </div>

      <div className="lf-bottom">
        <div className="lf-trust">
          <span className="lf-trust-icon"><ShieldCheck size={20} /></span>
          <div>
            <p className="lf-trust-title">100% Trusted Platform</p>
            <p className="lf-trust-sub">Safe payments • Verified professionals • 24/7 Support</p>
          </div>
        </div>
        <span className="lf-copyright">© {new Date().getFullYear()} Lokal. All rights reserved.</span>
        <span className="lf-tagline">Made for local communities, by Lokal.</span>
      </div>
    </div>
  </footer>
);

export default Footer;