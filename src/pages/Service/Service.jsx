import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Loader2,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  Radar,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import LocationBar from "../../components/LocationBar/LocationBar";
import CategorySidebar from "../../components/CategorySidebar/CategorySidebar";
import {
  fetchActivities,
  searchActivities,
  fetchCategoriesByType,
  normalizeProvider,
  hasLocationFilter,
  formatPrice,
} from "../../api/lokalApi";
import "./Service.css";

const PER_PAGE = 20;

const Service = () => {
  const [query, setQuery] = useState("");
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance"); // "relevance" | "rating" | "price"
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageMeta, setPageMeta] = useState({ lastPage: 1, total: 0 });

  useEffect(() => {
    Promise.all([
      fetchCategoriesByType("Learning & Training"),
      fetchCategoriesByType("Sports & Fitness"),
    ])
      .then(([learning, sports]) => setCategories([...learning, ...sports]))
      .catch(() => setCategories([]));
  }, []);

  // Any time the location filter changes, start back at page 1.
  useEffect(() => {
    setPage(1);
  }, [location]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const fetcher = hasLocationFilter(location) ? searchActivities : fetchActivities;
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
        // Keep the raw API record alongside the normalized one so we never
        // lose fields (category id/name/type, address lines, price, etc.)
        // even if normalizeProvider doesn't map every field.
        setActivities(
          data.map((raw) => ({
            ...normalizeProvider(raw, "activity"),
            raw,
          }))
        );
        setPageMeta({
          lastPage: data.meta?.lastPage || 1,
          total: data.meta?.total ?? data.length,
        });
        setError(null);
      })
      .catch(() => !cancelled && setError("Couldn't load activities right now."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [location, page]);

  // ---- Helpers to safely pull card fields, falling back to the raw API shape ----
  const getCategoryId = (item) => item.categoryId ?? item.raw?.category_id ?? item.raw?.category?.id ?? null;
  const getCategoryName = (item) => item.subtitle || item.raw?.category?.name || "Service";
  const getCategoryType = (item) => item.categoryType || item.raw?.category?.type || "";
  const getTitle = (item) => item.shopName || item.name || item.raw?.shop_center_name || item.raw?.full_name || "Untitled";
  const getAddress = (item) => {
    const parts = [
      item.raw?.address_line1,
      item.raw?.address_line2,
      item.city || item.raw?.city?.name,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : item.addressLine1 || "Location not specified";
  };
  const getPrice = (item) => item.price ?? item.raw?.price;

  // ---- Category counts, keyed by BOTH id and name so the sidebar matches
  // regardless of which key it was built to read. This is what fixes counts
  // showing as (0) when the sidebar was written to look up counts[category.id]
  // while the old code only ever populated counts[category.name]. ----
  const counts = useMemo(() => {
    const map = {};
    activities.forEach((a) => {
      const id = getCategoryId(a);
      const name = getCategoryName(a);
      if (id != null) map[id] = (map[id] || 0) + 1;
      if (name) map[name] = (map[name] || 0) + 1;
    });
    return map;
  }, [activities]);

  const filteredItems = useMemo(() => {
    let items = activities;

    if (activeCategoryId) {
      const activeCategory = categories.find((c) => c.id === activeCategoryId);
      items = items.filter((a) => {
        const id = getCategoryId(a);
        const name = getCategoryName(a);
        return id === activeCategoryId || (activeCategory && name === activeCategory.name);
      });
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter(
        (a) =>
          getTitle(a)?.toLowerCase().includes(q) ||
          getCategoryName(a)?.toLowerCase().includes(q) ||
          getAddress(a)?.toLowerCase().includes(q)
      );
    }

    if (topRatedOnly) {
      items = items.filter((a) => Number(a.rating) >= 4.5);
    }

    if (sortBy === "rating") {
      items = [...items].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === "price") {
      items = [...items].sort(
        (a, b) => (Number(getPrice(a)) || Infinity) - (Number(getPrice(b)) || Infinity)
      );
    }

    return items;
  }, [activities, activeCategoryId, categories, query, topRatedOnly, sortBy]);

  const radiusLabel = location?.radius ? `Within ${location.radius} km` : "Within 25 km";
  const sortLabel =
    sortBy === "rating" ? "Sort by: Rating" : sortBy === "price" ? "Sort by: Price" : "Sort by: Relevance";

  const cycleSort = () => {
    setSortBy((s) => (s === "relevance" ? "rating" : s === "rating" ? "price" : "relevance"));
  };

  return (
    <div className="service-page section">
      <div className="con">
        <SectionHeader
          eyebrow="Browse"
          title="All Services"
          subtitle="Find the right category, then pick a trusted provider near you."
        />

        <div className="service-toolbar">
          <LocationBar onChange={setLocation} />
        </div>

        <div className="service-filter-row">
          <div className="service-filter-pills">
            <button className="filter-pill mobile-category-toggle" onClick={() => setMobileSidebarOpen(true)}>
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

        <p className="service-results-count">
          {loading ? "Searching..." : `${filteredItems.length} result${filteredItems.length === 1 ? "" : "s"} found`}
        </p>

        <div className="service-page-layout">
          {/* Desktop / tablet sidebar */}
          <div className="service-sidebar-wrap">
            <CategorySidebar
              categories={categories}
              activeId={activeCategoryId}
              onSelect={setActiveCategoryId}
              counts={counts}
            />
          </div>

          {/* Mobile drawer sidebar */}
          {mobileSidebarOpen && (
            <div className="service-sidebar-overlay" onClick={() => setMobileSidebarOpen(false)}>
              <div className="service-sidebar-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="service-sidebar-drawer-header">
                  <span>Categories</span>
                  <button className="service-sidebar-close" onClick={() => setMobileSidebarOpen(false)}>
                    <X size={18} />
                  </button>
                </div>
                <CategorySidebar
                  categories={categories}
                  activeId={activeCategoryId}
                  onSelect={(id) => {
                    setActiveCategoryId(id);
                    setMobileSidebarOpen(false);
                  }}
                  counts={counts}
                />
              </div>
            </div>
          )}

          <div className="service-page-main">
            {loading && (
              <p className="text-muted service-empty">
                <Loader2 className="spin" size={16} /> Loading services...
              </p>
            )}
            {!loading && error && <p className="text-muted service-empty">{error}</p>}

            {!loading && !error && filteredItems.length === 0 && (
              <p className="text-muted service-empty">No services matched "{query}". Try another keyword.</p>
            )}

            {!loading && !error && filteredItems.length > 0 && (
              <div className="service-page-grid">
                {filteredItems.map((item) => {
                  const categoryName = getCategoryName(item);
                  const categoryType = getCategoryType(item);
                  const title = getTitle(item);
                  const address = getAddress(item);
                  const price = getPrice(item);
                  // formatPrice already returns a complete label like "₹780 onwards" —
                  // don't append "onwards" again here or it duplicates ("onwards onwards").
                  const priceLabel = formatPrice ? formatPrice(price) : price ? `₹${price} onwards` : null;

                  return (
                    <Link to={`/provider/activity/${item.id}`} key={item.id} className="service-item-card">
                      <div className="service-item-photo">
                        <img src={item.photo} alt={title} loading="lazy" />
                        {item.rating != null && (
                          <span className="service-item-rating">
                            <Star size={12} fill="currentColor" /> {Number(item.rating).toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="service-item-body">
                        <span className="badge badge-new" title={categoryType || undefined}>
                          {categoryName?.toUpperCase()}
                        </span>
                        <h4>{title}</h4>
                        <p className="text-muted service-item-loc">
                          <MapPin size={12} /> <span>{address}</span>
                        </p>
                        {item.subcategories?.length > 0 && (
                          <div className="service-item-subcats">
                            {item.subcategories.map((s) => (
                              <span key={s} className="service-item-subcat">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="service-item-footer">
                          {priceLabel ? (
                            <div className="service-item-price">{priceLabel}</div>
                          ) : (
                            <span />
                          )}
                          <span className="service-item-view">
                            View Details <span aria-hidden="true">&rarr;</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {!loading && !error && filteredItems.length > 0 && (
              <div className="service-pagination">
                <button
                  type="button"
                  className="service-pagination-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span className="text-muted service-pagination-page">
                  Page {page}{pageMeta.lastPage > 1 ? ` of ${pageMeta.lastPage}` : ""}
                </span>
                <button
                  type="button"
                  className="service-pagination-btn"
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

export default Service;