import React from "react";
import { ArrowRight, Sparkles, Zap, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import developerHeroImg from "../assets/dashboard_eng.jpg.png";
// import Signup from "../Signup/Signup";

const stats = [
  { icon: Zap,    label: "Active Projects",  value: "2,400+" },
  { icon: Users,  label: "Startups Onboard", value: "340+"   },
  { icon: Trophy, label: "Students Hired",   value: "12,000+" },
];

const HeroSection = () => {
  const handleExploreClick = (e) => {
    e.preventDefault();
    document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" });
  };
  const handleSignupClick = () => {
    navigate('/signup');
  }

  return (
    <section className="relative overflow-hidden bg-zinc-950" style={{ minHeight: "680px" }}>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-[560px] w-[560px] rounded-full bg-emerald-500/8 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-teal-600/6 blur-[120px]" />

      {/* ────────────────────────────────────────────────────────
          IMAGE — absolutely positioned, starts at 38% from left,
          large enough to feel dominant, not isolated
      ──────────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block"
        style={{ left: "38%" }}
      >
        <img
          src={developerHeroImg}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            height: "100%",
            width: "100%",
            objectFit: "contain",
            objectPosition: "right bottom",
          }}
        />

        {/* Left edge — very wide, the primary blend */}
        <div
          className="absolute inset-y-0 left-0 z-10"
          style={{
            width: "50%",
            background:
              "linear-gradient(to right, #09090b 0%, #09090b 5%, rgba(9,9,11,0.85) 40%, transparent 100%)",
          }}
        />
        {/* Bottom edge */}
        <div
          className="absolute inset-x-0 bottom-0 z-10"
          style={{
            height: "38%",
            background:
              "linear-gradient(to top, #09090b 0%, #09090b 12%, rgba(9,9,11,0.6) 55%, transparent 100%)",
          }}
        />
        {/* Top edge */}
        <div
          className="absolute inset-x-0 top-0 z-10"
          style={{
            height: "22%",
            background: "linear-gradient(to bottom, #09090b 0%, transparent 100%)",
          }}
        />
        {/* Right edge */}
        <div
          className="absolute inset-y-0 right-0 z-10"
          style={{
            width: "10%",
            background: "linear-gradient(to left, #09090b 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ────────────────────────────────────────────────────────
          TEXT CONTENT — z-20 so it always sits above image layers
      ──────────────────────────────────────────────────────── */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex min-h-[680px] flex-col justify-center py-20 lg:w-[52%]">

          {/* Badge */}
          <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-sm">
            <Sparkles size={11} className="animate-pulse" />
            <span>Bridging students &amp; startups</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-50 md:text-6xl lg:text-[68px] leading-[1.06]">
            Your Career
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Starts Here.
            </span>
          </h1>

          {/* Sub-copy */}
          <p className="mt-6 max-w-sm text-base md:text-lg text-zinc-400 leading-relaxed">
            Real projects, hackathons, and internships — matched to your skills. Build a portfolio that gets you hired.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/signup">
              <Button size="lg" variant="primary" onClick={handleSignupClick}>
                Get Started — it's free
              </Button>
            </Link>
            <a href="#opportunities" onClick={handleExploreClick}>
              <Button size="lg" variant="secondary" icon={ArrowRight}>
                Browse Opportunities
              </Button>
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-14 flex flex-wrap gap-8 border-t border-zinc-800/60 pt-8">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <Icon size={15} />
                </span>
                <div>
                  <p className="text-base font-bold text-zinc-100 leading-none">{value}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-zinc-800" />
    </section>
  );
};

export default HeroSection;