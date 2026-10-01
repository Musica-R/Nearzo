import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking, getStoredUser } from "../utils/booking";

/**
 * status: "idle" | "loading" | "booked" | "error"
 * book()      -> not logged in: go to /login. Otherwise calls the booking API.
 *                After it succeeds, modalOpen = true (success popup).
 * Once booked, calling book() again just re-opens the popup (no second booking).
 */
const useBooking = ({ vendorUserId, bookingType }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const book = useCallback(async () => {
    if (status === "loading") return;
    if (status === "booked") {
      setModalOpen(true);
      return;
    }

    const user = getStoredUser();
    if (!user) {
      navigate("/login");
      return;
    }

    if (!vendorUserId) {
      setStatus("error");
      setError("Online booking isn't available for this vendor yet. Please call or WhatsApp them.");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      await createBooking({ userId: user.id, vendorId: vendorUserId, type: bookingType });
      setCustomer(user);
      setStatus("booked");
      setModalOpen(true);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Couldn't complete the booking. Please try again.");
    }
  }, [status, vendorUserId, bookingType, navigate]);

  const closeModal = useCallback(() => setModalOpen(false), []);

  return { book, status, error, customer, modalOpen, closeModal };
};

export default useBooking;