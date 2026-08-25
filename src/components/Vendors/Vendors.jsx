import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Loader2,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  Radar,
  Filter,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import LocationBar from "../../components/LocationBar/LocationBar";
import CategorySidebar from "../../components/CategorySidebar/CategorySidebar";
import {
  fetchVendors,
  searchVendors,
  fetchCategoriesByType,
  normalizeProvider,
  hasLocationFilter,
  formatPrice,
} from "../../api/lokalApi";

import "./Vendors.css";

const PER_PAGE = 20;

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance"); // "relevance" | "rating" | "price"
  const [page, setPage] = useState(1);
  const [pageMeta, setPageMeta] = useState({ lastPage: 1, total: 0 });

  useEffect(() => {
    fetchCategoriesByType("Home Services").then(setCategories).catch(() => setCategories([]));
  }, []);

  // Any time the location filter changes, start back at page 1.
  useEffect(() => {
    setPage(1);
  }, [location]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const fetcher = hasLocationFilter(location) ? searchVendors : fetchVendors;
    fetcher({
      cityId: location?.cityId,
      latitude: location?.latitude,
      longitude: location?.longitude,
      radius: location?.radius,
      page,
      perPage: PER_PAGE,
    })
      .then((data) => {
        if (cancelled) return;
        setVendors(data.map((raw) => normalizeProvider(raw, "vendor")));
        setPageMeta({
          lastPage: data.meta?.lastPage || 1,
          total: data.meta?.total ?? data.length,
        });
        setError(null);
      })
      .catch(() => !cancelled && setError("Couldn't load vendors right now."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [location, page]);

  const counts = useMemo(() => {
    const map = {};
    vendors.forEach((v) => {
      if (v.category) map[v.category] = (map[v.category] || 0) + 1;
    });
    return map;
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    let items = vendors;

    if (activeCategoryId) {
      const activeCategory = categories.find((c) => c.id === activeCategoryId);
      if (activeCategory) items = items.filter((v) => v.category === activeCategory.name);
    }

    if (topRatedOnly) {
      items = items.filter((v) => Number(v.rating) >= 4.5);
    }

    if (sortBy === "rating") {
      items = [...items].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === "price") {
      items = [...items].sort((a, b) => (Number(a.price) || Infinity) - (Number(b.price) || Infinity));
    }

    return items;
  }, [vendors, activeCategoryId, categories, topRatedOnly, sortBy]);

  const radiusLabel = location?.radius ? `Within ${location.radius} km` : "Within 25 km";
  const sortLabel =
    sortBy === "rating" ? "Sort by: Rating" : sortBy === "price" ? "Sort by: Price" : "Sort by: Relevance";

  const cycleSort = () => {
    setSortBy((s) => (s === "relevance" ? "rating" : s === "rating" ? "price" : "relevance"));
  };

  return (
    <div className="section nearby-page">
      <div className="con">
        <SectionHeader
          eyebrow="Browse"
          title="All Vendors"
          subtitle="Verified vendors across every category, in one place."
        />

        <div className="nearby-toolbar">
          <LocationBar onChange={setLocation} />
        </div>

        <div className="vendors-filter-row">
          <div className="vendors-filter-pills">
            <button className="filter-pill">
              <SlidersHorizontal size={14} /> All Filters
            </button>
            <button className="filter-pill" onClick={cycleSort}>
              <ArrowUpDown size={14} /> {sortLabel}
            </button>
            <button
              className={`filter-pill ${topRatedOnly ? "active" : ""}`}
              onClick={() => setTopRatedOnly((v) => !v)}
            >
              <Star size={14} /> Top Rated
            </button>
            <button className="filter-pill">
              <Radar size={14} /> {radiusLabel}
            </button>
            <button className="filter-pill filter-pill-more">
              <Filter size={14} /> More Filters
            </button>
          </div>

        </div>

        <p className="vendors-results-count">
          {loading ? "Searching..." : `${filteredVendors.length} result${filteredVendors.length === 1 ? "" : "s"} found`}
        </p>

        <div className="nearby-page-layout">
          <CategorySidebar
            categories={categories}
            activeId={activeCategoryId}
            onSelect={setActiveCategoryId}
            counts={counts}
          />

          <div className="nearby-page-main">
            {loading && (
              <p className="text-muted">
                <Loader2 className="spin" size={16} /> Loading vendors...
              </p>
            )}
            {!loading && error && <p className="text-muted">{error}</p>}
            {!loading && !error && filteredVendors.length === 0 && (
              <p className="text-muted">No vendors listed yet.</p>
            )}

            {!loading && !error && filteredVendors.length > 0 && (
              <div className="vendors-grid">
                {filteredVendors.map((v) => (
                  <Link to={`/provider/vendor/${v.id}`} className="vendor-card" key={v.id}>
                    <div className="vendor-card-photo">
                      <img src={v.photo} alt={v.name} loading="lazy" />
                      {v.rating != null && (
                        <span className="vendor-card-rating">
                          <Star size={12} fill="currentColor" /> {Number(v.rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="vendor-card-body">
                      {v.subtitle && <span className="vendor-card-eyebrow">{v.subtitle}</span>}
                      <h4>{v.shopName || v.name}</h4>
                      <p className="vendor-card-loc">
                        <MapPin size={12} /> {v.addressLine1} {v.addressLine2} {v.city}
                      </p>
                      {v.subcategories?.length > 0 && (
                        <div className="vendor-card-tags">
                          {v.subcategories.slice(0, 4).map((s) => (
                            <span key={s} className="vendor-card-tag">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="vendor-card-footer">
                        <span className="vendor-card-price">
                          {formatPrice(v.price) || "Contact for price"}
                        </span>
                        <span className="vendor-card-cta">
                          View Details <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && !error && filteredVendors.length > 0 && (
              <div className="nearby-pagination">
                <button
                  type="button"
                  className="nearby-pagination-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span className="text-muted nearby-pagination-page">
                  Page {page}{pageMeta.lastPage > 1 ? ` of ${pageMeta.lastPage}` : ""}
                </span>
                <button
                  type="button"
                  className="nearby-pagination-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pageMeta.lastPage || loading}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vendors;