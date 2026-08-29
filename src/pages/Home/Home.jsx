import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as Icons from "lucide-react";
import { ShieldCheck, Zap, Lock, Headphones } from "lucide-react";
import Hero from "../../components/Hero/Hero";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import VendorCard from "../../components/VendorCard/VendorCard";
import { getCategories } from "../../redux/slices/categorySlice";
import {
  fetchAllCategories,
  fetchNearStalls,
  fetchVendors,
  normalizeProvider,
  mapApiCategory,
  groupCategoriesByGroup,
  interleaveCategories,
} from "../../api/lokalApi";
import "./Home.css";

import homeServicesImg from "../../assets/ser.png";
import learningImg from "../../assets/learn.png";
import fitnessImg from "../../assets/gyms.png";
import shopImg from "../../assets/near.png";

import offerCleaningImg from "../../assets/home.png";
import offerFitnessImg from "../../assets/fit.png";
import offerFirstOrderImg from "../../assets/offer.png";
import megaDealImg from "../../assets/mega1.png";


const GROUP_ORDER = ["home-services", "learning-training", "sports-fitness", "nearby-shop"];

const GROUP_META = {
  "home-services": {
    title: "Home Services",
    tagline: "Trusted help for everyday home needs",
    icon: "Home",
    tint: "#F1EAFB",
    iconColor: "#7C3AED",
    image: homeServicesImg,
  },
  "learning-training": {
    title: "Learning & Training",
    tagline: "Skill up with expert-led classes nearby",
    icon: "GraduationCap",
    tint: "#FDEBD8",
    iconColor: "#E07B1D",
    image: learningImg,
  },
  "sports-fitness": {
    title: "Sports & Fitness",
    tagline: "Stay active with trainers & studios near you",
    icon: "Dumbbell",
    tint: "#DDF2E4",
    iconColor: "#1AA260",
    image: fitnessImg,
  },
  "nearby-shop": {
    title: "Nearby Shop",
    tagline: "Stalls and shops just around the corner",
    icon: "Store",
    tint: "#DCEBFB",
    iconColor: "#2E7FE0",
    image: shopImg,
  },
};

const exclusiveOffers = [
  {
    code: "CLEAN20",
    badge: "20% OFF",
    badgeBg: "#F1EAFB",
    badgeColor: "#5B21B6",
    title: "Home Cleaning Services",
    description: "On all home cleaning bookings",
    image: offerCleaningImg,
  },
  {
    code: "FIT15",
    badge: "UP TO 15% OFF",
    badgeBg: "#FDEBD8",
    badgeColor: "#B9631A",
    title: "Fitness Sessions",
    description: "Get up to 15% off on personal training",
    image: offerFitnessImg,
  },
  {
    code: "FIRST10",
    badge: "10% OFF",
    badgeBg: "#DDF2E4",
    badgeColor: "#217A46",
    title: "First Order Offer",
    description: "On your first booking with us",
    image: offerFirstOrderImg,
  },
];

const trustBadges = [
  { Icon: ShieldCheck, title: "Verified Professionals", description: "All service providers are background verified" },
  { Icon: Zap, title: "Instant Booking", description: "Book services in just a few taps" },
  { Icon: Lock, title: "Trusted Professionals", description: "Find reliable professionals for your needs" },
  { Icon: Headphones, title: "24/7 Support", description: "We're here to help you anytime" },
];

// nearby-shop has no category endpoint — its homepage content comes from
// the live near-stalls-all feed (see "Near You" below) instead.
const SERVICE_GROUPS = GROUP_ORDER.filter((g) => g !== "nearby-shop");

