import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  UserPlus,
  LogIn,
  Check,
  Eye,
  EyeOff,
  UploadCloud,
  X,
} from "lucide-react";
import {
  register,
  login,
  resendOtp,
  clearAuthError,
} from "../../redux/slices/authSlice";
import useVendorTypes from "../../hooks/useVendorTypes";
import { saveRoleChoice } from "../../utils/role";
import { joinTypes, splitTypes } from "../../utils/vendorTypes";
import "../Login/Auth.css";
import "./Register.css";
import "./RegisterVendorType.css";

// list-category?type=vendor returns plain names: ["Home Services", "jobs", ...]
// (an object like { type: "Home Services" } is also tolerated)
const typeName = (item) => String(typeof item === "string" ? item : item?.type ?? item?.name ?? "");

const isAlreadyVerified = (msg = "") => /already verified/i.test(msg);
const looksLikeExistingEmail = (payload) =>
  !!payload?.errors?.email?.length ||
  /already|exist|taken|registered/i.test(payload?.message || "");

const VISUAL_IMG =
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&q=80&auto=format&fit=crop";

const PERKS = {
  vendor: [
    "Free business listing on Thozhaa",
    "Get booked by customers near you",
    "Track bookings and ratings in one place",
  ],
  user: [
    "Verified local professionals",
    "Book in just a few taps",
    "Rate and review every booking",
  ],
};

