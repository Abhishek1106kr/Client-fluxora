import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Rocket, Sparkles, ArrowLeft } from "lucide-react";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

export default function StartupLogin() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (isSignup && (!name || !email || !password)) {
      setErrorMessage("Please fill all fields");
      setIsLoading(false);
      return;
    }
    if (!isSignup && (!email || !password)) {
      setErrorMessage("Please fill all fields");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignup) {
        // Register Startup User
        const payload = { name, email, password, role: "startup" };
        const res = await axios.post(`${backendUrl}/api/auth/register`, payload);
        if (res.data.success) {
          toast.success("Startup user registered successfully! Please log in.");
          setIsSignup(false);
          setName("");
          setPassword("");
        } else {
          setErrorMessage(res.data.message || "Registration failed.");
        }
      } else {
        // Login Startup User
        const payload = { email, password };
        const res = await axios.post(`${backendUrl}/api/auth/login`, payload);
        if (res.data.success) {
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("authToken", res.data.token);
          }
          setIsLoggedIn(true);
          await getUserData();
          toast.success("Logged in successfully as Startup!");
          navigate("/startup/dashboard");
        } else {
          setErrorMessage(res.data.message || "Login failed.");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMessage(
        err.response?.data?.message || "Authentication failed. Please check your network or credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden font-inter text-zinc-100">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back navigation */}
        <Link to="/mainpage" className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-xs font-semibold mb-6 transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Main Site</span>
        </Link>

        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center p-3 rounded-xl bg-emerald-600/10 border border-emerald-500/20 mb-3">
            <Rocket size={24} className="text-emerald-500" />
          </div>
          <span className="font-outfit font-extrabold text-2xl tracking-tight text-zinc-50">
            Flux<span className="text-emerald-500">ora</span> For Startups
          </span>
          <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
            <Sparkles size={12} className="text-emerald-400" />
            Empowering early-stage team recruitment
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-8 bg-zinc-900 border-zinc-800 shadow-2xl">
          <h2 className="text-xl font-bold font-outfit text-zinc-50 mb-6 text-center">
            {isSignup ? "Register Startup Account" : "Startup Sign In"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {isSignup && (
              <InputField
                label="Full Name / Representative"
                id="name"
                type="text"
                placeholder="e.g. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                icon={User}
              />
            )}

            <InputField
              label="Company Email Address"
              id="email"
              type="email"
              placeholder="founders@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              icon={Mail}
            />

            <InputField
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              icon={Lock}
            />

            {errorMessage && (
              <div className="p-3 text-xs font-semibold text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 mt-2"
              loading={isLoading}
            >
              {isSignup ? "Sign Up as Startup" : "Sign In"}
            </Button>
          </form>

          {/* Toggle modes */}
          <div className="mt-6 text-center text-xs text-zinc-500">
            {isSignup ? (
              <>
                Already have a startup account?{" "}
                <button
                  onClick={() => {
                    setIsSignup(false);
                    setErrorMessage("");
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors focus:outline-none"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Want to register your venture?{" "}
                <button
                  onClick={() => {
                    setIsSignup(true);
                    setErrorMessage("");
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors focus:outline-none"
                >
                  Create Startup Profile
                </button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
