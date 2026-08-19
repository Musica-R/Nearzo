import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  MapPin,
  Phone,
  MessageCircle,
  Navigation2,
  ShieldCheck,
  Loader2,
  Clock,
  Star,
  Bell,
  Users,
  Headphones,
  Lock,
  ThumbsUp,
  ArrowRight,
  User,
  Calendar,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import {
  fetchProviderById,
  formatTime,
  formatAvailability,
  toWhatsAppLink,
  toDirectionsLink,
} from "../../api/lokalApi";
import "./ProviderProfile.css";
import image from "../../assets/location.jpg";

const tabs = [
  { key: "Overview", icon: User },
  { key: "Business Hours", icon: Clock },
  { key: "Photos", icon: ImageIcon },
  { key: "Contact Us", icon: Phone },
];

const typeLabels = {
  activity: { section: "Services", backTo: "/service", backLabel: "All Services" },
  vendor: { section: "Vendors", backTo: "/vendors", backLabel: "All Vendors" },
  stall: { section: "Nearby", backTo: "/nearby-stall", backLabel: "Nearby Shop & Stall" },
};

// Same asset used across VendorProfile — swap for your own picks whenever you like.
const FALLBACK_AVATAR = image;
const FALLBACK_ABOUT_ILLUSTRATION = image;

