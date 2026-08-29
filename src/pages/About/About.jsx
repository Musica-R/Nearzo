import { Link } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiActivity,
  FiShoppingBag,
  FiSearch,
  FiTarget,
  FiCompass,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import "./About.css";

const categories = [
  {
    icon: FiHome,
    title: "Home Services",
    copy:
      "Electricians, plumbers, cleaning services, technicians, CCTV and repair providers.",
  },
  {
    icon: FiBookOpen,
    title: "Learning & Training",
    copy:
      "Tuition centres, coaching institutes, skill-training providers and professional trainers.",
  },
  {
    icon: FiActivity,
    title: "Sports & Fitness",
    copy: "Gyms, fitness centres, sports academies and trainers near you.",
  },
  {
    icon: FiShoppingBag,
    title: "Nearby Shops & Businesses",
    copy: "Local shops, stores, professionals and other businesses in your area.",
  },
];

const missionPoints = [
  "Make local business discovery simple",
  "Help users find relevant services nearby",
  "Give local businesses better online visibility",
  "Bring useful business information together",
  "Make connecting with businesses easier",
  "Support the growth of local businesses through digital visibility",
];

const listingFields = [
  "Business name & category",
  "Services offered",
  "Phone & WhatsApp number",
  "Email address",
  "Business address & map location",
  "Photos & description",
  "Operating hours",
  "Expected pricing",
];

const About = () => {
  return (
    <div className="ab-page">
      {/* ---------- Hero ---------- */}
      <section className="ab-hero">
        <div className="ab-container ab-hero-inner">
          <span className="ab-eyebrow">About Lokal</span>
          <h1>
            Discover local.
            <br />
            Connect easily.
          </h1>
          <p className="ab-hero-sub">
            Lokal is a local business discovery platform built to help people
            find the right businesses, services, shops and professionals in
            and around their area — and help those businesses get found.
          </p>
          <div className="ab-hero-actions">
            <Link to="/vendors" className="ab-btn ab-btn-primary">
              <FiSearch size={16} />
              Explore businesses
            </Link>
            <Link to="/become-vendor" className="ab-btn ab-btn-ghost">
              <HiOutlineOfficeBuilding size={16} />
              List your business
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- What we do ---------- */}
      <section className="ab-section">
        <div className="ab-container">
          <div className="ab-section-head">
            <span className="ab-tag">What we do</span>
            <h2>Everything a listing needs, in one place</h2>
            <p>
              Businesses build a listing with the details customers actually
              look for — users explore those details and reach out directly.
            </p>
          </div>

          <div className="ab-fields-grid">
            {listingFields.map((field) => (
              <div className="ab-field-chip" key={field}>
                {field}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="ab-section ab-section-tint">
        <div className="ab-container">
          <div className="ab-section-head">
            <span className="ab-tag">Explore Lokal</span>
            <h2>A wide range of local businesses</h2>
            <p>As Lokal grows, we're bringing more categories onto the platform.</p>
          </div>

          <div className="ab-category-grid">
            {categories.map(({ icon: Icon, title, copy }) => (
              <div className="ab-category-card" key={title}>
                <div className="ab-category-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- For users / For vendors ---------- */}
      <section className="ab-section">
        <div className="ab-container ab-split">
          <div className="ab-split-card">
            <div className="ab-split-icon">
              <FiCompass size={22} />
            </div>
            <h3>For users</h3>
            <p>
              Finding a local business shouldn't be difficult. Instead of
              searching across multiple platforms, explore services, contact
              details, address, photos, location and expected pricing in one
              place — then contact the business directly.
            </p>
          </div>

          <div className="ab-split-card">
            <div className="ab-split-icon">
              <FiUsers size={22} />
            </div>
            <h3>For vendors</h3>
            <p>
              Build your online presence and make your services easier to
              discover. Whether you're an electrician, trainer, gym owner or
              shop owner, your listing gives potential customers the
              information they need before they reach out.
            </p>
            <Link to="/become-vendor" className="ab-split-link">
              Become a vendor <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Vision & Mission ---------- */}
      <section className="ab-section ab-section-dark">
        <div className="ab-container ab-vm-grid">
          <div className="ab-vm-block">
            <div className="ab-vm-icon">
              <FiTarget size={20} />
            </div>
            <h3>Our vision</h3>
            <p>
              A simple, reliable and accessible local business discovery
              platform that connects communities with the businesses and
              services around them.
            </p>
          </div>

          <div className="ab-vm-block">
            <div className="ab-vm-icon">
              <FiTrendingUp size={20} />
            </div>
            <h3>Our mission</h3>
            <ul className="ab-mission-list">
              {missionPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="ab-section">
        <div className="ab-container">
          <div className="ab-cta">
            <h2>Discover Nearby. Connect Easily. Live Locally.</h2>
            <p>Welcome to Lokal — your local business discovery platform.</p>
            <div className="ab-hero-actions ab-cta-actions">
              <Link to="/vendors" className="ab-btn ab-btn-primary">
                <FiSearch size={16} />
                Find a business
              </Link>
              <Link to="/contact" className="ab-btn ab-btn-ghost">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;