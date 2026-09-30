import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiX, FiUser, FiShoppingBag, FiArrowLeft, FiCheck } from "react-icons/fi";
import useVendorTypes from "../../hooks/useVendorTypes";
import { getRoleChoice, saveRoleChoice } from "../../utils/role";
import "./RolePopup.css";

const SHOW_AFTER_MS = 60 * 1000; // 1 minute
const DISMISS_KEY = "thozhaa_role_popup_dismissed";

const RolePopup = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [timerDone, setTimerDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("role"); // "role" | "vendor"
  const [selectedType, setSelectedType] = useState("");

  const { types, loading, error } = useVendorTypes(open && step === "vendor");

  const isBlocked = () =>
    !!user || !!getRoleChoice() || sessionStorage.getItem(DISMISS_KEY) === "1";

  // 1-minute timer (Navbar is mounted on every page, so this survives route changes)
  useEffect(() => {
    const t = setTimeout(() => setTimerDone(true), SHOW_AFTER_MS);
    return () => clearTimeout(t);
  }, []);

  // Only interrupt someone who is actually scrolling/browsing
  useEffect(() => {
    const onScroll = () => setScrolled(true);
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (timerDone && scrolled && !isBlocked()) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerDone, scrolled]);

  // Close if the person logs in while it's open
  useEffect(() => {
    if (user) setOpen(false);
  }, [user]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
  };

  // Lock page scroll + Esc to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const chooseCustomer = () => {
    saveRoleChoice({ role: "user", type: "user" });
    setOpen(false);
    navigate("/register?role=user");
  };

  const continueAsVendor = () => {
    if (!selectedType) return;
    saveRoleChoice({ role: "vendor", type: selectedType });
    setOpen(false);
    navigate(`/register?role=vendor&type=${encodeURIComponent(selectedType)}`);
  };

  if (!open) return null;

  return createPortal(
    <div className="rp-overlay" onClick={dismiss} role="presentation">
      <div
        className="rp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rp-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="rp-close" onClick={dismiss} aria-label="Close">
          <FiX size={18} />
        </button>

        {step === "role" && (
          <>
            <h2 id="rp-title">Welcome to Thozhaa</h2>
            <p className="rp-sub">How would you like to use Thozhaa?</p>

            <div className="rp-options">
              <button type="button" className="rp-option" onClick={chooseCustomer}>
                <span className="rp-option-icon rp-customer"><FiUser size={22} /></span>
                <span>
                  <strong>Customer</strong>
                  <small>Find and book services near you</small>
                </span>
              </button>

              <button type="button" className="rp-option" onClick={() => setStep("vendor")}>
                <span className="rp-option-icon rp-vendor"><FiShoppingBag size={22} /></span>
                <span>
                  <strong>Vendor</strong>
                  <small>List and grow your business</small>
                </span>
              </button>
            </div>
          </>
        )}

        {step === "vendor" && (
          <>
            <button type="button" className="rp-back" onClick={() => setStep("role")}>
              <FiArrowLeft size={15} /> Back
            </button>
            <h2 id="rp-title">What do you offer?</h2>
            <p className="rp-sub">Pick the type that fits your business.</p>

            {loading && <p className="rp-status">Loading categories…</p>}
            {error && <p className="rp-status rp-error">{error}</p>}

            <div className="rp-types">
              {types.map((group) => {
                const active = selectedType === group.type;
                return (
                  <button
                    key={group.type}
                    type="button"
                    className={`rp-type ${active ? "is-active" : ""}`}
                    onClick={() => setSelectedType(group.type)}
                    aria-pressed={active}
                  >
                    <span className="rp-type-head">
                      <strong>{group.type}</strong>
                      {active && <FiCheck size={16} />}
                    </span>
                    <span className="rp-chips">
                      {group.categories.map((c) => (
                        <span className="rp-chip" key={c}>{c}</span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="rp-continue"
              disabled={!selectedType}
              onClick={continueAsVendor}
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default RolePopup;