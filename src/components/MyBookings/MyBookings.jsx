import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  RotateCcw,
  Star,
} from "lucide-react";
import { fetchBookings } from "../../utils/booking";
import RatingPopup from "../popups/RatingPopup";
import "./MyBookings.css";

const PER_PAGE = 3;

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const vendorName = (vd = {}) => vd.business_name || vd.shop_center_name || vd.full_name || "Vendor";

// Rebook -> the same vendor page:  /vendor/:type/:categoryId/:vendorId
const rebookPath = (b) => {
  const vd = b.vendor_details;
  if (!vd?.id || !vd?.category_id) return null;
  const routeType = b.type === "Activity" ? "activity" : "vendor";
  return `/vendor/${routeType}/${vd.category_id}/${vd.id}`;
};

const formatDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const MyBookings = ({ userId, title = "My Bookings" }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  // Booking currently being rated (null = popup closed)
  const [ratingFor, setRatingFor] = useState(null);

  // Called by the popup after the API accepts the rating: update the card
  // straight away. Matching on vendor_id because /booking-rating takes
  // (user_id, vendor_id, rating) and no booking id.
  const handleRated = (vendorId, value) => {
    setBookings((list) =>
      list.map((b) => (String(b.vendor_id) === String(vendorId) ? { ...b, rating: String(value) } : b))
    );
  };

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchBookings(userId)
      .then((list) => {
        if (cancelled) return;
        // newest first
        setBookings([...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        setPage(1);
      })
      .catch((err) => !cancelled && setError(err.message || "Couldn't load your bookings."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const totalPages = Math.max(1, Math.ceil(bookings.length / PER_PAGE));
  const visible = bookings.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <section className="mb-card">
      <div className="mb-head">
        <h3>
          <CalendarCheck size={18} /> {title}
        </h3>
        {bookings.length > 0 && <span className="mb-count">{bookings.length} total</span>}
      </div>

      {loading && (
        <p className="mb-state">
          <Loader2 size={16} className="mb-spin" /> Loading bookings…
        </p>
      )}

      {!loading && error && <p className="mb-state mb-state-err">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div className="mb-empty">
          <CalendarClock size={34} />
          <p>No bookings yet.</p>
          <Link to="/service" className="btn btn-primary">
            Browse Services
          </Link>
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <ul className="mb-list">
          {visible.map((b) => {
            const vd = b.vendor_details || {};
            const name = vendorName(vd);
            const category = vd.category?.name || vd.category_name || b.type;
            const address = [vd.address_line1, vd.city?.name || vd.city_name].filter(Boolean).join(", ");
            const to = rebookPath(b);
            const status = String(b.status || "pending").toLowerCase();
            const ratingValue = Number(b.rating) || 0;

            return (
              <li className="mb-item" key={b.id}>
                {vd.profile_photo ? (
                  <img className="mb-photo" src={vd.profile_photo} alt={name} />
                ) : (
                  <div className="mb-photo mb-photo-fallback">{getInitials(name)}</div>
                )}

                <div className="mb-info">
                  <div className="mb-title-row">
                    <strong className="mb-name">{name}</strong>
                    <span className={`mb-status mb-status-${status}`}>{status}</span>
                  </div>
                  <span className="mb-category">
                    {category} · {b.type}
                  </span>
                  <span className="mb-meta">
                    <CalendarClock size={13} /> {formatDate(b.created_at)}
                  </span>
                  {address && (
                    <span className="mb-meta mb-address">
                      <MapPin size={13} /> {address}
                    </span>
                  )}
                  {ratingValue > 0 && (
                    <span className="mb-rating" aria-label={`Rated ${ratingValue} out of 5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={14} fill={n <= Math.round(ratingValue) ? "currentColor" : "none"} />
                      ))}
                      <span className="mb-rating-num">{ratingValue.toFixed(1)}</span>
                    </span>
                  )}
                </div>

                <div className="mb-actions">
                  {b.vendor_id && (
                    <button
                      type="button"
                      className="mb-rate"
                      onClick={() => setRatingFor({ vendorId: b.vendor_id, name, initial: ratingValue })}
                    >
                      <Star size={14} /> {ratingValue > 0 ? "Edit rating" : "Rate"}
                    </button>
                  )}
                  {to && (
                    <Link to={to} className="mb-rebook">
                      <RotateCcw size={14} /> Rebook
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="mb-pager">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft size={16} /> Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      <RatingPopup
        open={Boolean(ratingFor)}
        onClose={() => setRatingFor(null)}
        userId={userId}
        vendorId={ratingFor?.vendorId}
        vendorName={ratingFor?.name}
        initial={ratingFor?.initial}
        onSuccess={(value) => handleRated(ratingFor?.vendorId, value)}
      />
    </section>
  );
};

export default MyBookings;