import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import "./Hero.css";

const trustedAvatars = [
  "/assets/pro1.jpg",
  "/assets/pro2.jpg",
  "/assets/pro3.jpg",
  "/assets/pro4.jpg",
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
          src="/assets/nearzo2.webp"
          alt="Professional cleaner at work"
          className="lk-hero-image"
          fetchPriority="high"
        />

        {/* floating rating card, overlapping the photo's bottom edge */}
        <div className="lk-hero-rating-card">
          <img
            src="/assets/pro5.jpg"
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