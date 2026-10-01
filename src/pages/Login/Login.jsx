import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, LogIn } from "lucide-react";
import { login, resendOtp, clearAuthError } from "../../redux/slices/authSlice";
import { getRoleChoice } from "../../utils/role";
import "./Auth.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  // Set by the role popup (vendor) or by RequireAuth: where to go after login
  const redirectTo = routeLocation.state?.redirectTo || null;

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // After a successful login:
  //   vendor account that came from the vendor flow -> /become-vendor?type=...
  //   everyone else                                 -> /profile
  useEffect(() => {
    if (!user) return;

    const choice = getRoleChoice();
    const vendorTarget =
      redirectTo ||
      (choice?.role === "vendor"
        ? choice.type
          ? `/become-vendor?type=${encodeURIComponent(choice.type)}`
          : "/become-vendor"
        : null);

    if (vendorTarget && user.role === "vendor") {
      navigate(vendorTarget, { replace: true });
    } else {
      navigate("/profile", { replace: true });
    }
  }, [user, redirectTo, navigate]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      // success: the `user` effect above redirects
    } catch (err) {
      const isInactive =
        err?.status === 403 &&
        /inactive/i.test(err?.message || "");

      if (isInactive) {
        // Account not verified yet: send a fresh OTP (ignore failure,
        // the user can still hit "Resend" on the verify page) and redirect.
        dispatch(resendOtp({ email: form.email }));
        dispatch(clearAuthError());
        navigate("/verify-otp", { state: { email: form.email } });
      }
      // other errors are shown via the `error` from the store
    }
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
            <h2>Welcome back to Thozhaa</h2>
            <p>Book trusted local help in a few taps.</p>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">
            <LogIn size={12} /> Login
          </span>
          <h1>Sign in to your account</h1>
          <p className="text-muted auth-sub">
            {redirectTo
              ? "Sign in to continue setting up your listing."
              : "Access bookings, offers and your saved providers."}
          </p>

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
            New to Thozhaa? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;