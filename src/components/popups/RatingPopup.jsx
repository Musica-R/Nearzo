import { useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { submitRating } from "../../utils/booking";
import Modal from "./Modal";
import "./RatingPopup.css";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/**
 * Star-rating popup for a booking.
 *   open       - show / hide
 *   onClose    - called on X, backdrop, Esc or Cancel
 *   userId     - logged-in user's id
 *   vendorId   - booking.vendor_id
 *   vendorName - shown in the heading
 *   initial    - existing rating (number) if the booking was already rated
 *   onSuccess  - called with the saved rating (number) after the API succeeds
 */
const RatingPopup = ({ open, onClose, userId, vendorId, vendorName, initial = 0, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Every time the popup opens, start from the saved rating (or empty).
  useEffect(() => {
    if (open) {
      setRating(Math.round(Number(initial)) || 0);
      setHover(0);
      setError("");
      setSubmitting(false);
    }
  }, [open, initial]);

  const shown = hover || rating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Please tap a star to choose your rating.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitRating({ userId, vendorId, rating });
      onSuccess?.(rating);
      onClose?.();
    } catch (err) {
      setError(err.message || "Couldn't submit your rating. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={submitting ? undefined : onClose} labelledBy="rp-title">
      <form className="pp-form" onSubmit={handleSubmit}>
        <div className="pp-scroll">
          <h2 id="rp-title" className="pp-title">Rate your experience</h2>
          <p className="pp-sub">
            How was <strong>{vendorName || "this vendor"}</strong>?
          </p>

          <div className="rp-stars" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                className={`rp-star ${n <= shown ? "is-on" : ""}`}
                onMouseEnter={() => setHover(n)}
                onFocus={() => setHover(n)}
                onBlur={() => setHover(0)}
                onClick={() => setRating(n)}
                disabled={submitting}
              >
                <Star size={38} fill={n <= shown ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <p className="rp-label">{shown ? LABELS[shown] : "Tap a star"}</p>

          {error && <p className="pp-error">{error}</p>}
        </div>

        <div className="pp-footer">
          <button type="submit" className="pp-btn pp-btn-primary" disabled={submitting || !rating}>
            {submitting ? (
              <>
                <Loader2 size={15} className="rp-spin" /> Submitting…
              </>
            ) : (
              "Submit rating"
            )}
          </button>
          <button type="button" className="pp-btn pp-btn-outline" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RatingPopup;