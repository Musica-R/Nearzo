import { Link } from "react-router-dom";
import { Star, MapPin, ShieldCheck } from "lucide-react";
import {
  getProviderName,
  getProviderCity,
  getProviderCategoryName,
  formatCurrency,
  getInitials,
} from "../../api/lokalApi";
import "./VendorCard.css";

// Accepts either:
//  - `raw` + `type` + `categoryId` (category-detail API shape, from CategoryListing)
//  - `vendor` (already-normalized shape, from Home.jsx's near-stalls/top-vendors)
const VendorCard = ({ raw, type, categoryId, vendor }) => {
  const isRaw = Boolean(raw);

  const name = isRaw ? getProviderName(raw) : vendor.name || vendor.shopName;
  const city = isRaw ? getProviderCity(raw) : vendor.city;
  const categoryLabel = isRaw ? getProviderCategoryName(raw) : vendor.category || vendor.subtitle || "Service";
  const price = isRaw ? formatCurrency(raw.price) : vendor.price;
  const rating = isRaw ? raw.rating ?? raw.avg_rating ?? null : vendor.rating;
  const photo = isRaw ? raw.profile_photo || raw.shop_photo : vendor.photo;
  const id = isRaw ? raw.id : vendor.id;

  // Vendors & activities have a category-detail endpoint, so they get the
  // full VendorProfile page. Stalls (and anything missing a categoryId)
  // fall back to the generic ProviderProfile page.
  let linkTo;
  if (isRaw) {
    linkTo = `/vendor/${type}/${categoryId}/${id}`;
  } else if ((vendor.type === "vendor" || vendor.type === "activity") && vendor.categoryId) {
    linkTo = `/vendor/${vendor.type}/${vendor.categoryId}/${id}`;
  } else {
    linkTo = `/provider/${vendor.type}/${id}`;
  }

  return (
    <Link to={linkTo} className="lk-vendor-card">
      <div className="lk-vendor-card-media">
        {photo ? (
          <img src={photo} alt={name} loading="lazy" />
        ) : (
          <div className="lk-vendor-card-avatar-fallback">{getInitials(name)}</div>
        )}
        {raw?.verified && (
          <span className="lk-vendor-card-badge">
            <ShieldCheck size={12} /> Verified
          </span>
        )}
      </div>
      <div className="lk-vendor-card-body">
        <span className="lk-vendor-card-cat">{categoryLabel}</span>
        <h4>{name}</h4>
        {city && (
          <span className="lk-vendor-card-loc">
            <MapPin size={12} /> {city}
          </span>
        )}
        <div className="lk-vendor-card-meta">
          {rating ? (
            <span className="lk-vendor-card-rating">
              <Star size={13} fill="currentColor" /> {rating}
            </span>
          ) : (
            <span />
          )}
          {price && <span className="lk-vendor-card-price">{price}</span>}
        </div>
      </div>
    </Link>
  );
};

export default VendorCard;