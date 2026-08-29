// VendorProfile.js
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  MapPin,
  Phone,
  MessageCircle,
  Navigation2,
  ShieldCheck,
  Clock,
  Tag,
  Briefcase,
  Bell,
  Users,
  Headphones,
  Lock,
  ThumbsUp,
  ArrowRight,
  User,
  IndianRupee,
} from "lucide-react";
import {
  getProviderName,
  getContactPerson,
  getProviderCategoryName,
  getProviderSubcategories,
  getProviderAddress,
  formatAvailabilityLabel,
  formatCurrency,
  formatTime,
  getInitials,
} from "../../api/lokalApi";
import "./VendorProfile.css";
import image from "../../assets/location.jpg";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import { Download, Globe } from "lucide-react";

const API_BASE = "https://booking.mpdatahub.com/api";

const tabs = [
  { key: "Overview", icon: User },
  { key: "Services & Pricing", icon: IndianRupee },
  { key: "Hours & Location", icon: Clock },
  { key: "Contact", icon: Phone },
];

// Placeholder art — swap for your own. Search unsplash.com/s/photos for a
// *free* (non Unsplash+) result and paste the images.unsplash.com/photo-… link in.
const FALLBACK_ABOUT_ILLUSTRATION = image;

const VendorProfile = () => {
  const { type = "vendor", categoryId, vendorId } = useParams();
  const isActivity = type === "activity";

  const [allVendors, setAllVendors] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  const qrCardRef = useRef(null);

  const handleDownloadCard = () => {
    if (!qrCardRef.current) return;
    toPng(qrCardRef.current, { pixelRatio: 3, backgroundColor: "#ffffff" })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${name.replace(/\s+/g, "_")}_lokal_profile.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Could not generate image:", err));
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = isActivity
          ? `${API_BASE}/activity-category?category_id=${categoryId}`
          : `${API_BASE}/vendors-category?category_id=${categoryId}`;

        const res = await fetch(endpoint);
        const json = await res.json();

        if (!json.success) throw new Error(json.message || "Failed to load listing");

        const list = json.data || [];
        if (cancelled) return;

        setAllVendors(list);
        const found = list.find((v) => String(v.id) === String(vendorId));
        setVendor(found || null);
      } catch (err) {
        if (!cancelled) setError("Couldn't load this listing right now. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (categoryId && vendorId) load();
    return () => {
      cancelled = true;
    };
  }, [isActivity, categoryId, vendorId]);

  if (loading) {
    return (
      <div className="vendor-profile section">
        <div className="container vp-state">Loading listing…</div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="vendor-profile section">
        <div className="container vp-state">
          <p>{error || "This listing could not be found."}</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const name = getProviderName(vendor);
  const contactPerson = getContactPerson(vendor);
  const categoryName = getProviderCategoryName(vendor) || vendor.category_name;
  const subcategories = getProviderSubcategories(vendor);
  const address = getProviderAddress(vendor);
  const waNumber = vendor.whatsapp_number?.replace(/\D/g, "");
  const waHref = waNumber
    ? `https://wa.me/91${waNumber}?text=${encodeURIComponent(
      `Hi, I found your listing "${name}" on Lokal and would like to know more.`
    )}`
    : null;

  const similar = allVendors.filter((v) => v.id !== vendor.id).slice(0, 3);

  return (
    <div className="vendor-profile section">
      <div className="container">
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to={`/category/${type}/${categoryId}`}>
            {categoryName || (isActivity ? "Activity" : "Service")}
          </Link>
          <ChevronRight size={13} />
          <span>{name}</span>
        </div>

        {/* ---------- HERO ---------- */}
        <div className="vp-header">
          <div className="vp-avatar-wrap">
            {vendor.profile_photo ? (
              <img src={vendor.profile_photo} alt={name} className="vp-avatar" />
            ) : (
              <div className="vp-avatar vp-avatar-fallback">{getInitials(name)}</div>
            )}
          </div>

          <div className="vp-header-info">
            <div className="vp-title-row">
              <h1>{name}</h1>
              <span className="vp-badge vp-badge-verified">
                <ShieldCheck size={13} /> Verified Vendor
              </span>
            </div>

            {contactPerson && contactPerson !== name && (
              <p className="vp-contact-person">Contact: {contactPerson}</p>
            )}

            <p className="vp-category-line">
              {categoryName}
              {vendor.experience ? ` · ${vendor.experience} experience` : ""}
            </p>

            {subcategories.length > 0 && (
              <div className="vp-chip-row">
                {subcategories.map((s) => (
                  <span className="vp-chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* {address && (
              <p className="vp-address">
                <MapPin size={14} /> {address}
              </p>
            )} */}

            <span className="vp-badge vp-badge-listed">
              <ShieldCheck size={13} /> Listed on Lokal
            </span>
          </div>

          <div className="vp-header-actions">
            <div className="vp-price-tag">
              <span>Starting at</span>
              <strong>{formatCurrency(vendor.price)}</strong>
            </div>

            <div className="vp-action-circles">
              <a className="vp-action-circle" href={`tel:+91${vendor.phone_number}`}>
                <span className="vp-action-icon">
                  <Phone size={18} />
                </span>
                Call
              </a>
              {waHref && (
                <a
                  className="vp-action-circle"
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="vp-action-icon">
                    <MessageCircle size={18} />
                  </span>
                  WhatsApp
                </a>
              )}
              {vendor.google_map_link && (
                <a
                  className="vp-action-circle"
                  href={vendor.google_map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="vp-action-icon">
                    <Navigation2 size={18} />
                  </span>
                  Directions
                </a>
              )}
            </div>

            <div className="vp-trusted-strip">
              <ShieldCheck size={22} />
              <div>
                <strong>Trusted &amp; Verified</strong>
                <span>All our vendors are background verified for your safety.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- SAFETY NOTICE ---------- */}
        <p className="vp-disclaimer">
          <span className="vp-disclaimer-icon">
            <Bell size={14} />
          </span>
          <span>
            <strong>Safety Notice:</strong> Lokal is an advertising and discovery platform
            only. Please independently verify all information before booking.
          </span>
        </p>

        <div className="vp-layout">
          <div className="vp-main">
            {/* ---------- TABS ---------- */}
            <div className="vp-tabs">
              {tabs.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  className={activeTab === key ? "active" : ""}
                  onClick={() => setActiveTab(key)}
                >
                  <Icon size={16} />
                  {key}
                </button>
              ))}
            </div>

            {activeTab === "Overview" && (
              <section className="vp-card vp-about-card">
                <div className="vp-about-text">
                  <div className="vp-card-icon">
                    <User size={18} />
                  </div>
                  <h3>About {name}</h3>
                  <ul className="vp-highlights">
                    <li className="pill pill-purple">
                      <Briefcase size={13} /> {vendor.experience || "Experience not specified"}
                    </li>
                    <li className="pill pill-pink">
                      <Tag size={13} /> {categoryName}
                      {subcategories.length > 0 ? ` — ${subcategories.join(", ")}` : ""}
                    </li>
                    <li className="pill pill-blue">
                      <Clock size={13} /> {formatAvailabilityLabel(vendor.availability_type)},{" "}
                      {formatTime(vendor.working_from)} – {formatTime(vendor.working_to)}
                    </li>
                  </ul>
                </div>
                <img
                  className="vp-about-illustration"
                  src={FALLBACK_ABOUT_ILLUSTRATION}
                  alt=""
                  aria-hidden="true"
                />
              </section>
            )}

            {activeTab === "Services & Pricing" && (
              <section className="vp-card">
                <div className="vp-card-icon">
                  <IndianRupee size={18} />
                </div>
                <h3>Services &amp; Pricing</h3>
                <div className="vp-price-card">
                  <div>
                    <h4>{categoryName}</h4>
                    {subcategories.length > 0 && (
                      <div className="vp-chip-row">
                        {subcategories.map((s) => (
                          <span className="vp-chip" key={s}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <strong className="vp-price-card-amount">{formatCurrency(vendor.price)}</strong>
                </div>
              </section>
            )}

            {activeTab === "Hours & Location" && (
              <>
                <section className="vp-card">
                  <div className="vp-card-icon">
                    <Clock size={18} />
                  </div>
                  <h3>Business Hours</h3>
                  <table className="vp-hours">
                    <tbody>
                      <tr>
                        <td>Available</td>
                        <td>{formatAvailabilityLabel(vendor.availability_type)}</td>
                      </tr>
                      <tr>
                        <td>Timing</td>
                        <td>
                          {formatTime(vendor.working_from)} – {formatTime(vendor.working_to)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                <section className="vp-card vp-location-card">
                  <div className="vp-location-text">
                    <div className="vp-card-icon">
                      <MapPin size={18} />
                    </div>
                    <h3>Location</h3>
                    <p className="text-muted">{address || "Address not available"}</p>
                    {vendor.google_map_link && (
                      <a
                        className="btn-pill-outline"
                        href={vendor.google_map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open in Maps <ArrowRight size={14} />
                      </a>
                    )}
                  </div>
                  <a
                    className="vp-map"
                    href={vendor.google_map_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="vp-map-pin">
                      <MapPin size={22} />
                    </span>
                    <span className="vp-map-label">{address || "Address not available"}</span>
                  </a>
                </section>
              </>
            )}

            {activeTab === "Contact" && (
              <section className="vp-card">
                <div className="vp-card-icon">
                  <Phone size={18} />
                </div>
                <h3>Contact</h3>
                <ul className="vp-info-list">
                  <li>
                    <Phone size={15} /> {vendor.phone_number}
                  </li>
                  {vendor.whatsapp_number && (
                    <li>
                      <MessageCircle size={15} /> {vendor.whatsapp_number}
                    </li>
                  )}
                  {address && (
                    <li>
                      <MapPin size={15} /> {address}
                    </li>
                  )}
                </ul>
              </section>
            )}

            {/* ---------- TRUST STRIP ---------- */}
            <section className="vp-card vp-trust-strip">
              <div className="vp-trust-item">
                <span className="vp-trust-icon">
                  <ShieldCheck size={20} />
                </span>
                <strong>Verified Vendors</strong>
                <p>All vendors are verified for your safety</p>
              </div>
              <div className="vp-trust-item">
                <span className="vp-trust-icon">
                  <Headphones size={20} />
                </span>
                <strong>24/7 Support</strong>
                <p>We're here to help you anytime</p>
              </div>
              <div className="vp-trust-item">
                <span className="vp-trust-icon">
                  <Lock size={20} />
                </span>
                <strong>Secure Booking</strong>
                <p>Your data and payments are secure</p>
              </div>
              <div className="vp-trust-item">
                <span className="vp-trust-icon">
                  <ThumbsUp size={20} />
                </span>
                <strong>Trusted by Thousands</strong>
                <p>trust Lokal</p>
              </div>
            </section>
          </div>

          {/* ---------- SIDEBAR ---------- */}
          <aside className="vp-sidebar">
            <div className="vp-card vp-qr-card" ref={qrCardRef}>
              <div className="vp-qr-left">
                <div className="vp-qr-brand">
                  <Globe size={14} /> Lokal
                </div>
                <strong className="vp-qr-name">{name}</strong>
                <span className="vp-qr-service">{categoryName}</span>
                {/* <span className="vp-qr-phone">
                  <Phone size={13} /> +91 {vendor.phone_number}
                </span> */}
              </div>

              <div className="vp-qr-right">
                <QRCodeCanvas
                  value={window.location.href}
                  size={92}
                  bgColor="#ffffff"
                  fgColor="#3d0a5e"
                  level="M"
                />
              </div>
            </div>

            <button className="btn btn-outline btn-block vp-qr-download-btn" onClick={handleDownloadCard}>
              <Download size={15} /> Download Profile QR
            </button>
            <div className="vp-card vp-cta-card">
              <h4>Interested?</h4>
              <p className="text-muted">Reach out directly to book or ask a question.</p>
              <a className="btn btn-primary btn-block" href={`tel:+91${vendor.phone_number}`}>
                <Phone size={15} /> Call Now
              </a>
              {waHref && (
                <a
                  className="btn btn-outline btn-block"
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={15} /> Message on WhatsApp
                </a>
              )}
            </div>

            {similar.length > 0 && (
              <div className="vp-card vp-similar-card">
                <h4>
                  <Users size={16} /> Similar Providers
                </h4>
                {similar.map((v) => (
                  <Link
                    to={`/vendor/${type}/${categoryId}/${v.id}`}
                    key={v.id}
                    className="vp-similar-item"
                  >
                    {v.profile_photo ? (
                      <img src={v.profile_photo} alt={getProviderName(v)} />
                    ) : (
                      <div className="vp-similar-avatar-fallback">
                        {getInitials(getProviderName(v))}
                      </div>
                    )}
                    <div className="vp-similar-info">
                      <strong>{getProviderName(v)}</strong>
                      <span className="text-muted">{formatCurrency(v.price)}</span>
                    </div>
                  </Link>
                ))}
                <Link to={`/category/${type}/${categoryId}`} className="btn-pill-outline btn-pill-full">
                  View More Providers <ChevronRight size={15} />
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;