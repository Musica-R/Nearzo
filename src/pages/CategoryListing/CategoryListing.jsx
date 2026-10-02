// CategoryListing.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import LocationBar from "../../components/LocationBar/LocationBar";
import { fetchProvidersByCategory, getProviderCategoryName } from "../../api/lokalApi";
import VendorCard from "../../components/VendorCard/VendorCard";
import "./CategoryListing.css";

const PER_PAGE = 12;

const CategoryListing = () => {
  const { type = "vendor", categoryId } = useParams(); // type: "vendor" | "activity"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  // Kept separately so the title doesn't vanish when a location filter
  // returns zero providers.
  const [categoryName, setCategoryName] = useState("");

  // Primitive copies of the filter, so we only refetch on a real change.
  const cityId = location?.cityId ?? null;
  const latitude = location?.latitude ?? null;
  const longitude = location?.longitude ?? null;
  const radius = location?.radius ?? null;

  // New category -> reset page + title. Location change -> back to page 1.
  useEffect(() => {
    setPage(1);
    setCategoryName("");
  }, [type, categoryId]);

  useEffect(() => {
    setPage(1);
  }, [cityId, latitude, longitude, radius]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProvidersByCategory(type, categoryId, {
      cityId,
      latitude,
      longitude,
      radius,
      page,
      perPage: PER_PAGE,
    })
      .then((data) => {
        if (cancelled) return;
        const list = data || [];
        setItems(list);
        setLastPage(data?.meta?.lastPage || 1);
        if (list[0]) {
          const name = getProviderCategoryName(list[0]);
          if (name) setCategoryName(name);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this category right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [type, categoryId, cityId, latitude, longitude, radius, page]);

  const filterActive = cityId != null || (latitude != null && longitude != null);

  return (
    <div className="lk-category section lk-container">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <ChevronRight size={13} />
        <span>{categoryName || "Category"}</span>
      </div>

      <h2 className="lk-category-title">{categoryName || "Providers"}</h2>

      <div className="lk-category-toolbar">
        <LocationBar onChange={setLocation} />
      </div>

      {loading && (
        <div className="lk-vendor-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="lk-service-skeleton" aria-hidden="true" />
          ))}
        </div>
      )}

      {!loading && error && <p className="lk-text-muted">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="lk-text-muted">
          {filterActive
            ? "No providers found in this category for the selected location. Try a bigger radius or another city."
            : "No providers found in this category yet."}
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="lk-vendor-grid">
            {items.map((raw) => (
              <VendorCard key={raw.id} raw={raw} type={type} categoryId={categoryId} />
            ))}
          </div>

          {lastPage > 1 && (
            <div className="lk-category-pagination">
              <button
                type="button"
                className="lk-category-pagination-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="lk-text-muted">
                Page {page} of {lastPage}
              </span>
              <button
                type="button"
                className="lk-category-pagination-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= lastPage || loading}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryListing;