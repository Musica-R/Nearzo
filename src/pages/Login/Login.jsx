import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, LogIn } from "lucide-react";
import { login, clearAuthError } from "../../redux/slices/authSlice";
import "./Auth.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="section auth-page">
      <div className="container auth-container">
        <div className="auth-visual">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=650&q=80&auto=format&fit=crop"
            alt="Local service provider"
          />
          <div className="auth-visual-copy">
            <h2>Welcome back to Lokal</h2>
            <p>Book trusted local help in a few taps.</p>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">
            <LogIn size={12} /> Login
          </span>
          <h1>Sign in to your account</h1>
          <p className="text-muted auth-sub">Access bookings, offers and your saved providers.</p>

          <label>
            Email
            <div className="auth-input">
              <Mail size={16} />
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
          </label>

          <label>
            Password
            <div className="auth-input">
              <Lock size={16} />
              <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
            </div>
          </label>

          {error && <p className="bv-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="auth-switch">
            New to Lokal? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
