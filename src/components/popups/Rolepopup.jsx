import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiTool,
  FiActivity,
  FiBriefcase,
  FiMapPin,
} from "react-icons/fi";
import useVendorTypes from "../../hooks/useVendorTypes";
import { joinTypes } from "../../utils/vendorTypes";
import Modal from "./Modal";

// list-category?type=vendor returns plain names: ["Home Services", "jobs", ...]
// (an object like { type: "Home Services" } is also tolerated)
const typeName = (item) => String(typeof item === "string" ? item : item?.type ?? item?.name ?? "");

// What each vendor type means, shown on its card in step 2.
// Keys are the lower-cased names returned by list-category?type=vendor.
// The real API name is still what gets sent in the URL (see toggleType).
// Icons are neutral now (no per-type colours) so the popup stays calm and natural.
const TYPE_INFO = {
  "home services": {
    label: "Home Services",
    Icon: FiTool,
    headline: "Show your details as a professional",
    description: "For people who visit customers at home. Add your skills, experience and price so customers can book you.",
    examples: ["Electrician", "Plumber", "Carpenter", "Painter"],
  },
  activity: {
    label: "Activity",
    Icon: FiActivity,
    headline: "Teach or train people",
    description: "For trainers, coaches and academies. List your classes and let people join your sessions.",
    examples: ["Dance", "Gym trainer", "Yoga", "Karate"],
  },
  "nearby stall": {
    label: "Nearby Stall",
    Icon: FiMapPin,
    headline: "Show your shop or business",
    description: "For shops, stalls and local businesses. Let people nearby find your place and contact you.",
    examples: ["Shop", "Food stall", "Salon", "Store"],
  },
  jobs: {
    label: "Jobs",
    Icon: FiBriefcase,
    headline: "Post your job openings",
    description: "For companies that are hiring. Post vacancies and receive applications from people near you.",
    examples: ["Full-time", "Part-time", "Internship", "Walk-in"],
  },
};

// Unknown future types still get a sensible card.
const infoFor = (name) =>
  TYPE_INFO[name.toLowerCase()] || {
    label: name,
    Icon: FiShoppingBag,
    headline: "",
    description: "",
    examples: [],
  };

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
          {/* soft header band with the icon sitting on its edge */}
          <div className="pp-hero">
            <div className="pp-avatar" aria-hidden="true">
              <FiUser size={26} />
            </div>
          </div>

          <div className="pp-scroll pp-scroll-center">
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
          <div className="pp-hero">
            <button type="button" className="pp-back" onClick={() => setStep("role")}>
              <FiArrowLeft size={15} /> Back
            </button>
            <div className="pp-avatar" aria-hidden="true">
              <FiShoppingBag size={26} />
            </div>
          </div>

          <div className="pp-scroll">
            <div className="pp-head-center">
              <p className="pp-eyebrow">Step 2 of 2</p>
              <h2 id="rp-title" className="pp-title">What do you offer?</h2>
              <p className="pp-sub">
                Select every type that fits your business. It will be filled in on the next page.
              </p>
            </div>

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
                const { label, Icon, headline, description, examples } = infoFor(name);

                return (
                  <label key={name} className={`pp-offer ${active ? "is-active" : ""}`}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleType(name)}
                    />

                    <span className="pp-offer-icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>

                    <span className="pp-offer-body">
                      <strong className="pp-offer-title">{label}</strong>
                      {headline && <span className="pp-offer-headline">{headline}</span>}
                      {description && <span className="pp-offer-desc">{description}</span>}
                      {examples.length > 0 && (
                        <span className="pp-offer-chips">
                          {examples.map((ex) => (
                            <span key={ex} className="pp-offer-chip">{ex}</span>
                          ))}
                        </span>
                      )}
                    </span>

                    <span className="pp-offer-tick" aria-hidden="true">
                      {active && <FiCheck size={13} strokeWidth={3} />}
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