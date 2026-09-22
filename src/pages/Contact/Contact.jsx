import { useState } from "react";
import { FiMapPin, FiMail, FiPhone, FiSend, FiClock } from "react-icons/fi";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import "./Contact.css";

const ADDRESS =
  "No 56, 3-1, 3rd Cross St, Ranga Nagar, Mullai Nagar, Suramangalam, Salem, Tamil Nadu 636005";
const EMAIL = "info.mpeoples@gmail.com";
const PHONE_DISPLAY = "+91 94878 12715";
const PHONE_TEL = "+919487812715";

// Google Maps link supplied for the office location
const MAPS_LINK = "https://maps.app.goo.gl/9KkfvKc257UsYDE7A";
// Resolved coordinates from the link above, used for the embedded map
const MAPS_EMBED_SRC =
  "https://www.google.com/maps?q=11.6684234,78.1169469&z=17&output=embed";

const contactCards = [
  {
    icon: FiMapPin,
    label: "Visit us",
    lines: [ADDRESS],
    href: MAPS_LINK,
    linkLabel: "Get directions",
  },
  {
    icon: FiPhone,
    label: "Call us",
    lines: [PHONE_DISPLAY],
    href: `tel:${PHONE_TEL}`,
    linkLabel: "Call now",
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    lines: [PHONE_DISPLAY],
    href: `https://wa.me/${PHONE_TEL.replace("+", "")}`,
    linkLabel: "Start a chat",
  },
  {
    icon: FiMail,
    label: "Email us",
    lines: [EMAIL],
    href: `mailto:${EMAIL}`,
    linkLabel: "Send an email",
  },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", Icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", Icon: FaInstagram },
  { label: "WhatsApp", href: `https://wa.me/${PHONE_TEL.replace("+", "")}`, Icon: FaWhatsapp },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: FaLinkedinIn },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = `New message from Thozhaa website\n\nName: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`;

    const whatsappUrl = `https://wa.me/${PHONE_TEL.replace(
      "+",
      ""
    )}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="ct-page">
      {/* ---------- Hero ---------- */}
      <section className="ct-hero">
        <div className="ct-container ct-hero-inner">
          <span className="ct-eyebrow">Contact Us</span>
          <h1>We'd love to hear from you</h1>
          <p>
            Questions about using Thozhaa, listing your business, or anything
            else — reach out and our team will get back to you.
          </p>
        </div>
      </section>

      {/* ---------- Contact cards ---------- */}
      <section className="ct-section">
        <div className="ct-container">
          <div className="ct-cards-grid">
            {contactCards.map(({ icon: Icon, label, lines, href, linkLabel }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="ct-card"
              >
                <div className="ct-card-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <span className="ct-card-label">{label}</span>
                  {lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <span className="ct-card-link">{linkLabel} →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Form + Map ---------- */}
      <section className="ct-section ct-section-tint">
        <div className="ct-container ct-split">
          <form className="ct-form" onSubmit={handleSubmit}>
            <h2>Send us a message</h2>
            <p className="ct-form-sub">
              Fill in the form and it'll open WhatsApp with your message
              ready to send to us.
            </p>

            <label className="ct-field">
              <span>Your name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </label>

            <label className="ct-field">
              <span>Email address</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="ct-field">
              <span>Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="How can we help?"
                rows={5}
                required
              />
            </label>

            <button type="submit" className="ct-submit">
              <FaWhatsapp size={16} />
              Send via WhatsApp
            </button>
          </form>

          <div className="ct-side">
            <div className="ct-map-wrap">
              <iframe
                title="Thozhaa office location"
                src={MAPS_EMBED_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="ct-hours">
              <div className="ct-hours-icon">
                <FiClock size={18} />
              </div>
              <div>
                <span className="ct-card-label">Office hours</span>
                <p>Monday – Saturday, 9:30 AM – 6:30 PM</p>
              </div>
            </div>

            <div className="ct-social">
              <span>Follow us</span>
              <div className="ct-social-links">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;