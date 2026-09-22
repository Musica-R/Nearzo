import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Phone, Lock, MapPin, UploadCloud, UserPlus } from "lucide-react";
import { register, clearAuthError } from "../../redux/slices/authSlice";
import "./Auth.css";

// Small helper to pull the first message for a field out of the
// Laravel-style { field: ["msg", ...] } errors object.
const fieldError = (fieldErrors, field) => fieldErrors?.[field]?.[0];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, fieldErrors } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    password_confirmation: "",
    location: "",
    latitude: "12.9716",
    longitude: "77.5946",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (profileImage) data.append("profile_image", profileImage);

    const result = await dispatch(register(data));
    if (register.fulfilled.match(result)) {
      setSubmitted(true);
      // Send the user to OTP verification instead of straight to login.
      // Email is passed via route state so the OTP page can pre-fill it.
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: form.email } });
      }, 900);
    }
  };

  return (
    <div className="section auth-page">
      <div className="container auth-container">
        <div className="auth-visual">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=650&q=80&auto=format&fit=crop"
            alt="Join Thozhaa"
          />
          <div className="auth-visual-copy">
            <h2>Join the Thozhaa community</h2>
            <p>Discover verified providers around you.</p>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <span className="eyebrow">
            <UserPlus size={12} /> Register
          </span>
          <h1>Create your account</h1>
          <p className="text-muted auth-sub">It only takes a minute to get started.</p>

          <label>
            Full Name
            <div className={`auth-input${fieldError(fieldErrors, "name") ? " has-error" : ""}`}>
              <User size={16} />
              <input name="name" required value={form.name} onChange={handleChange} placeholder="Kavin" />
            </div>
            {fieldError(fieldErrors, "name") && (
              <span className="field-error">{fieldError(fieldErrors, "name")}</span>
            )}
          </label>

          <label>
            Email
            <div className={`auth-input${fieldError(fieldErrors, "email") ? " has-error" : ""}`}>
              <Mail size={16} />
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            {fieldError(fieldErrors, "email") && (
              <span className="field-error">{fieldError(fieldErrors, "email")}</span>
            )}
          </label>

          <label>
            Mobile Number
            <div className={`auth-input${fieldError(fieldErrors, "mobile_number") ? " has-error" : ""}`}>
              <Phone size={16} />
              <input name="mobile_number" required value={form.mobile_number} onChange={handleChange} placeholder="9944803049" />
            </div>
            {fieldError(fieldErrors, "mobile_number") && (
              <span className="field-error">{fieldError(fieldErrors, "mobile_number")}</span>
            )}
          </label>

          <div className="auth-row">
            <label>
              Password
              <div className={`auth-input${fieldError(fieldErrors, "password") ? " has-error" : ""}`}>
                <Lock size={16} />
                <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
              </div>
              {fieldError(fieldErrors, "password") && (
                <span className="field-error">{fieldError(fieldErrors, "password")}</span>
              )}
            </label>
            <label>
              Confirm Password
              <div className={`auth-input${fieldError(fieldErrors, "password_confirmation") ? " has-error" : ""}`}>
                <Lock size={16} />
                <input type="password" name="password_confirmation" required value={form.password_confirmation} onChange={handleChange} placeholder="••••••••" />
              </div>
              {fieldError(fieldErrors, "password_confirmation") && (
                <span className="field-error">{fieldError(fieldErrors, "password_confirmation")}</span>
              )}
            </label>
          </div>

          <label>
            Location
            <div className={`auth-input${fieldError(fieldErrors, "location") ? " has-error" : ""}`}>
              <MapPin size={16} />
              <input name="location" required value={form.location} onChange={handleChange} placeholder="Salem" />
            </div>
            {fieldError(fieldErrors, "location") && (
              <span className="field-error">{fieldError(fieldErrors, "location")}</span>
            )}
          </label>

          <label>
            Profile Photo
            <div className="auth-file">
              <UploadCloud size={16} />
              <span>{profileImage ? profileImage.name : "Choose a photo"}</span>
              <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} />
            </div>
            {fieldError(fieldErrors, "profile_image") && (
              <span className="field-error">{fieldError(fieldErrors, "profile_image")}</span>
            )}
          </label>

          {/* General/top-level error only shows when there are no field-specific ones,
              so the person isn't shown a vague message alongside the precise ones. */}
          {error && Object.keys(fieldErrors || {}).length === 0 && (
            <p className="bv-error">{error}</p>
          )}
          {submitted && <p className="auth-success">Account created! Redirecting to verify your email...</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
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