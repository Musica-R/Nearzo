import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Phone, Lock, MapPin, UploadCloud, UserPlus } from "lucide-react";
import { register, clearAuthError } from "../../redux/slices/authSlice";
import "./Auth.css";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
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
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (profileImage) data.append("profile_image", profileImage);

    const result = await dispatch(register(data));
    if (register.fulfilled.match(result)) {
      setSubmitted(true);
      setTimeout(() => navigate("/login"), 1200);
    }
  };

  return (
    <div className="section auth-page">
      <div className="container auth-container">
        <div className="auth-visual">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=650&q=80&auto=format&fit=crop"
            alt="Join Lokal"
          />
          <div className="auth-visual-copy">
            <h2>Join the Lokal community</h2>
            <p>Discover verified providers around you.</p>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">
            <UserPlus size={12} /> Register
          </span>
          <h1>Create your account</h1>
          <p className="text-muted auth-sub">It only takes a minute to get started.</p>

          <label>
            Full Name
            <div className="auth-input">
              <User size={16} />
              <input name="name" required value={form.name} onChange={handleChange} placeholder="Kavin" />
            </div>
          </label>

          <label>
            Email
            <div className="auth-input">
              <Mail size={16} />
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
          </label>

          <label>
            Mobile Number
            <div className="auth-input">
              <Phone size={16} />
              <input name="mobile_number" required value={form.mobile_number} onChange={handleChange} placeholder="9944803049" />
            </div>
          </label>

          <div className="auth-row">
            <label>
              Password
              <div className="auth-input">
                <Lock size={16} />
                <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
              </div>
            </label>
            <label>
              Confirm Password
              <div className="auth-input">
                <Lock size={16} />
                <input type="password" name="password_confirmation" required value={form.password_confirmation} onChange={handleChange} placeholder="••••••••" />
              </div>
            </label>
          </div>

          <label>
            Location
            <div className="auth-input">
              <MapPin size={16} />
              <input name="location" required value={form.location} onChange={handleChange} placeholder="Salem" />
            </div>
          </label>

          <label>
            Profile Photo
            <div className="auth-file">
              <UploadCloud size={16} />
              <span>{profileImage ? profileImage.name : "Choose a photo"}</span>
              <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} />
            </div>
          </label>

          {error && <p className="bv-error">{error}</p>}
          {submitted && <p className="auth-success">Account created! Redirecting to login...</p>}

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
