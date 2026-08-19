// CategoryListing.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { fetchProvidersByCategory, getProviderCategoryName } from "../../api/lokalApi";
import VendorCard from "../../components/VendorCard/VendorCard";
import "./CategoryListing.css";

const CategoryListing = () => {
  const { type = "vendor", categoryId } = useParams(); // type: "vendor" | "activity"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProvidersByCategory(type, categoryId)
      .then((data) => {
        if (!cancelled) setItems(data || []);
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
  }, [type, categoryId]);

  const categoryName = items[0] ? getProviderCategoryName(items[0]) : "";

  return (
    <div className="lk-category section lk-container">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <ChevronRight size={13} />
        <span>{categoryName || "Category"}</span>
      </div>

      <h2 className="lk-category-title">{categoryName || "Providers"}</h2>

      {loading && (
        <div className="lk-vendor-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="lk-service-skeleton" aria-hidden="true" />
          ))}
        </div>
      )}

      {!loading && error && <p className="lk-text-muted">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="lk-text-muted">No providers found in this category yet.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="lk-vendor-grid">
          {items.map((raw) => (
            <VendorCard key={raw.id} raw={raw} type={type} categoryId={categoryId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryListing;