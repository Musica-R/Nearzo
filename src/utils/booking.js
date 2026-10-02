// Shared booking helpers (used by BookNowButton, VendorCard, VendorProfile, ProviderProfile)

export const API_BASE = "https://booking.mpdatahub.com/api";

// Booking is only offered for these listing types (the `type` field of a listing)
export const BOOKABLE_TYPES = ["Home Services", "Activity"];
export const isBookableType = (type) => BOOKABLE_TYPES.includes(type);

// Thozhaa's own number: WhatsApp fallback when a vendor has no number
export const THOZHAA_PHONE_DISPLAY = "+91 94878 12715";
export const THOZHAA_WA_NUMBER = "919487812715";

/**
 * Any Indian number -> "91" + 10 digits, or null.
 *   "09976180125"   -> "919976180125"   (leading 0 removed)
 *   "+91 99761 80125" -> "919976180125"
 */
export const toIndianNumber = (raw) => {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `91${digits.slice(-10)}`;
};

// "+91 9976180125" (falls back to the raw text if it isn't a valid number)
export const formatPhone = (raw) => {
  const n = toIndianNumber(raw);
  return n ? `+91 ${n.slice(2)}` : raw || "";
};

export const toTelHref = (raw) => {
  const n = toIndianNumber(raw);
  return n ? `tel:+${n}` : null;
};

export const toWhatsAppUrl = (raw, text) => {
  const n = toIndianNumber(raw);
  if (!n) return null;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
};

// Logged-in user: id + name from localStorage ("lokal_user")
export const getStoredUser = () => {
  try {
    const u = JSON.parse(localStorage.getItem("lokal_user") || "null");
    if (!u?.id) return null;
    return { id: u.id, name: u.name || u.full_name || "Customer" };
  } catch {
    return null;
  }
};

/**
 * POST /create-Booking   (JSON body)
 *   user_id   = logged-in user's id (localStorage "lokal_user")
 *   vendor_id = the listing's id (vendor.id / provider.id)
 *   type      = "Home Services" | "Activity"
 */
export const createBooking = async ({ userId, vendorId, type }) => {
  const res = await fetch(`${API_BASE}/create-Booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      user_id: Number(userId),
      vendor_id: Number(vendorId),
      type,
    }),
  });

  let json = {};
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || json.success === false) {
    const firstValidation = json.errors && Object.values(json.errors)[0]?.[0];
    throw new Error(firstValidation || json.message || "Booking failed. Please try again.");
  }
  return json;
};

/**
 * GET /booking-List?user_id=
 * Returns the bookings made by this user, newest first, each with `vendor_details`.
 */
export const fetchBookings = async (userId) => {
  const res = await fetch(`${API_BASE}/booking-List?user_id=${encodeURIComponent(userId)}`, {
    headers: { Accept: "application/json" },
  });

  let json = {};
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Couldn't load your bookings.");
  }
  return Array.isArray(json.data) ? json.data : [];
};

/**
 * POST /booking-rating   (JSON body)
 *   user_id   = logged-in user's id
 *   vendor_id = the booking's vendor_id
 *   rating    = whole number 1-5
 */
export const submitRating = async ({ userId, vendorId, rating }) => {
  const res = await fetch(`${API_BASE}/booking-rating`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      user_id: Number(userId),
      vendor_id: Number(vendorId),
      rating: Number(rating),
    }),
  });

  let json = {};
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || json.success === false) {
    const firstValidation = json.errors && Object.values(json.errors)[0]?.[0];
    throw new Error(firstValidation || json.message || "Couldn't submit your rating. Please try again.");
  }
  return json;
};