import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Target, ArrowRight } from "lucide-react";
import Card from "../components/ui/Card";

export default function StartupCard({ startup }) {
  const id = startup._id || startup.id;
  const name = startup.StartUpName || startup.companyName || startup.name || "Unnamed Startup";
  const tagline = startup.onLineDescription || startup.motto || startup.tagline || "Innovative tech startup.";
  const industry = startup.Category || startup.industry || "Technology";
  const stage = startup.fundingRound?.stage || startup.stage || "Seed";
  const size = startup.employeeCountRange || startup.size || "11-50";
  
  const location = startup.address || 
    (startup.location?.city ? `${startup.location.city}${startup.location.area ? `, ${startup.location.area}` : ""}` : "") || 
    `${startup.city || ""}, ${startup.state || ""}`.trim().replace(/^,\s*/, "") || 
    "";
    
  const techStack = startup.techStack || ["React", "Node.js"];
  // logoBg must be a CSS gradient class string (not a URL) — only use if it doesn't start with 'http'
  const rawLogoVal = startup.logoURL || startup.logoBg || "";
  const logoBg = (rawLogoVal && !rawLogoVal.startsWith("http")) ? rawLogoVal : "from-emerald-500 to-teal-600";
  const logoUrl = startup.logoUrl || (startup.logoURL?.startsWith("http") ? startup.logoURL : "") || "";

  return (
    <Card hoverable className="flex flex-col h-full bg-zinc-900 border-zinc-800/80 p-5 group">
      {/* Header Info */}
      <div className="flex items-start gap-4">
        {/* Startup Logo/Icon Placeholder */}
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
          <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500">
            <MapPin size={12} className="text-zinc-600" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      {/* Description / Elevator Pitch */}
      <p className="text-xs text-zinc-400 mt-4 leading-relaxed flex-1 line-clamp-2">
        {tagline}
      </p>

      {/* Meta Stats Details */}
      <div className="grid grid-cols-2 gap-2.5 my-4 py-3 border-t border-b border-zinc-800/50">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Target size={13} className="text-emerald-500" />
          <div>
            <p className="text-[10px] text-zinc-600 uppercase font-semibold leading-none">Funding Stage</p>
            <p className="text-zinc-300 font-medium mt-0.5">{stage}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Users size={13} className="text-emerald-500" />
          <div>
            <p className="text-[10px] text-zinc-600 uppercase font-semibold leading-none">Headcount</p>
            <p className="text-zinc-300 font-medium mt-0.5">{size} people</p>
          </div>
        </div>
      </div>

      {/* Tech Stack Badges */}
      <div className="flex flex-wrap gap-1 mb-4">
        {techStack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-400 px-2 py-0.5 rounded font-mono"
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

      {/* Action Footer */}
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