const Home = () => {
  const dispatch = useDispatch();

  const [categoriesByGroup, setCategoriesByGroup] = useState({});
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const [nearStalls, setNearStalls] = useState([]);
  const [stallsLoading, setStallsLoading] = useState(true);

  const [topVendors, setTopVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Explore Popular Categories + per-group listings — both live from
  // get_Categories_bytype via fetchAllCategories. No static file involved.
  useEffect(() => {
    let ignore = false;
    setCategoriesLoading(true);
    setCategoriesError(null);

    fetchAllCategories()
      .then((data) => {
        if (ignore) return;
        setCategoriesByGroup(groupCategoriesByGroup(data.map(mapApiCategory)));
      })
      .catch((err) => {
        if (ignore) return;
        setCategoriesError(err.message || "Failed to load categories");
      })
      .finally(() => {
        if (!ignore) setCategoriesLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Near You — live from /near-stalls-all, capped to 6 results.
  useEffect(() => {
    let ignore = false;
    setStallsLoading(true);

    fetchNearStalls({ perPage: 6 })
      .then((data) => {
        if (ignore) return;
        setNearStalls((data || []).slice(0, 6).map((raw) => normalizeProvider(raw, "stall")));
      })
      .catch(() => {
        if (!ignore) setNearStalls([]);
      })
      .finally(() => {
        if (!ignore) setStallsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Top Rated Providers — live from /all-vendors, capped to 4 shown.
  useEffect(() => {
    let ignore = false;
    setVendorsLoading(true);

    fetchVendors({ perPage: 8 })
      .then((data) => {
        if (ignore) return;
        setTopVendors((data || []).slice(0, 8).map((raw) => normalizeProvider(raw, "vendor")));
      })
      .catch(() => {
        if (!ignore) setTopVendors([]);
      })
      .finally(() => {
        if (!ignore) setVendorsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Mixes categories across all 3 groups (round-robin) so the bento grid
  // isn't dominated by whichever type the API returns first.
  const exploreCategories = useMemo(
    () => interleaveCategories(categoriesByGroup, SERVICE_GROUPS, 11),
    [categoriesByGroup]
  );

  return (
    <div className="lk-home">
      {/* ---------- Hero + Top Categories ---------- */}
      <div className="lk-hero-row">
        <div className="lk-container lk-hero-grid">
          <Hero />

          <aside className="lk-top-categories">
            <div className="lk-section-header-inline">
              <h4>Top Categories</h4>
              <Link to="/vendors" className="lk-view-all-link">
                View all <Icons.ArrowRight size={15} />
              </Link>
            </div>

            <div className="lk-top-category-grid">
              {GROUP_ORDER.map((groupId) => {
                const meta = GROUP_META[groupId];
                const Icon = Icons[meta.icon] || Icons.Grid;
                return (
                  <Link
                    key={groupId}
                    to={`/service?group=${groupId}`}
                    className="lk-top-category-tile"
                    style={{ background: meta.tint }}
                  >
                    <div className="lk-top-category-tile-body">
                      <span className="lk-top-category-tile-icon" style={{ color: meta.iconColor }}>
                        <Icon size={17} />
                      </span>
                      <h5>{meta.title}</h5>
                      <p>{meta.tagline}</p>
                    </div>
                    <div
                      className="lk-top-category-tile-media"
                      style={{ backgroundImage: meta.image ? `url(${meta.image})` : undefined }}
                    >
                      {/* <span className="lk-top-category-tile-arrow">
                        <Icons.ArrowRight size={16} />
                      </span> */}
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>

      {/* ---------- Exclusive Offers ---------- */}
      <section className="lk-section-tight">
        <div className="lk-container">
          <div className="lk-section-header-inline">
            <h3>Exclusive Offers For You</h3>
            <Link to="/vendors" className="lk-view-all-link">
              View all <Icons.ArrowRight size={15} />
            </Link>
          </div>

          <div className="lk-offers-row">
            <button className="lk-offers-nav" aria-label="Previous offers" type="button">
              <Icons.ChevronLeft size={18} />
            </button>

            <div className="lk-offers-grid">
              {exclusiveOffers.map((offer) => (
                <div key={offer.code} className="lk-offer-card">
                  <div
                    className="lk-offer-card-media"
                    style={{ backgroundImage: offer.image ? `url(${offer.image})` : undefined }}
                  >
                    <span className="lk-offer-card-badge" style={{ background: offer.badgeBg, color: offer.badgeColor }}>
                      {offer.badge}
                    </span>
                  </div>
                  <div className="lk-offer-card-body">
                    <h5>{offer.title}</h5>
                    <p>{offer.description}</p>
                    {/* <span className="lk-offer-card-code">Code: {offer.code}</span> */}
                  </div>
                </div>
              ))}
            </div>

            <button className="lk-offers-nav" aria-label="Next offers" type="button">
              <Icons.ChevronRight size={18} />
            </button>

            <div className="lk-mega-deal-panel">
              <div className="lk-mega-deal-content">
                {/* <span className="lk-mega-deal-chip">Flat 25% OFF</span> */}
                {/* <Link to="/service?group=home-services" className="lk-btn lk-btn-white">
                  Book Now <Icons.ArrowRight size={15} />
                </Link> */}
              </div>
              {megaDealImg && <img src={megaDealImg} alt="Plumbing professional" className="lk-mega-deal-image" />}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Trust badges ---------- */}
      <section className="lk-section-tight">
        <div className="lk-container lk-trust-badges-row">
          {trustBadges.map(({ Icon, title, description }) => (
            <div className="lk-trust-badge" key={title}>
              <span className="lk-trust-badge-icon">
                <Icon size={20} />
              </span>
              <div>
                <strong>{title}</strong>
                <span>{description}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Per-group service listings — live API data ---------- */}
      {SERVICE_GROUPS.map((groupId) => {
        const meta = GROUP_META[groupId];
        const items = categoriesByGroup[groupId] || [];
        if (!categoriesLoading && items.length === 0) return null;

        return (
          <section className="lk-section" key={groupId}>
            <div className="lk-container">
              <SectionHeader title={meta.title} subtitle={meta.tagline} linkTo={`/service?group=${groupId}`} />
              <div className="lk-service-grid">
                {categoriesLoading
                  ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="lk-service-skeleton" aria-hidden="true" />)
                  : items.slice(0, 6).map((item) => <ServiceCard key={item.id} item={item} />)}
              </div>
            </div>
          </section>
        );
      })}

      {/* <HowItWorks /> */}

      {/* ---------- Near You — live from /near-stalls-all, capped at 6 ---------- */}
      {!stallsLoading && nearStalls.length > 0 && (
        <section className="lk-section">
          <div className="lk-container">
            <SectionHeader
              eyebrow="Nearby"
              title="Near You"
              subtitle="Stalls and shops close to your location."
              linkTo="/service?group=nearby-shop"
            />
            <div className="lk-vendor-grid">
              {nearStalls.map((stall) => (
                <VendorCard key={stall.id} vendor={stall} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Top Rated Providers — live from /all-vendors ---------- */}
      <section className="lk-section">
        <div className="lk-container">
          <SectionHeader
            eyebrow="Handpicked"
            title="Top Rated Providers"
            subtitle="Loved and reviewed by people in your area."
            linkTo="/service"
          />
          <div className="lk-vendor-grid">
            {vendorsLoading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="lk-service-skeleton" aria-hidden="true" />)
              : topVendors.slice(0, 4).map((vendor) => <VendorCard key={vendor.id} vendor={vendor} />)}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;