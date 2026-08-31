import {
    FiCheck,
    FiGlobe,
    FiShare2,
    FiStar,
    FiSmartphone,
    FiImage,
    FiPhoneCall,
    FiMapPin,
    FiBriefcase,
    FiArrowRight,
    FiUsers,
    FiTrendingUp,
} from "react-icons/fi";
import "./BusinessPortfolio.css";

const includedItems = [
    { icon: FiBriefcase, label: "Your business info" },
    { icon: FiStar, label: "Services you offer" },
    { icon: FiImage, label: "Photos of your work" },
    { icon: FiUsers, label: "Customer reviews" },
    { icon: FiMapPin, label: "Your location" },
    { icon: FiPhoneCall, label: "WhatsApp button" },
];

const steps = [
    {
        number: "1",
        title: "Tell us about your business",
        desc: "Add your name, services, and a few photos. It takes less than 5 minutes.",
        image:
            "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=600&q=80&auto=format&fit=crop",
        imageAlt: "Business owner filling in details on a tablet",
    },
    {
        number: "2",
        title: "We build your website",
        desc: "Your details turn into a clean, professional website automatically — no design work needed.",
        image:
            "https://images.unsplash.com/photo-1568658176307-bfbd2873abda?w=600&q=80&auto=format&fit=crop",
        imageAlt: "Two people looking at a website being built on a laptop",
    },
    {
        number: "3",
        title: "Share your link",
        desc: "Send your website link on WhatsApp, Instagram, or your business card so customers can find you.",
        image:
            "/share.jpg",
        imageAlt: "Business owner sharing their website link on a phone",
    },
];

const benefits = [
    {
        icon: FiUsers,
        title: "More customers",
        desc: "New customers can find you online and reach out when they need your service.",
    },
    {
        icon: FiShare2,
        title: "One link for everywhere",
        desc: "Share the same link on WhatsApp, Instagram, and printed cards.",
    },
    {
        icon: FiStar,
        title: "Looks trustworthy",
        desc: "A real website makes customers feel confident choosing you.",
    },
    {
        icon: FiSmartphone,
        title: "Works on every phone",
        desc: "Your website looks good whether customers open it on mobile or computer.",
    },
    {
        icon: FiPhoneCall,
        title: "Direct enquiries",
        desc: "Customers can call or WhatsApp you with one tap — no extra apps needed.",
    },
    {
        icon: FiMapPin,
        title: "Easy to find",
        desc: "Show your shop or office location so nearby customers can visit you.",
    },
];

