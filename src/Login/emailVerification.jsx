import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ShieldCheck, Rocket, Sparkles } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

function EmailVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  const { backendUrl, getUserData } = useContext(AppContext);

  // Automatically focus on the first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return; // Allow numbers only
    
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // Only keep the last entered character
    setOtp(newOtp);

    // Auto-focus next input if value is filled
    if (val && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current box is empty, delete previous box value and focus it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        // If current box is filled, just clear it
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
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

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp: otpCode });
      if (res.data.success) {
        toast.success(res.data.message || "Account verified successfully!");
        await getUserData();
        navigate("/mainpage");
      } else {
        toast.error(res.data.message || "Invalid OTP code. Please try again.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      toast.error(err.response?.data?.message || "Failed to verify. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const res = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
      if (res.data.success) {
        toast.success("A new verification OTP has been sent to your email!");
      } else {
        toast.error(res.data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
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
              <ShieldCheck size={28} />
            </div>
          </div>

          <h2 className="text-xl font-bold font-outfit text-zinc-50 mb-2 text-center">
            Verify Your Account
          </h2>
          <p className="text-xs text-zinc-400 text-center mb-6 max-w-xs mx-auto leading-relaxed">
            We have sent a 6-digit OTP code to your registered email address. Enter it below to complete verification.
          </p>

          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            {/* OTP Grid */}
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-lg font-bold bg-zinc-950 border border-zinc-800 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-emerald-400 transition-colors"
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 mt-2"
              loading={isLoading}
            >
              Verify Email
            </Button>
          </form>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 items-center text-xs">
            <div className="text-zinc-500">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-emerald-400 hover:text-emerald-300 font-semibold disabled:opacity-50 transition-colors"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            </div>
            <Link to="/login" className="text-zinc-500 hover:text-zinc-300 transition-colors mt-2">
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default EmailVerification;
