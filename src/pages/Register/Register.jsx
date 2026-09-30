import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, User, Phone, MapPin, UserPlus, LogIn } from "lucide-react";
import {
  register,
  login,
  resendOtp,
  clearAuthError,
} from "../../redux/slices/authSlice";
import useVendorTypes from "../../hooks/useVendorTypes";
import { getRoleChoice, saveRoleChoice } from "../../utils/role";
import "../Login/Auth.css";
import "./Register.css";

const isAlreadyVerified = (msg = "") => /already verified/i.test(msg);
const looksLikeExistingEmail = (payload) =>
  !!payload?.errors?.email?.length ||
  /already|exist|taken|registered/i.test(payload?.message || "");

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { loading, error, fieldErrors, user } = useSelector((s) => s.auth);

  // Priority: URL (?role=&type=) → what was picked in the popup → customer
  const saved = getRoleChoice();
  const initialRole = params.get("role") || saved?.role || "user";
  const initialType =
    params.get("type") || (saved?.role === "vendor" ? saved.type : "") || "";

  // "register" = normal form, "verified" = email already verified → password only
  const [mode, setMode] = useState("register");
  const [role, setRole] = useState(initialRole === "vendor" ? "vendor" : "user");
  const [vendorType, setVendorType] = useState(initialType);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    password_confirmation: "",
    location: "",
  });
  const [image, setImage] = useState(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const { types, loading: typesLoading, error: typesError } = useVendorTypes(
    role === "vendor" && mode === "register"
  );
  const activeGroup = types.find((t) => t.type === vendorType);

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

    if (role === "vendor" && !vendorType) {
      setLocalError("Please select your vendor type.");
      return;
    }

    const fd = new FormData();
    fd.append("role", role);
    // customers send "user"; vendors send the type they selected
    fd.append("type", role === "vendor" ? vendorType : "user");
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
      <div className="section auth-page">
        <div className="container auth-container">
          <div className="auth-visual">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=650&q=80&auto=format&fit=crop"
              alt="Local service provider"
            />
            <div className="auth-visual-copy">
              <h2>Welcome back to Thozhaa</h2>
              <p>Your email is already verified. Just enter your password.</p>
            </div>
          </div>

          <form className="auth-card" onSubmit={handleLogin}>
            <span className="eyebrow">
              <LogIn size={12} /> Login
            </span>
            <h1>You already have an account</h1>
            <p className="text-muted auth-sub">
              This email is already registered and verified.
            </p>

            <label>
              Email
              <div className="auth-input">
                <Mail size={16} />
                <input type="email" value={form.email} readOnly disabled />
              </div>
            </label>

            <label>
              Password
              <div className="auth-input">
                <Lock size={16} />
                <input
                  type="password"
                  required
                  autoFocus
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </label>

            {error && <p className="bv-error">{error}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="auth-switch">
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
  return (
    <div className="section auth-page">
      <div className="container auth-container">
        <div className="auth-visual">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=650&q=80&auto=format&fit=crop"
            alt="Local service provider"
          />
          <div className="auth-visual-copy">
            <h2>{role === "vendor" ? "Grow your business on Thozhaa" : "Join Thozhaa"}</h2>
            <p>
              {role === "vendor"
                ? "List your services and reach customers nearby."
                : "Book trusted local help in a few taps."}
            </p>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleRegister}>
          <span className="eyebrow">
            <UserPlus size={12} /> Register
          </span>
          <h1>Create your account</h1>

          <div className="reg-role-toggle" role="group" aria-label="Account type">
            <button type="button" className={role === "user" ? "is-active" : ""} onClick={() => setRole("user")}>
              Customer
            </button>
            <button type="button" className={role === "vendor" ? "is-active" : ""} onClick={() => setRole("vendor")}>
              Vendor
            </button>
          </div>

          {role === "vendor" && (
            <label>
              Vendor type
              <div className="auth-input">
                <select value={vendorType} onChange={(e) => setVendorType(e.target.value)} required>
                  <option value="">{typesLoading ? "Loading…" : "Select your type"}</option>
                  {types.map((t) => (
                    <option key={t.type} value={t.type}>{t.type}</option>
                  ))}
                </select>
              </div>
              {typesError && <span className="bv-error">{typesError}</span>}
              {fieldError("type") && <span className="bv-error">{fieldError("type")}</span>}
              {activeGroup && (
                <span className="reg-chips">
                  {activeGroup.categories.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </span>
              )}
            </label>
          )}

          <label>
            Full name
            <div className="auth-input">
              <User size={16} />
              <input name="name" required value={form.name} onChange={handleChange} placeholder="Your name" />
            </div>
            {fieldError("name") && <span className="bv-error">{fieldError("name")}</span>}
          </label>

          <label>
            Email
            <div className="auth-input">
              <Mail size={16} />
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            {fieldError("email") && <span className="bv-error">{fieldError("email")}</span>}
          </label>

          <label>
            Mobile number
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

          <label>
            Location <small className="text-muted">(optional)</small>
            <div className="auth-input">
              <MapPin size={16} />
              <input name="location" value={form.location} onChange={handleChange} placeholder="City or area" />
            </div>
          </label>

          <label>
            Password
            <div className="auth-input">
              <Lock size={16} />
              <input type="password" name="password" required minLength={8} value={form.password} onChange={handleChange} placeholder="••••••••" />
            </div>
            {fieldError("password") && <span className="bv-error">{fieldError("password")}</span>}
          </label>

          <label>
            Confirm password
            <div className="auth-input">
              <Lock size={16} />
              <input type="password" name="password_confirmation" required value={form.password_confirmation} onChange={handleChange} placeholder="••••••••" />
            </div>
          </label>

          <label>
            Profile image <small className="text-muted">(optional, JPG/PNG up to 2 MB)</small>
            <input type="file" accept="image/png,image/jpeg" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            {fieldError("profile_image") && <span className="bv-error">{fieldError("profile_image")}</span>}
          </label>

          {(localError || error) && <p className="bv-error">{localError || error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Please wait..." : role === "vendor" ? "Register as vendor" : "Create account"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;