import { useState } from "react";
import { FiMapPin, FiMail, FiPhone, FiSend, FiClock } from "react-icons/fi";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import "./Contact.css";

const ADDRESS =
  "1/248, Raja Ganapathy Complex, 2nd Floor, Opposite BSNL Office, Meyyanur Main Road, Salem – 636004, Tamil Nadu, India";
const EMAIL = "mpeoplesofficial@gmail.com";
const PHONE_DISPLAY = "+91 94878 12715";
const PHONE_TEL = "+919487812715";

const contactCards = [
  {
    icon: FiMapPin,
    label: "Visit us",
    lines: [ADDRESS],
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      ADDRESS
    )}`,
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
    const subject = encodeURIComponent(`New message from ${form.name || "Lokal visitor"}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="ct-page">
      {/* ---------- Hero ---------- */}
      <section className="ct-hero">
        <div className="ct-container ct-hero-inner">
          <span className="ct-eyebrow">Contact Us</span>
          <h1>We'd love to hear from you</h1>
          <p>
            Questions about using Lokal, listing your business, or anything
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
              Fill in the form and it'll open your email app with everything
              ready to send.
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
              <FiSend size={16} />
              Send message
            </button>
          </form>

          <div className="ct-side">
            <div className="ct-map-wrap">
              <iframe
                title="Lokal office location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  ADDRESS
                )}&output=embed`}
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
                <p>Monday – Saturday, 10:00 AM – 6:30 PM</p>
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