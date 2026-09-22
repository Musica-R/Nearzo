import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, ShieldCheck, RotateCw, ArrowLeft } from "lucide-react";
import { verifyOtp, resendOtp, clearAuthError } from "../../redux/slices/authSlice";
import "../Register/Auth.css";

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, otpVerified } = useSelector((s) => s.auth);

  // Email arrives via route state from Register; fall back to an editable
  // field in case the user lands here directly (e.g. page refresh).
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (otpVerified) {
      const t = setTimeout(() => navigate("/login"), 1200);
      return () => clearTimeout(t);
    }
  }, [otpVerified, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResendMsg("");
    await dispatch(verifyOtp({ email, otp }));
  };

  const handleResend = async () => {
    setResendMsg("");
    const result = await dispatch(resendOtp({ email }));
    if (resendOtp.fulfilled.match(result)) {
      setResendMsg("A new OTP has been sent to your email.");
    }
  };

  const handleBack = () => {
    // Go to the previous page if there's history to go back to,
    // otherwise fall back to Register.
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="section auth-page">
      <div className="container auth-container">
        <div className="auth-visual">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=650&q=80&auto=format&fit=crop"
            alt="Verify your email"
          />
          <div className="auth-visual-copy">
            <h2>Almost there</h2>
            <p>Verify your email to activate your Thozhaa account.</p>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <button type="button" className="auth-back" onClick={handleBack}>
            <ArrowLeft size={16} /> Back
          </button>

          <span className="eyebrow">
            <ShieldCheck size={12} /> Verify Email
          </span>
          <h1>Enter verification code</h1>
          <p className="text-muted auth-sub">
            We've sent a one-time code to your email. Enter it below to verify your account.
          </p>

          <label>
            Email
            <div className="auth-input">
              <Mail size={16} />
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </label>

          <label>
            OTP Code
            <div className="auth-input">
              <ShieldCheck size={16} />
              <input
                name="otp"
                required
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit code"
              />
            </div>
          </label>

          {error && <p className="bv-error">{error}</p>}
          {otpVerified && <p className="auth-success">Email verified successfully! Redirecting to login...</p>}
          {resendMsg && <p className="auth-success">{resendMsg}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading || !otp || !email}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            className="btn btn-link btn-block auth-resend"
            onClick={handleResend}
            disabled={loading || !email}
          >
            <RotateCw size={14} /> Resend OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;