const BusinessPortfolio = () => {
    return (
        <div className="bp-page">
            {/* ---------- Hero ---------- */}
            <section className="bp-hero">
                <div className="bp-container bp-hero-inner">
                    <div className="bp-hero-text">
                        <span className="bp-hero-badge">
                            <FiGlobe size={14} />
                            Your Business Portfolio
                        </span>
                        <h1>Get your own business website in minutes</h1>
                        <p>
                            You already have everything a website needs — your services,
                            your photos, your reviews. We turn them into a simple website
                            you can share with customers. No design skills, no coding.
                        </p>

                        <div className="bp-hero-actions">
                            <a
                                href="https://digitalkit.mpeoplesnet.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bp-cta-btn"
                            >
                                <FiGlobe size={16} />
                                Create My Website
                            </a>
                            <a
                                href="https://digitalkit.mpeoplesnet.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bp-secondary-btn"
                            >
                                See a Sample Website
                                <FiArrowRight size={16} />
                            </a>
                        </div>

                        <p className="bp-hero-note">Free to set up. Ready in a few clicks.</p>
                    </div>

                    <div className="bp-hero-visual">
                        <img
                            src="/port3.png"
                            alt="Small business owner standing in her shop"
                            className="bp-hero-photo"
                        />
                    </div>
                </div>
            </section>

            {/* ---------- Vendor online benefit ---------- */}
            <section className="bp-vendor-benefit">
                <div className="bp-container bp-vendor-benefit-inner">
                    <div className="bp-vendor-benefit-visual">
                        <img
                            src="/port2.jpg"
                            alt="Vendor checking business growth and orders on a laptop"
                            className="bp-vendor-benefit-photo"
                        />
                    </div>
                    <div className="bp-vendor-benefit-text">
                        <span className="bp-vendor-benefit-badge">
                            <FiTrendingUp size={14} />
                            Extra Benefit for Vendors
                        </span>
                        <h2>Being online helps vendors get found faster</h2>
                        <p>
                            Most customers search online before they visit a shop or book a
                            service. When your business has its own website, you show up in
                            those searches, on shared links, and on social media — so
                            vendors like you get discovered by people who are already
                            looking for what you offer. It's a simple way to stand out from
                            other vendors who are still offline.
                        </p>
                        <a
                            href="https://digitalkit.mpeoplesnet.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bp-cta-btn bp-vendor-benefit-cta"
                        >
                            <FiGlobe size={16} />
                            Get Found Online
                        </a>
                    </div>
                </div>
            </section>

            {/* ---------- How it works ---------- */}
            <section className="bp-steps">
                <div className="bp-container">
                    <h2 className="bp-section-title">How it works</h2>
                    <p className="bp-section-subtitle">
                        Three simple steps. No technical knowledge needed.
                    </p>

                    <div className="bp-steps-grid">
                        {steps.map((step, i) => (
                            <div className="bp-step-card" key={step.number}>
                                <div className="bp-step-image-wrap">
                                    <img
                                        src={step.image}
                                        alt={step.imageAlt}
                                        className="bp-step-image"
                                        loading="lazy"
                                    />
                                    <span className="bp-step-number">{step.number}</span>
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                                {i < steps.length - 1 && (
                                    <FiArrowRight className="bp-step-arrow" size={20} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- What's included ---------- */}
            <section className="bp-included">
                <div className="bp-container">
                    <h2 className="bp-section-title">What goes on your website</h2>
                    <div className="bp-included-grid">
                        {includedItems.map(({ icon: Icon, label }) => (
                            <div className="bp-included-item" key={label}>
                                <span className="bp-included-icon">
                                    <Icon size={18} />
                                </span>
                                <span>{label}</span>
                                <span className="bp-check-icon">
                                    <FiCheck size={12} />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- Why create your website ---------- */}
            <section className="bp-why">
                <div className="bp-container">
                    <h2 className="bp-section-title">Why business owners like you use this</h2>

                    <div className="bp-benefits-grid">
                        {benefits.map(({ icon: Icon, title, desc }) => (
                            <div className="bp-benefit-card" key={title}>
                                <span className="bp-benefit-icon">
                                    <Icon size={20} />
                                </span>
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- Sample showcase ---------- */}
            <section className="bp-showcase">
                <div className="bp-container bp-showcase-inner">
                    <div className="bp-showcase-text">
                        <h2>Not sure what it looks like?</h2>
                        <p>
                            Open a real example website made on this platform. Look around
                            for a minute — yours can look just like this.
                        </p>

                        <a
                            href="https://digitalkit.mpeoplesnet.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bp-cta-btn"
                        >
                            <FiGlobe size={16} />
                            Open Sample Website
                        </a>
                    </div>
                </div>
            </section>

            {/* ---------- Final CTA ---------- */}
            <section className="bp-final-cta">
                <div className="bp-container bp-final-cta-inner">
                    <h2>Ready to get your business online?</h2>
                    <p>Set up your website today. It only takes a few minutes.</p>
                    <a
                        href="https://digitalkit.mpeoplesnet.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bp-cta-btn bp-cta-btn-light"
                    >
                        <FiGlobe size={16} />
                        Create My Website
                    </a>
                </div>
            </section>
        </div>
    );
};

export default BusinessPortfolio;