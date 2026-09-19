import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as Icons from "lucide-react";
import { ShieldCheck, Zap, Lock, Headphones } from "lucide-react";
import Hero from "../../components/Hero/Hero";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import VendorCard from "../../components/VendorCard/VendorCard";
import JobCard from "../../components/JobCard/JobCard";
import { getCategories } from "../../redux/slices/categorySlice";
import {
  fetchAllCategories,
  fetchNearStalls,
  fetchVendors,
  fetchJobs,
  normalizeProvider,
  normalizeJob,
  mapApiCategory,
  groupCategoriesByGroup,
  interleaveCategories,
} from "../../api/lokalApi";
import "./Home.css";

import homeServicesImg from "../../assets/ser.png";
import learningImg from "../../assets/learn.png";
import fitnessImg from "../../assets/gyms.png";
import shopImg from "../../assets/near.png";
import careerImg from "../../assets/job.png";

import offerCleaningImg from "../../assets/home.png";
import offerFitnessImg from "../../assets/fit.png";
import offerFirstOrderImg from "../../assets/offer.png";
import megaDealImg from "../../assets/mega1.png";


const GROUP_ORDER = ["home-services", "learning-training", "sports-fitness", "nearby-shop", "career-opportunities"];

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
  "career-opportunities": {
    title: "Career Opportunities",
    tagline: "Explore jobs, internships and career opportunities near you",
    icon: "Briefcase",
    tint: "#EDE7FB",
    iconColor: "#6D28D9",
    image: careerImg,
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

// Quick "why choose us" stats that fill the leftover space under the Hero,
// left of the Top Categories column.
const heroHighlightStats = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "500+", label: "Verified Vendors" },
  { value: "5", label: "Service Categories" },
  { value: "4.8★", label: "Average Rating" },
];

// nearby-shop has no category endpoint — its homepage content comes from
// the live near-stalls-all feed (see "Near You" below) instead.
const SERVICE_GROUPS = GROUP_ORDER.filter((g) => g !== "nearby-shop" && g !== "career-opportunities");

// How far each arrow-click scrolls the row, in px.
const SCROLL_STEP = 640;

const Home = () => {
  const dispatch = useDispatch();

  const [categoriesByGroup, setCategoriesByGroup] = useState({});
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const [nearStalls, setNearStalls] = useState([]);
  const [stallsLoading, setStallsLoading] = useState(true);

  const [topVendors, setTopVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);

  // Latest Job Openings — live from /jobs, capped to 6.
  const [latestJobs, setLatestJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  // One scroll ref per group, so each row's arrows scroll only that row.
  const scrollRefs = useRef({});
  const getScrollRef = (groupId) => {
    if (!scrollRefs.current[groupId]) {
      scrollRefs.current[groupId] = { current: null };
    }
    return scrollRefs.current[groupId];
  };
  const scrollGroup = (groupId, direction) => {
    const el = scrollRefs.current[groupId]?.current;
    if (!el) return;
    el.scrollBy({ left: direction * SCROLL_STEP, behavior: "smooth" });
  };

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

  // Latest Job Openings — live from /jobs, capped to 6.
  useEffect(() => {
    let ignore = false;
    setJobsLoading(true);

    fetchJobs({ perPage: 6 })
      .then((data) => {
        if (ignore) return;
        setLatestJobs((data || []).slice(0, 6).map(normalizeJob));
      })
      .catch(() => {
        if (!ignore) setLatestJobs([]);
      })
      .finally(() => {
        if (!ignore) setJobsLoading(false);
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
          <div className="lk-hero-left">
            <Hero />

            {/* Fills the leftover space under the Hero so it lines up with
                the taller Top Categories column on the right. */}
            <div className="lk-hero-highlights">
              <div className="lk-hero-highlights-text">
                <h4>Why Choose Lokal?</h4>
                <p>
                Your trusted platform for finding verified professionals across home services, learning, fitness, sports, jobs, 
                and local services. Discover the right professionals near you, explore their services — all in one place.

                </p>
              </div>
              <div className="lk-hero-highlights-stats">
                {heroHighlightStats.map((stat) => (
                  <div className="lk-hero-stat" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                    to={groupId === "career-opportunities" ? "/careers" : `/service?group=${groupId}`}
                    className={`lk-top-category-tile${groupId === "career-opportunities" ? " lk-top-category-tile-wide" : ""}`}
                    style={{ background: meta.tint }}
                  >
                    <div className="lk-top-category-tile-body">
                      <span className="lk-top-category-tile-icon" style={{ color: meta.iconColor }}>
                        <Icon size={17} />
                      </span>
                      <h5>{meta.title}</h5>
                      <p>{meta.tagline}</p>
                    </div>
                    {groupId === "career-opportunities" ? (
                      <div className="lk-top-category-tile-media lk-top-category-tile-media-img">
                        <img src={meta.image} alt={meta.title} />
                      </div>
                    ) : (
                      <div
                        className="lk-top-category-tile-media"
                        style={{ backgroundImage: meta.image ? `url(${meta.image})` : undefined }}
                      >
                        {/* <span className="lk-top-category-tile-arrow">
                          <Icons.ArrowRight size={16} />
                        </span> */}
                      </div>
                    )}
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

      {/* ---------- Per-group service listings — live API data, horizontally scrollable, shows ALL items ---------- */}
      {SERVICE_GROUPS.map((groupId) => {
        const meta = GROUP_META[groupId];
        const items = categoriesByGroup[groupId] || [];
        if (!categoriesLoading && items.length === 0) return null;

        const scrollRef = getScrollRef(groupId);

        return (
          <section className="lk-section" key={groupId}>
            <div className="lk-container">
              <SectionHeader title={meta.title} subtitle={meta.tagline} linkTo={`/service?group=${groupId}`} />

              <div className="lk-service-scroll-row">
                <button
                  className="lk-service-scroll-nav lk-service-scroll-nav-left"
                  aria-label={`Scroll ${meta.title} left`}
                  type="button"
                  onClick={() => scrollGroup(groupId, -1)}
                >
                  <Icons.ChevronLeft size={18} />
                </button>

                <div className="lk-service-grid-scroll" ref={(el) => (scrollRef.current = el)}>
                  {categoriesLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="lk-service-skeleton" aria-hidden="true" />
                    ))
                    : items.map((item) => <ServiceCard key={item.id} item={item} />)}
                </div>

                <button
                  className="lk-service-scroll-nav lk-service-scroll-nav-right"
                  aria-label={`Scroll ${meta.title} right`}
                  type="button"
                  onClick={() => scrollGroup(groupId, 1)}
                >
                  <Icons.ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>
        );
      })}

      {/* <HowItWorks /> */}

      {/* ---------- Near You — live from /near-stalls-all, capped at 6 (unchanged) ---------- */}
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

      {/* ---------- Latest Job Openings — live from /jobs, capped at 6 ---------- */}
      {(jobsLoading || latestJobs.length > 0) && (
        <section className="lk-section">
          <div className="lk-container">
            <SectionHeader
              eyebrow="Careers"
              title="Latest Job Openings"
              subtitle="Fresh opportunities from companies near you."
              linkTo="/careers"
            />
            <div className="lk-job-grid">
              {jobsLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="lk-service-skeleton" aria-hidden="true" />
                ))
                : latestJobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Top Rated Providers — live from /all-vendors (unchanged) ---------- */}
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