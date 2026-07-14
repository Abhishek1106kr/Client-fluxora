import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Users, Target, ArrowRight,
  Briefcase, GraduationCap, DollarSign, Star, Globe, Wifi,
} from "lucide-react";
import Card from "../components/ui/Card";

// ── Badge pill ─────────────────────────────────────────────────────────────────
function Badge({ icon: Icon, label, color = "zinc" }) {
  const palette = {
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    blue:    "bg-blue-500/10 border-blue-500/20 text-blue-400",
    amber:   "bg-amber-500/10 border-amber-500/20 text-amber-400",
    purple:  "bg-purple-500/10 border-purple-500/20 text-purple-400",
    rose:    "bg-rose-500/10 border-rose-500/20 text-rose-400",
    zinc:    "bg-zinc-800 border-zinc-700 text-zinc-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${palette[color] || palette.zinc}`}>
      {Icon && <Icon size={9} />}
      {label}
    </span>
  );
}

// ── Work mode label ────────────────────────────────────────────────────────────
function workModeLabel(mode) {
  if (!mode) return null;
  const m = mode.toLowerCase();
  if (m === "remote")  return { label: "Remote",  color: "emerald", icon: Wifi };
  if (m === "hybrid")  return { label: "Hybrid",  color: "blue",    icon: Globe };
  if (m === "onsite")  return { label: "On-site", color: "amber",   icon: Briefcase };
  return null;
}

// ── Main card ──────────────────────────────────────────────────────────────────
export default function StartupCard({ startup }) {
  const id      = startup._id || startup.id;
  const name    = startup.StartUpName || startup.companyName || startup.name || "Unnamed Startup";
  const tagline = startup.onLineDescription || startup.motto || startup.tagline || "Innovative tech startup.";
  const industry = startup.Category || startup.industry || "Technology";
  const stage    = startup.fundingRound?.stage || startup.stage || "Seed";
  const size     = startup.employeeCountRange || startup.size || "11-50";

  const location =
    startup.address ||
    (startup.location?.city
      ? `${startup.location.city}${startup.location.area ? `, ${startup.location.area}` : ""}`
      : "") ||
    `${startup.city || ""}, ${startup.state || ""}`.trim().replace(/^,\s*/, "") ||
    "";

  const techStack = startup.techStack || ["React", "Node.js"];

  const rawLogoVal = startup.logoURL || startup.logoBg || "";
  const logoBg     = rawLogoVal && !rawLogoVal.startsWith("http")
    ? rawLogoVal
    : "from-emerald-500 to-teal-600";
  const logoUrl    = startup.logoUrl || (startup.logoURL?.startsWith("http") ? startup.logoURL : "") || "";

  const wm = workModeLabel(startup.workMode);

  // Collect opportunity badges
  const oppBadges = [
    startup.hiringNow       && { label: "Hiring Now",       color: "emerald", icon: Briefcase },
    startup.internship      && { label: "Internship",        color: "purple",  icon: GraduationCap },
    startup.paid            && { label: "Paid",              color: "amber",   icon: DollarSign },
    startup.equityAvailable && { label: "Equity",            color: "blue",    icon: Star },
    startup.visaSponsorship && { label: "Visa Sponsorship",  color: "rose",    icon: Globe },
  ].filter(Boolean);

  return (
    <Card hoverable className="flex flex-col h-full bg-zinc-900 border-zinc-800/80 p-5 group">
      {/* ── Header ── */}
      <div className="flex items-start gap-4">
        {/* Logo */}
        {logoUrl && (logoUrl.startsWith("http") || logoUrl.startsWith("https")) ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="w-12 h-12 rounded-xl object-cover shadow-md shadow-black/30 shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.outerHTML = `<div class="w-12 h-12 rounded-xl bg-gradient-to-br ${logoBg} flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-black/30 shrink-0 font-outfit">${name.charAt(0)}</div>`;
            }}
          />
        ) : (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${logoBg} flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-black/30 shrink-0 font-outfit`}>
            {name.charAt(0)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold font-outfit text-zinc-100 text-base truncate group-hover:text-emerald-400 transition-colors">
              {name}
            </h3>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wide">
              {industry}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
            <MapPin size={12} className="text-zinc-600" />
            <span className="truncate">{location}</span>
            {wm && (
              <Badge icon={wm.icon} label={wm.label} color={wm.color} />
            )}
          </div>
        </div>
      </div>

      {/* ── Tagline ── */}
      <p className="text-xs text-zinc-400 mt-4 leading-relaxed flex-1 line-clamp-2">
        {tagline}
      </p>

      {/* ── Meta stats ── */}
      <div className="grid grid-cols-2 gap-2.5 my-4 py-3 border-t border-b border-zinc-800/50">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Target size={13} className="text-emerald-500" />
          <div>
            <p className="text-[10px] text-zinc-600 uppercase font-semibold leading-none">Stage</p>
            <p className="text-zinc-300 font-medium mt-0.5 capitalize">{stage}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Users size={13} className="text-emerald-500" />
          <div>
            <p className="text-[10px] text-zinc-600 uppercase font-semibold leading-none">Headcount</p>
            <p className="text-zinc-300 font-medium mt-0.5">{size}</p>
          </div>
        </div>
      </div>

      {/* ── Tech stack ── */}
      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 3 && (
            <span className="text-[10px] text-zinc-600 self-center pl-1 font-semibold">
              +{techStack.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* ── Opportunity badges ── */}
      {oppBadges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {oppBadges.map(({ label, color, icon }) => (
            <Badge key={label} label={label} color={color} icon={icon} />
          ))}
        </div>
      )}

      {/* ── Action footer ── */}
      <Link
        to={`/startups/${id}`}
        className="w-full flex items-center justify-center gap-1.5 py-2 mt-auto border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800/80 rounded-lg text-xs font-semibold text-zinc-300 hover:text-emerald-400 transition-all duration-200"
      >
        <span>View Profile</span>
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </Card>
  );
}