const ProviderProfile = () => {
  const { type, id } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const [provider, setProvider] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProviderById(type, id)
      .then(({ provider, similar }) => {
        if (cancelled) return;
        setProvider(provider || null);
        setSimilar((similar || []).slice(0, 3));
        setError(provider ? null : "Profile not found.");
      })
      .catch(() => !cancelled && setError("Couldn't load this profile right now."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [type, id]);

  const meta = typeLabels[type] || typeLabels.activity;

  if (loading) {
    return (
      <div className="vendor-profile section">
        <div className="container vp-state">
          <Loader2 className="spin" size={16} /> Loading profile...
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="vendor-profile section">
        <div className="container vp-state">
          <p>{error || "Profile not found."}</p>
          <Link to={meta.backTo} className="btn btn-primary">
            Back to {meta.backLabel}
          </Link>
        </div>
      </div>
    );
  }

  const directions = toDirectionsLink(provider);
  const whatsapp = toWhatsAppLink(provider.whatsapp);
  const photos = provider.photos || [];
  const displayName = provider.shopName || provider.name;

  // Supports either camelCase (subcategoryNames) or snake_case (subcategory_names)
  // depending on how the API response gets mapped in lokalApi.js
  const subcategoryNames =
    provider.subcategoryNames ||
    provider.subcategory_names ||
    (Array.isArray(provider.subcategories)
      ? provider.subcategories.filter(Boolean)
      : []);

  console.log("PROVIDER:", provider);
  console.log("SUBCATEGORY NAMES:", provider?.subcategory_names);

  return (
    <div className="vendor-profile section">
      <div className="container">
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to={meta.backTo}>{meta.backLabel}</Link>
          <ChevronRight size={13} />
          <span>{displayName}</span>
        </div>

        {/* ---------- HERO ---------- */}
        <div className="vp-header">
          <div className="vp-avatar-wrap">
            {provider.photo ? (
              <img src={provider.photo} alt={displayName} className="vp-avatar" />
            ) : (
              <img src={FALLBACK_AVATAR} alt={displayName} className="vp-avatar" />
            )}
          </div>

          <div className="vp-header-info">
            <div className="vp-title-row">
              <h1>{displayName}</h1>
              {/* <span className="vp-badge vp-badge-verified">
                <ShieldCheck size={13} /> Verified Vendor
              </span> */}
            </div>

            <p className="vp-category-line">
              {provider.subtitle}
              {provider.name && provider.shopName ? ` · ${provider.name}` : ""}
            </p>

            {(provider.workingFrom || provider.availabilityType || provider.experience) && (
              <div className="vp-chip-row">
                {(provider.workingFrom || provider.availabilityType) && (
                  <span className="vp-chip">
                    <Clock size={13} />{" "}
                    {provider.workingFrom && provider.workingTo
                      ? `${formatAvailability(provider.availabilityType)} ${formatTime(
                        provider.workingFrom
                      )} – ${formatTime(provider.workingTo)}`
                      : formatAvailability(provider.availabilityType)}
                  </span>
                )}
                {provider.experience && (
                  <span className="vp-chip">
                    <Star size={13} /> {provider.experience} Experience
                  </span>
                )}
              </div>
            )}

            {/* <p className="vp-address">
              <MapPin size={14} />
              {[provider.addressLine1, provider.addressLine2, provider.city, provider.pincode]
                .filter(Boolean)
                .join(", ")}
            </p> */}

            {/* <span className="vp-badge vp-badge-listed">
              <ShieldCheck size={13} /> Listed on Lokal
            </span> */}
          </div>

          <div className="vp-header-actions">
            <div className="vp-action-circles">
              {provider.phone && (
                <a href={`tel:${provider.phone}`} className="vp-action-circle">
                  <span className="vp-action-icon">
                    <Phone size={18} />
                  </span>
                  Call
                </a>
              )}
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="vp-action-circle"
                >
                  <span className="vp-action-icon">
                    <MessageCircle size={18} />
                  </span>
                  WhatsApp
                </a>
              )}
              {directions && (
                <a
                  href={directions}
                  target="_blank"
                  rel="noreferrer"
                  className="vp-action-circle"
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
                  <h3>About {displayName}</h3>
                  <p className="text-muted">
                    {displayName} offers {provider.subtitle?.toLowerCase() || "services"}
                    {provider.city ? ` in ${provider.city}` : ""}.
                    {provider.experience ? ` ${provider.experience} of experience.` : ""}
                  </p>
                  <ul className="vp-highlightsss">
                    {provider.experience && (
                      <li className="pill pill-purple">
                        <Star size={13} /> {provider.experience} Experience
                      </li>
                    )}
                    <li className="pill pill-pink">
                      <ShieldCheck size={13} /> Listed on Lokal
                    </li>
                    {provider.availabilityType && (
                      <li className="pill pill-blue">
                        <Calendar size={13} /> {formatAvailability(provider.availabilityType)}
                      </li>
                    )}
                  </ul>

                  {subcategoryNames.length > 0 && (
                    <div className="vp-subcategories">
                      <h4 className="vp-subcategories-title">
                        <Tag size={14} /> Specializes In
                      </h4>
                      <ul className="vp-highlightsss">
                        {subcategoryNames.map((name) => (
                          <li className="pill pill-purple" key={name}>
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <img
                  className="vp-about-illustration"
                  src={FALLBACK_ABOUT_ILLUSTRATION}
                  alt=""
                  aria-hidden="true"
                />
              </section>
            )}

            {activeTab === "Business Hours" && (
              <section className="vp-card">
                <div className="vp-card-icon">
                  <Clock size={18} />
                </div>
                <h3>Business Hours</h3>
                {provider.workingFrom ? (
                  <table className="vp-hours">
                    <tbody>
                      <tr>
                        <td>{formatAvailability(provider.availabilityType)}</td>
                        <td>
                          {formatTime(provider.workingFrom)} – {formatTime(provider.workingTo)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-muted">Hours not listed.</p>
                )}
              </section>
            )}

            {activeTab === "Photos" && (
              <section className="vp-card">
                <div className="vp-card-icon">
                  <ImageIcon size={18} />
                </div>
                <h3>Photos</h3>
                {photos.length > 0 ? (
                  <div className="vp-photo-grid">
                    {photos.map((src) => (
                      <img src={src} alt="" key={src} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No photos yet.</p>
                )}
              </section>
            )}

            {activeTab === "Contact Us" && (
              <section className="vp-card">
                <div className="vp-card-icon">
                  <Phone size={18} />
                </div>
                <h3>Contact</h3>
                <ul className="vp-info-list">
                  {provider.phone && (
                    <li>
                      <Phone size={15} /> {provider.phone}
                    </li>
                  )}
                  {provider.whatsapp && (
                    <li>
                      <MessageCircle size={15} /> {provider.whatsapp}
                    </li>
                  )}
                  {[provider.addressLine1, provider.addressLine2, provider.city, provider.pincode]
                    .filter(Boolean)
                    .join(", ") && (
                      <li>
                        <MapPin size={15} />
                        {[provider.addressLine1, provider.addressLine2, provider.city, provider.pincode]
                          .filter(Boolean)
                          .join(", ")}
                      </li>
                    )}
                </ul>
              </section>
            )}

            {(provider.mapLink || (provider.lat && provider.lng)) && (
              <section className="vp-card vp-location-card">
                <div className="vp-location-text">
                  <div className="vp-card-icon">
                    <MapPin size={18} />
                  </div>
                  <h3>Location</h3>
                  <p className="text-muted">
                    {[provider.addressLine1, provider.addressLine2, provider.city, provider.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {directions && (
                    <a
                      className="btn-pill-outline"
                      href={directions}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on Map <ArrowRight size={14} />
                    </a>
                  )}
                </div>
                <a className="vp-map" href={directions} target="_blank" rel="noreferrer">
                  <span className="vp-map-pin">
                    <MapPin size={22} />
                  </span>
                  <span className="vp-map-label">
                    {[provider.addressLine1, provider.city].filter(Boolean).join(", ")}
                  </span>
                </a>
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
                <p>Your data are secure</p>
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
            <div className="vp-card vp-cta-card">
              <h4>Interested?</h4>
              <p className="text-muted">Reach out directly to book or ask a question.</p>
              {provider.phone && (
                <a className="btn btn-primary btn-block" href={`tel:${provider.phone}`}>
                  <Phone size={15} /> Call Now
                </a>
              )}
              {whatsapp && (
                <a className="btn btn-outline btn-block" href={whatsapp} target="_blank" rel="noreferrer">
                  <MessageCircle size={15} /> Message on WhatsApp
                </a>
              )}
            </div>

            <div className="vp-card vp-similar-card">
              <h4>
                <Users size={16} /> Similar Providers
              </h4>
              {similar.length === 0 && <p className="text-muted">None found nearby.</p>}
              {similar.map((s) => (
                <Link to={`/provider/${type}/${s.id}`} key={s.id} className="vp-similar-item">
                  {s.photo ? (
                    <img src={s.photo} alt={s.name} />
                  ) : (
                    <img src={FALLBACK_AVATAR} alt={s.shopName || s.name} />
                  )}
                  <div className="vp-similar-info">
                    <strong>{s.shopName || s.name}</strong>
                    <span className="text-muted">{s.category || s.subtitle}</span>
                    {s.rating && (
                      <span className="vp-similar-rating">
                        <Star size={12} /> {s.rating}
                        {s.reviewCount ? ` (${s.reviewCount})` : ""}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
              <Link to={meta.backTo} className="btn-pill-outline btn-pill-full">
                View More Providers <ChevronRight size={15} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div >
  );
};

export default ProviderProfile;