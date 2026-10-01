import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import useVendorTypes from "../../hooks/useVendorTypes";
import { joinTypes } from "../../utils/vendorTypes";
import Modal from "./Modal";

// list-category?type=vendor returns plain names: ["Home Services", "jobs", ...]
// (an object like { type: "Home Services" } is also tolerated)
const typeName = (item) => String(typeof item === "string" ? item : item?.type ?? item?.name ?? "");

/**
 * Step 1: Customer or Vendor
 *   Customer -> /register?role=user
 * Step 2 (vendor): tick ONE OR MORE business types
 *   Vendor   -> /register?role=vendor&type=<ticked types>
 *
 * Nothing is sent to the server or saved in localStorage here. The choice only
 * travels in the URL and pre-fills the Register page, where the vendor can still
 * change the types. Role + type are submitted ONLY when the Register form is
 * submitted, and stored locally only after that succeeds. After register ->
 * OTP -> login, the Login page opens /become-vendor and the navbar shows
 * "Become Vendor".
 *
 * onClose -> dismissed      onDone -> a choice was made
 */
const RolePopup = ({ open, onClose, onDone }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState("role"); // "role" | "vendor"
  const [selectedTypes, setSelectedTypes] = useState([]);

  const { types, loading, error } = useVendorTypes(open && step === "vendor");

  // Fresh start every time the popup opens (e.g. again after a logout)
  useEffect(() => {
    if (open) {
      setStep("role");
      setSelectedTypes([]);
    }
  }, [open]);

  const chooseCustomer = () => {
    onDone();
    navigate("/register?role=user");
  };

  const continueAsVendor = () => {
    if (!selectedTypes.length) return;
    const type = joinTypes(selectedTypes); // "Home Services|Sports & Fitness"
    onDone();
    navigate(`/register?role=vendor&type=${encodeURIComponent(type)}`);
  };

  const toggleType = (type) =>
    setSelectedTypes((current) =>
      current.includes(type) ? current.filter((t) => t !== type) : [...current, type]
    );

  return (
    <Modal open={open} onClose={onClose} labelledBy="rp-title">
      {step === "role" && (
        <>
          <div className="pp-scroll">
            <div className="pp-avatar" aria-hidden="true">
              <FiUser size={26} />
            </div>
            <p className="pp-eyebrow">Step 1 of 2</p>
            <h2 id="rp-title" className="pp-title">Set up your profile</h2>
            <p className="pp-sub">How would you like to use Thozhaa?</p>

            <div className="pp-options">
              <button type="button" className="pp-option" onClick={chooseCustomer}>
                <span className="pp-option-icon"><FiUser size={20} /></span>
                <span className="pp-option-text">
                  <strong>Customer</strong>
                  <small>Find and book services near you</small>
                </span>
                <FiArrowRight className="pp-option-go" size={18} />
              </button>

              <button type="button" className="pp-option" onClick={() => setStep("vendor")}>
                <span className="pp-option-icon"><FiShoppingBag size={20} /></span>
                <span className="pp-option-text">
                  <strong>Vendor</strong>
                  <small>List your business and get booked</small>
                </span>
                <FiArrowRight className="pp-option-go" size={18} />
              </button>
            </div>
          </div>

          <div className="pp-footer pp-footer-center">
            <button type="button" className="pp-link" onClick={onClose}>
              Just browsing
            </button>
          </div>
        </>
      )}

      {step === "vendor" && (
        <>
          <div className="pp-scroll">
            <button type="button" className="pp-back" onClick={() => setStep("role")}>
              <FiArrowLeft size={15} /> Back
            </button>

            <div className="pp-avatar" aria-hidden="true">
              <FiShoppingBag size={26} />
            </div>
            <p className="pp-eyebrow">Step 2 of 2</p>
            <h2 id="rp-title" className="pp-title">What do you offer?</h2>
            <p className="pp-sub">
              Select every type that fits your business. It will be filled in on the next page.
            </p>

            {loading && (
              <div className="pp-skeletons" aria-hidden="true">
                <span /><span /><span />
              </div>
            )}
            {error && <p className="pp-error" role="alert">{error}</p>}

            <div className="pp-types">
              {types.map((item) => {
                const name = typeName(item);
                const active = selectedTypes.includes(name);

                return (
                  <label key={name} className={`pp-check ${active ? "is-active" : ""}`}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleType(name)}
                    />
                    <span className="pp-box" aria-hidden="true">
                      {active && <FiCheck size={14} strokeWidth={3} />}
                    </span>
                    <span className="pp-check-body">
                      <strong>{name}</strong>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pp-footer">
            <button
              type="button"
              className="pp-btn pp-btn-primary"
              disabled={!selectedTypes.length}
              onClick={continueAsVendor}
            >
              {selectedTypes.length
                ? `Continue to register (${selectedTypes.length})`
                : "Select at least one type"}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default RolePopup;