// Left-hand image panel, shared by both screens
const VisualPanel = ({ title, text, perks }) => (
  <aside className="reg-visual">
    <img src={VISUAL_IMG} alt="Local service provider" />
    <div className="reg-visual-copy">
      <h2>{title}</h2>
      <p>{text}</p>
      {perks && (
        <ul className="reg-perks">
          {perks.map((p) => (
            <li key={p}>
              <span className="reg-perk-tick" aria-hidden="true">
                <Check size={12} strokeWidth={3} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  </aside>
);

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { loading, error, fieldErrors, user } = useSelector((s) => s.auth);

  // Only the URL from the welcome popup pre-fills this page (?role=&type=).
  // Nothing is read from localStorage: the vendor can change the types here,
  // and what they finally submit is what gets stored (after a successful register).
  const initialRole = params.get("role") || "user";
  const initialTypes = splitTypes(params.get("type"));

  // "register" = normal form, "verified" = email already verified → password only
  const [mode, setMode] = useState("register");
  const [role, setRole] = useState(initialRole === "vendor" ? "vendor" : "user");
  const [selectedTypes, setSelectedTypes] = useState(initialTypes); // multi-select
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    password_confirmation: "",
    location: "",
  });
  const [image, setImage] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const vendorType = joinTypes(selectedTypes); // only for the local role choice: "Home Services|Sports & Fitness"

  const { types, loading: typesLoading, error: typesError } = useVendorTypes(
    role === "vendor" && mode === "register"
  );

  // Tick to add, tick again to remove
  const toggleType = (type) =>
    setSelectedTypes((current) =>
      current.includes(type) ? current.filter((t) => t !== type) : [...current, type]
    );

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Logged in (either just now or already) → go to profile
  useEffect(() => {
    if (user) navigate("/profile");
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const fieldError = (name) => fieldErrors?.[name]?.[0];

  const switchToVerifiedMode = () => {
    dispatch(clearAuthError());
    setLocalError("");
    setLoginPassword("");
    setMode("verified");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (role === "vendor" && !selectedTypes.length) {
      setLocalError("Please select at least one vendor type.");
      return;
    }

    const fd = new FormData();
    fd.append("role", role);
    // customers send type = "user"; vendors send the selected types as an ARRAY:
    //   type[] = Home Services
    //   type[] = Sports & Fitness
    const typesToSend = role === "vendor" ? selectedTypes : ["user"];
    typesToSend.forEach((t) => fd.append("type[]", t));
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
    if (image) fd.append("profile_image", image);

    const result = await dispatch(register(fd));

    if (register.fulfilled.match(result)) {
      saveRoleChoice({ role, type: role === "vendor" ? vendorType : "user" });
      navigate("/verify-otp", { state: { email: form.email } });
      return;
    }

    // Registration failed. If the email already exists, check whether it's
    // already verified: if so, skip OTP and just ask for the password.
    if (looksLikeExistingEmail(result.payload) && form.email) {
      const otpResult = await dispatch(resendOtp({ email: form.email }));

      if (resendOtp.fulfilled.match(otpResult)) {
        // Registered but not verified yet → send them to OTP screen
        navigate("/verify-otp", { state: { email: form.email } });
      } else if (isAlreadyVerified(otpResult.payload?.message)) {
        switchToVerifiedMode();
      }
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email: form.email, password: loginPassword }));
  };

  /* ---------------- Email already verified → password only ---------------- */
  if (mode === "verified") {
    return (
      <div className="section auth-page reg-page">
        <div className="container auth-container reg-container">
          <VisualPanel
            title="Welcome back to Thozhaa"
            text="Your email is already verified. Just enter your password."
          />

          <form className="auth-card reg-card" onSubmit={handleLogin}>
            <header className="reg-head">
              <span className="reg-eyebrow">
                <LogIn size={13} /> Login
              </span>
              <h1>You already have an account</h1>
              <p className="reg-sub">This email is already registered and verified.</p>
            </header>

            <div className="reg-grid">
              <label className="reg-field reg-full">
                <span className="reg-label">Email</span>
                <div className="auth-input">
                  <Mail size={16} />
                  <input type="email" value={form.email} readOnly disabled />
                </div>
              </label>

              <label className="reg-field reg-full">
                <span className="reg-label">Password</span>
                <div className="auth-input">
                  <Lock size={16} />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    autoFocus
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="reg-eye"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
            </div>

            {error && <p className="bv-error reg-alert">{error}</p>}

            <button type="submit" className="reg-submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="reg-switch">
              Not you?{" "}
              <button
                type="button"
                className="reg-link-btn"
                onClick={() => {
                  dispatch(clearAuthError());
                  setMode("register");
                }}
              >
                Use a different email
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  /* ---------------- Normal registration form ---------------- */
  const isVendor = role === "vendor";

  return (
    <div className="section auth-page reg-page">
      <div className="container auth-container reg-container">
        <VisualPanel
          title={isVendor ? "Grow your business on Thozhaa" : "Join Thozhaa"}
          text={
            isVendor
              ? "List your services and reach customers nearby."
              : "Book trusted local help in a few taps."
          }
          perks={isVendor ? PERKS.vendor : PERKS.user}
        />

        <form className="auth-card reg-card" onSubmit={handleRegister}>
          <header className="reg-head">
            <span className="reg-eyebrow">
              <UserPlus size={13} /> Register
            </span>
            <h1>Create your account</h1>
            <p className="reg-sub">
              {isVendor
                ? "Tell us about your business to start getting booked."
                : "It only takes a minute to get started."}
            </p>
          </header>

          <div className="reg-role-toggle" role="group" aria-label="Account type">
            <button type="button" className={role === "user" ? "is-active" : ""} onClick={() => setRole("user")}>
              Customer
            </button>
            <button type="button" className={role === "vendor" ? "is-active" : ""} onClick={() => setRole("vendor")}>
              Vendor
            </button>
          </div>

          {isVendor && (
            <div className="reg-vt" role="group" aria-label="Vendor types">
              <span className="reg-vt-title">
                Vendor type <small>(select one or more)</small>
              </span>

              {typesLoading && <span className="reg-vt-note">Loading types…</span>}
              {typesError && <span className="bv-error">{typesError}</span>}
              {(fieldError("type") || fieldError("type.0")) && (
                <span className="bv-error">{fieldError("type") || fieldError("type.0")}</span>
              )}

              <div className="reg-vt-list">
                {types.map((item) => {
                  const name = typeName(item);
                  const active = selectedTypes.includes(name);
                  return (
                    <label key={name} className={`reg-vt-item ${active ? "is-active" : ""}`}>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleType(name)}
                      />
                      <span className="reg-vt-box" aria-hidden="true">
                        {active && <Check size={12} strokeWidth={3} />}
                      </span>
                      <span className="reg-vt-text">
                        <strong>{name}</strong>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="reg-grid">
            <label className="reg-field">
              <span className="reg-label">Full name</span>
              <div className="auth-input">
                <User size={16} />
                <input name="name" required value={form.name} onChange={handleChange} placeholder="Your name" />
              </div>
              {fieldError("name") && <span className="bv-error">{fieldError("name")}</span>}
            </label>

            <label className="reg-field">
              <span className="reg-label">Mobile number</span>
              <div className="auth-input">
                <Phone size={16} />
                <input
                  name="mobile_number"
                  required
                  inputMode="numeric"
                  maxLength={10}
                  pattern="\d{10}"
                  value={form.mobile_number}
                  onChange={handleChange}
                  placeholder="10-digit number"
                />
              </div>
              {fieldError("mobile_number") && <span className="bv-error">{fieldError("mobile_number")}</span>}
            </label>

            <label className="reg-field">
              <span className="reg-label">Email</span>
              <div className="auth-input">
                <Mail size={16} />
                <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
              </div>
              {fieldError("email") && <span className="bv-error">{fieldError("email")}</span>}
            </label>

            <label className="reg-field">
              <span className="reg-label">
                Location <small>(optional)</small>
              </span>
              <div className="auth-input">
                <MapPin size={16} />
                <input name="location" value={form.location} onChange={handleChange} placeholder="City or area" />
              </div>
            </label>

            <label className="reg-field">
              <span className="reg-label">Password</span>
              <div className="auth-input">
                <Lock size={16} />
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  className="reg-eye"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldError("password") && <span className="bv-error">{fieldError("password")}</span>}
            </label>

            <label className="reg-field">
              <span className="reg-label">Confirm password</span>
              <div className="auth-input">
                <Lock size={16} />
                <input
                  type={showPw ? "text" : "password"}
                  name="password_confirmation"
                  required
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                />
              </div>
            </label>

            <div className="reg-field reg-full">
              <span className="reg-label">
                Profile image <small>(optional, JPG/PNG up to 2 MB)</small>
              </span>
              <label className={`reg-drop ${image ? "has-file" : ""}`}>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                <UploadCloud size={20} />
                <span className="reg-drop-text">
                  {image ? image.name : "Click to upload a photo"}
                </span>
              </label>
              {image && (
                <button type="button" className="reg-drop-clear" onClick={() => setImage(null)}>
                  <X size={13} /> Remove photo
                </button>
              )}
              {fieldError("profile_image") && <span className="bv-error">{fieldError("profile_image")}</span>}
            </div>
          </div>

          {(localError || error) && <p className="bv-error reg-alert">{localError || error}</p>}

          <button type="submit" className="reg-submit" disabled={loading}>
            {loading ? "Please wait..." : isVendor ? "Register as vendor" : "Create account"}
          </button>

          <p className="reg-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;