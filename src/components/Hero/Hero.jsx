import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, LocateFixed, Star } from "lucide-react";
import "./Hero.css";

// --- TODO: point this at your real asset path ---
import heroCleanerImg from "../../assets/bg.png";

const trustedAvatars = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
];

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Coimbatore, Tamil Nadu");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/service?location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="lk-hero">
      {/* ---------- Left: photo column ---------- */}
      <div className="lk-hero-image-col">
        <img
          src={heroCleanerImg}
          alt="Professional cleaner at work"
          className="lk-hero-image"
        />

        {/* floating rating card, overlapping the photo's bottom edge */}
        <div className="lk-hero-rating-card">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
            alt="Professional cleaner"
          />
          <div>
            <strong>Home Cleaning</strong>
            <span>Professional Cleaner</span>
            <span className="lk-hero-rating-score">
              <Star size={13} fill="#F5A623" stroke="none" /> 4.8 (230)
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Right: copy + search ---------- */}
      <div className="lk-hero-content">
        <h1>
          Daily Services,
          <br />
          Simplified.
          <br />
          <span>Right Around You.</span>
        </h1>
        <p>
          Book trusted professionals for your home, learning, fitness and more —
          in just a few taps.
        </p>

        {/* <form className="lk-hero-search-bar" onSubmit={handleSearch}>
          <MapPin size={18} className="lk-hero-search-icon" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location"
          />
          <button type="button" className="lk-hero-locate-btn" aria-label="Use current location">
            <LocateFixed size={16} />
          </button>
          <button type="submit" className="lk-hero-search-btn">
            Search Services
          </button>
        </form> */}

        <div className="lk-hero-trusted">
          <div className="lk-hero-trusted-avatars">
            {trustedAvatars.map((src, i) => (
              <img key={i} src={src} alt="" />
            ))}
            <span className="lk-hero-trusted-count">10K+</span>
          </div>
          <span>Trusted by 10,000+ happy customers</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;