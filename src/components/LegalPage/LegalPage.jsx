import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, FileText, ChevronUp } from "lucide-react";
import "./LegalPage.css";

const Block = ({ block }) => {
  if (Array.isArray(block)) {
    return (
      <ul className="legal-list">
        {block.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p>{block}</p>;
};

const LegalPage = ({ title, lastUpdated, intro, sections, contact }) => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 480);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="legal-hero-glow" aria-hidden="true" />
        <div className="legal-hero-inner">
          <span className="legal-hero-badge">
            <FileText size={14} />
            Lokal
          </span>
          <h1>{title}</h1>
          <p className="legal-updated">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="legal-body">
        {intro && (
          <div className="legal-intro">
            {intro.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        )}

        {sections.map((section, idx) => (
          <section className="legal-card" key={idx}>
            <div className="legal-card-head">
              <span className="legal-card-num">{idx + 1}</span>
              <h2>{section.heading}</h2>
            </div>
            <div className="legal-card-body">
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          </section>
        ))}

        {contact && (
          <section className="legal-card legal-contact">
            <div className="legal-card-head">
              <span className="legal-card-num">
                <Mail size={16} />
              </span>
              <h2>Contact Us</h2>
            </div>
            <div className="legal-card-body">
              <p>{contact.intro}</p>
              <div className="legal-contact-grid">
                <div className="legal-contact-item">
                  <span className="legal-contact-icon">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <strong>{contact.name}</strong>
                    {contact.address.map((line, i) => (
                      <span className="legal-contact-line" key={i}>
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="legal-contact-item">
                  <span className="legal-contact-icon">
                    <Mail size={18} />
                  </span>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
                <div className="legal-contact-item">
                  <span className="legal-contact-icon">
                    <Phone size={18} />
                  </span>
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <button
        className={`legal-top-btn ${showTopBtn ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ChevronUp size={20} />
      </button>
    </div>
  );
};

export default LegalPage;