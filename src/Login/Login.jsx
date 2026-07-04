import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Rocket, Sparkles } from "lucide-react";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { AppContext } from "../context/AppContext";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill all fields");
      setIsLoading(false);
      return;
    }

    try {
      const apiObj = { email, password };
      console.log(apiObj);
      const res = await axios.post(`${backendUrl}/api/auth/login`, apiObj);

      if (res.data.success) {
        setIsLoggedIn(true);
        await getUserData();
        navigate("/mainpage");
      } else {
        setErrorMessage(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden font-inter text-zinc-100">
      {/* Subtle background highlight */}
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
          <h2 className="text-xl font-bold font-outfit text-zinc-50 mb-6 text-center">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
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

            <div className="flex flex-col gap-1.5">
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
              <div className="flex justify-end">
                <Link
                  to="/resetPassword"
                  className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

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
              Sign In
            </Button>
          </form>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-zinc-800/80"></div>
            <span className="flex-shrink mx-4 text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Or continue with</span>
            <div className="flex-grow border-t border-zinc-800/80"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 font-sans">
            <button 
              onClick={handleGoogleLogin} 
              type="button"
              className="flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 p-3 rounded-xl font-semibold text-xs transition"
            >
              Google
            </button>
            <button 
              onClick={handleGithubLogin} 
              type="button"
              className="flex items-center justify-center gap-2 bg-[#0A192F] hover:bg-[#0c203b] border border-zinc-800/20 text-white p-3 rounded-xl font-semibold text-xs transition"
            >
              GitHub
            </button>
          </div>


          <div className="mt-6 text-center text-xs text-zinc-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Create one
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Login;
