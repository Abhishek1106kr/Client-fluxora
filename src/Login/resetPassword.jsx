import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, KeyRound, Rocket, Sparkles, ArrowLeft } from "lucide-react";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRefs = useRef([]);
  const { backendUrl } = useContext(AppContext);

  // Focus the first OTP input if OTP stage is active
  useEffect(() => {
    if (isOtpSent && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOtpSent]);

  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    if (val && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setOtp(digits);
      inputRefs.current[5].focus();
    } else {
      toast.error("Please paste a valid 6-digit number");
    }
  };

  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast.error("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (res.data.success) {
        toast.success("Password reset OTP has been sent to your email!");
        setIsOtpSent(true);
      } else {
        toast.error(res.data.message || "Failed to send reset OTP.");
      }
    } catch (err) {
      console.error("Request OTP error:", err);
      toast.error(err.response?.data?.message || "Failed to send reset OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code");
      setIsLoading(false);
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp: otpCode,
        newPassword,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden font-inter text-zinc-100">
      {/* Background highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center p-3 rounded-xl bg-emerald-600/10 border border-emerald-500/20 mb-3">
            <Rocket size={24} className="text-emerald-500" />
          </div>
          <span className="font-outfit font-extrabold text-2xl tracking-tight text-zinc-50">
            Flux<span className="text-emerald-500">ora</span>
          </span>
          <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
            <Sparkles size={12} className="text-emerald-400" />
            Empowering your career journey
          </p>
        </div>

        {/* Card Form */}
        <Card className="p-8 bg-zinc-900 border-zinc-800 shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <KeyRound size={28} />
            </div>
          </div>

          <h2 className="text-xl font-bold font-outfit text-zinc-50 mb-2 text-center">
            {isOtpSent ? "Set New Password" : "Reset Password"}
          </h2>
          <p className="text-xs text-zinc-400 text-center mb-6 max-w-xs mx-auto leading-relaxed">
            {isOtpSent 
              ? `Enter the OTP sent to ${email} and choose a new secure password.`
              : "Enter your registered email address and we'll send you an OTP to reset your password."
            }
          </p>

          {!isOtpSent ? (
            /* Phase 1: Request OTP */
            <form onSubmit={handleRequestOtp} className="flex flex-col gap-5">
              <InputField
                label="Email Address"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                icon={Mail}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 mt-2"
                loading={isLoading}
              >
                Send Reset OTP
              </Button>
            </form>
          ) : (
            /* Phase 2: Enter OTP & New Password */
            <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
              {/* OTP Label */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Enter 6-Digit OTP
                </label>
                <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="w-12 h-12 text-center text-lg font-bold bg-zinc-950 border border-zinc-800 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-emerald-400 transition-colors"
                    />
                  ))}
                </div>
              </div>

              <InputField
                label="New Password"
                id="newPassword"
                type="password"
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
                autoComplete="new-password"
                icon={Lock}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 mt-2"
                loading={isLoading}
              >
                Reset Password
              </Button>

              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <ArrowLeft size={12} />
                Change email / Try again
              </button>
            </form>
          )}

          {/* Back link */}
          <div className="mt-6 text-center text-xs">
            <Link to="/login" className="text-zinc-500 hover:text-zinc-300 transition-colors">
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ResetPassword;
