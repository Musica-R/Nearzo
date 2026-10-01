import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CalendarCheck, CheckCircle2, Loader2, MessageCircle, Phone, X } from "lucide-react";
import useBooking from "../../hooks/Usebooking";
import {
  THOZHAA_WA_NUMBER,
  formatPhone,
  isBookableType,
  toIndianNumber,
  toTelHref,
} from "../../utils/booking";
import "./Booking.css";

/**
 * "Book Now" button + success popup.
 * Renders NOTHING unless bookingType is "Home Services" or "Activity".
 * Safe to place inside a <Link> card (clicks never navigate).
 *
 *   vendorUserId  listing.user_id  (the vendor's user account id)
 *   bookingType   listing.type     ("Home Services" | "Activity")
 */
const REDIRECT_MS = 2500; // popup stays this long, then WhatsApp opens

const BookNowButton = ({ vendorUserId, bookingType, name, category, phone, whatsapp, className = "" }) => {
  const { book, status, error, customer, modalOpen, closeModal } = useBooking({
    vendorUserId,
    bookingType,
  });

  // WhatsApp goes to the vendor's number (WhatsApp number, else phone), else Thozhaa
  const waTarget = toIndianNumber(whatsapp) || toIndianNumber(phone) || THOZHAA_WA_NUMBER;
  const waText =
    `Hello ${name}, this is ${customer?.name || "a customer"}.\n` +
    `I have booked your service on Thozhaa.\n\n` +
    `Customer: ${customer?.name || ""}\n` +
    `Service: ${category || bookingType} (${bookingType})\n\n` +
    `Please confirm my booking.`;
  const waHref = `https://wa.me/${waTarget}?text=${encodeURIComponent(waText)}`;
  const telHref = toTelHref(phone);

  // Esc closes the popup
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modalOpen, closeModal]);

  // After the "Booking registered" popup, go to the vendor's WhatsApp automatically.
  // (The "Continue on WhatsApp" button does the same thing immediately.)
  useEffect(() => {
    if (!modalOpen) return;
    const t = setTimeout(() => {
      window.location.href = waHref;
    }, REDIRECT_MS);
    return () => clearTimeout(t);
  }, [modalOpen, waHref]);

  if (!isBookableType(bookingType)) return null;

  const swallow = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const loading = status === "loading";
  const booked = status === "booked";

  return (
    <>
      <div className={`bk-wrap ${className}`} onClick={swallow}>
        <button type="button" className={`bk-btn ${booked ? "is-booked" : ""}`} onClick={book} disabled={loading}>
          {loading ? (
            <Loader2 size={15} className="bk-spin" />
          ) : booked ? (
            <CheckCircle2 size={15} />
          ) : (
            <CalendarCheck size={15} />
          )}
          {loading ? "Booking…" : booked ? "Booked" : "Book Now"}
        </button>
        {status === "error" && error && <p className="bk-error">{error}</p>}
      </div>

      {modalOpen &&
        createPortal(
          <div
            className="bk-overlay"
            role="presentation"
            onClick={(e) => {
              e.stopPropagation();
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <div className="bk-dialog" role="dialog" aria-modal="true" aria-labelledby="bk-title">
              <button type="button" className="bk-close" onClick={closeModal} aria-label="Close">
                <X size={18} />
              </button>

              <span className="bk-check" aria-hidden="true">
                <CheckCircle2 size={34} />
              </span>
              <h3 id="bk-title" className="bk-title">Booking registered!</h3>
              <p className="bk-sub">
                Your booking request for <strong>{name}</strong> was sent successfully. Opening WhatsApp…
              </p>

              <dl className="bk-summary">
                <div>
                  <dt>Service</dt>
                  <dd>{category || bookingType}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{bookingType}</dd>
                </div>
                {phone && (
                  <div>
                    <dt>Vendor</dt>
                    <dd>{formatPhone(phone)}</dd>
                  </div>
                )}
              </dl>

              <a className="bk-action bk-action-wa" href={waHref}>
                <MessageCircle size={16} /> Continue on WhatsApp
              </a>
              {telHref && (
                <a className="bk-action bk-action-call" href={telHref}>
                  <Phone size={16} /> Call {formatPhone(phone)}
                </a>
              )}
              <button type="button" className="bk-done" onClick={closeModal}>
                Done
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default BookNowButton;