import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Rocket, Sparkles } from "lucide-react";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { backendUrl } = useContext(AppContext);

  async function handleSignup(e) {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!name || !email || !password) {
      setErrorMessage("Please fill all fields");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const payload = { name, email, password };
      const res = await axios.post(`${backendUrl}/api/auth/register`, payload);
      
      if (res.data.success) {
        toast.success(res.data.message || "Registration successful! Please login.");
        navigate("/login");
      } else {
        setErrorMessage(res.data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Signup failed. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12 relative overflow-hidden font-inter text-zinc-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center p-3 rounded-xl bg-emerald-600/10 border border-emerald-500/20 mb-3">
            <Rocket size={24} className="text-emerald-500" />
          </div>
          <span className="font-outfit font-extrabold text-2xl tracking-tight text-zinc-50">
            Flux<span className="text-emerald-500">ora</span>
          </span>
          <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
            <Sparkles size={12} className="text-emerald-400" />
            Build your professional future
          </p>
        </div>

        <Card className="p-8 bg-zinc-900 border-zinc-800 shadow-2xl">
          <h2 className="text-xl font-bold font-outfit text-zinc-50 mb-5 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <InputField
              label="Full Name"
              id="name"
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              icon={User}
            />
            <InputField
              label="Email Address"
              id="email"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              icon={Mail}
            />
            <InputField
              label="Create Password"
              id="password"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              autoComplete="new-password"
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
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-500">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Log In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Signup;
