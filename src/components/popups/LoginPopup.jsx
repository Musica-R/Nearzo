import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { login, resendOtp, clearAuthError } from "../../redux/slices/authSlice";
import Modal from "./Modal";

/**
 * Compact sign-in shown once to guests after ~5 minutes.
 * On success the auth slice sets `user`, and PopupManager closes this popup
 * (and starts the 10s location timer).
 */
const LoginPopup = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) dispatch(clearAuthError());
  }, [open, dispatch]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
    } catch (err) {
      // Account not verified yet: send a fresh OTP and move to verification
      const isInactive = err?.status === 403 && /inactive/i.test(err?.message || "");
      if (isInactive) {
        dispatch(resendOtp({ email: form.email }));
        dispatch(clearAuthError());
        onClose();
        navigate("/verify-otp", { state: { email: form.email } });
      }
    }
  };

  const goRegister = () => {
    onClose();
    navigate("/register");
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="lp-title">
      <form className="pp-form" onSubmit={handleSubmit}>
        <div className="pp-scroll">
          <h2 id="lp-title" className="pp-title">Sign in to Thozhaa</h2>
          <p className="pp-sub">Pick up your bookings and saved providers.</p>

          <label className="pp-label" htmlFor="lp-email">Email</label>
          <div className="pp-field">
            <FiMail size={16} />
            <input
              id="lp-email"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <label className="pp-label" htmlFor="lp-password">Password</label>
          <div className="pp-field">
            <FiLock size={16} />
            <input
              id="lp-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
            />
            <button
              type="button"
              className="pp-eye"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          {error && <p className="pp-error" role="alert">{error}</p>}
        </div>

        <div className="pp-footer">
          <button type="submit" className="pp-btn pp-btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="pp-switch">
            New here?{" "}
            <button type="button" className="pp-link pp-link-strong" onClick={goRegister}>
              Create an account
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default LoginPopup;