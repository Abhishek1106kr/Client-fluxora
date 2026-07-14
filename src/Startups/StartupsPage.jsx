import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import {
  Search, Plus, HelpCircle, Sparkles, MapPin, SlidersHorizontal,
  X, ChevronDown, ChevronUp, Wifi, Briefcase, Users, Globe,
  DollarSign, Star, GraduationCap, BadgeCheck, Navigation,
  LocateFixed, Phone, ExternalLink, Clock, Star as StarIcon, RefreshCw,
} from "lucide-react";
import StartupCard from "./StartupCard";
import StartupOnboarding from "./StartupOnboarding";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

// ─── Filter option lists ───────────────────────────────────────────────────────

const DISTANCE_RADIUS = [
  { label: "5 km",  value: 5000  },
  { label: "10 km", value: 10000 },
  { label: "25 km", value: 25000 },
];

const NEARBY_KEYWORDS = [
  { label: "Startup",          value: "startup" },
  { label: "Software Company", value: "software company" },
  { label: "AI Company",       value: "AI company" },
  { label: "Tech Company",     value: "tech company" },
  { label: "SaaS Company",     value: "SaaS company" },
  { label: "IT Company",       value: "IT company" },
];

const WORK_MODE_OPTIONS = [
  { label: "All Modes", value: "" },
  { label: "Remote",    value: "remote" },
  { label: "Hybrid",    value: "hybrid" },
  { label: "On-site",   value: "onsite" },
];

const STAGE_OPTIONS = [
  { label: "All Stages",   value: "" },
  { label: "Idea",         value: "idea" },
  { label: "Pre-Seed",     value: "pre-seed" },
  { label: "Seed",         value: "seed" },
  { label: "Series A",     value: "series A" },
  { label: "Series B+",    value: "series B" },
  { label: "Bootstrapped", value: "bootstrapped" },
];

const TEAM_SIZE_OPTIONS = [
  { label: "Any Size",  value: "" },
  { label: "1 – 10",    value: "1-10" },
  { label: "11 – 50",   value: "11-50" },
  { label: "51 – 200",  value: "51-200" },
  { label: "200+",      value: "200+" },
];

const INDUSTRY_OPTIONS = [
  { label: "All Industries", value: "" },
  { label: "AI & ML",        value: "AI/ML" },
  { label: "FinTech",        value: "FinTech" },
  { label: "HealthTech",     value: "HealthTech" },
  { label: "EdTech",         value: "EdTech" },
  { label: "SaaS",           value: "SaaS" },
  { label: "Web3 / Crypto",  value: "Web3" },
  { label: "Other",          value: "Other" },
];

const TECH_STACK_OPTIONS = [
  "React", "Node.js", "Python", "TypeScript", "Go", "Rust",
  "Next.js", "Flutter", "Kotlin", "Swift", "Solidity", "AWS",
];

const INDUSTRY_CATEGORY_MAP = {
  "AI/ML": "technology", "SaaS": "technology",
  "FinTech": "fintech", "HealthTech": "healthcare",
  "EdTech": "edtech", "Web3": "other", "Other": "other",
};

const DEFAULT_FILTERS = {
  search: "", workMode: "", stage: "", teamSize: "", industry: "",
  techStack: [], hiringNow: false, internship: false, paid: false,
  visaSponsorship: false, equityAvailable: false,
};

function toggleArr(arr, val) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

// ─── FilterChip ────────────────────────────────────────────────────────────────
function FilterChip({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 select-none ${
        active
          ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-950/30"
          : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
      }`}
    >
      {Icon && <Icon size={11} />}
      {label}
    </button>
  );
}

// ─── Google Places card ────────────────────────────────────────────────────────
function GooglePlaceCard({ place }) {
  const name    = place.StartUpName || place.companyName || "Unknown";
  const logo    = place.logoUrl || place.logoURL || "";
  const address = place.address || "";
  const rating  = place.rating;
  const rCount  = place.ratingCount;
  const open    = place.openNow;
  const phone   = place.phone;
  const website = place.WebSiteUrl || place.website;
  const mapsUrl = place.mapsUrl;
  const tagline = place.onLineDescription || "";
  const photo   = place.photos?.[0] || "";

  return (
    <Card hoverable className="flex flex-col h-full bg-zinc-900 border-zinc-800/80 overflow-hidden group">
      {/* Cover photo */}
      {photo ? (
        <div className="h-32 w-full overflow-hidden shrink-0">
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
      ) : (
        <div className="h-24 w-full bg-gradient-to-br from-blue-900/40 to-indigo-900/40 shrink-0 flex items-center justify-center">
          <MapPin size={28} className="text-blue-400/40" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <img
            src={logo}
            alt={name}
            className="w-10 h-10 rounded-xl object-cover border border-zinc-700 shrink-0 bg-zinc-800"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e293b&color=94a3b8&size=80`;
            }}
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold font-outfit text-zinc-100 text-sm truncate group-hover:text-blue-400 transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-zinc-500">
              <MapPin size={10} className="text-zinc-600 shrink-0" />
              <span className="truncate">{address}</span>
            </div>
          </div>
          {/* Google Maps badge */}
          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-blue-500/10 border-blue-500/20 text-blue-400">
            Google
          </span>
        </div>

        {/* Rating + open status */}
        <div className="flex items-center gap-3 text-xs">
          {rating && (
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <StarIcon size={11} fill="currentColor" />
              {rating.toFixed(1)}
              <span className="text-zinc-600 font-normal">({rCount?.toLocaleString()})</span>
            </span>
          )}
          {open !== null && (
            <span className={`flex items-center gap-1 font-semibold ${open ? "text-emerald-400" : "text-red-400"}`}>
              <Clock size={10} />
              {open ? "Open Now" : "Closed"}
            </span>
          )}
        </div>

        {/* Tagline / business types */}
        {tagline && (
          <p className="text-[11px] text-zinc-500 capitalize leading-relaxed line-clamp-2 flex-1">
            {tagline}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-zinc-800/60">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-emerald-400 transition-all"
            >
              <ExternalLink size={11} /> Website
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-blue-400 transition-all"
            >
              <Phone size={11} /> {phone}
            </a>
          )}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-blue-400 transition-all"
            >
              <MapPin size={11} /> Maps
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="h-72 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl animate-pulse" />
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function StartupsPage() {
  const { backendUrl, userData } = useContext(AppContext);

  // ── State ────────────────────────────────────────────────────────────────────
  const [startups, setStartups]         = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError]   = useState("");
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [filters, setFilters]           = useState(DEFAULT_FILTERS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // View: "local" | "registered" | "nearby"
  const [viewMode, setViewMode] = useState("local");

  // Applied location for local/registered modes
  const [appliedLocation, setAppliedLocation] = useState({ city: "Bangalore", area: "Whitefield" });

  // Nearby (Google) mode state
  const [userCoords, setUserCoords]       = useState(null);
  const [selectedRadius, setSelectedRadius] = useState(10000);
  const [activeKeywords, setActiveKeywords] = useState(["startup", "tech company"]);
  const nearbyFetchRef = useRef(false);

  // ── Read location from dev_profile ──────────────────────────────────────────
  useEffect(() => {
    const profileStr = localStorage.getItem("dev_profile");
    if (profileStr) {
      try {
        const parsed = JSON.parse(profileStr);
        if (parsed.location && parsed.location !== "NA") {
          const parts = parsed.location.split(",").map(p => p.trim());
          setAppliedLocation({ city: parts[0] || "Bangalore", area: parts[1] || "" });
        }
      } catch (e) { /* ignore */ }
    }
  }, [userData]);

  // ── Fetch registered / local startups ───────────────────────────────────────
  const fetchStartups = useCallback(async () => {
    if (!backendUrl || viewMode === "nearby") return;
    setIsLoading(true);
    try {
      const url = viewMode === "local"
        ? `${backendUrl}/api/startup/local?city=${encodeURIComponent(appliedLocation.city)}&area=${encodeURIComponent(appliedLocation.area)}`
        : `${backendUrl}/api/startup/all`;
      const { data } = await axios.get(url);
      if (data.success) setStartups(data.data || data.startups || []);
      else toast.error(data.message || "Failed to load startups.");
    } catch (err) {
      toast.error("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, viewMode, appliedLocation.city, appliedLocation.area]);

  useEffect(() => { fetchStartups(); }, [fetchStartups]);

  // ── Geolocation + Google Places fetch ───────────────────────────────────────
  const fetchNearbyPlaces = useCallback(async (coords, radius, keywords) => {
    if (!backendUrl || !coords) return;
    setNearbyLoading(true);
    setNearbyError("");
    try {
      const kwParam = keywords.join(",");
      const { data } = await axios.get(
        `${backendUrl}/api/startup/nearby?lat=${coords.lat}&lng=${coords.lng}&radius=${radius}&keywords=${encodeURIComponent(kwParam)}`
      );
      if (data.success) setNearbyPlaces(data.data || []);
      else setNearbyError(data.message || "Failed to load nearby startups.");
    } catch (err) {
      setNearbyError("Could not reach the server. Try again.");
    } finally {
      setNearbyLoading(false);
    }
  }, [backendUrl]);

  // When switching to nearby mode, auto-request geolocation
  useEffect(() => {
    if (viewMode !== "nearby") return;
    if (userCoords) {
      fetchNearbyPlaces(userCoords, selectedRadius, activeKeywords);
      return;
    }
    if (!nearbyFetchRef.current) {
      nearbyFetchRef.current = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(coords);
          fetchNearbyPlaces(coords, selectedRadius, activeKeywords);
        },
        () => {
          setNearbyError("Location access denied. Please allow location to use this mode.");
          setNearbyLoading(false);
        },
        { timeout: 10000 }
      );
    }
  }, [viewMode]);

  // Re-fetch when radius or keywords change in nearby mode
  useEffect(() => {
    if (viewMode === "nearby" && userCoords) {
      fetchNearbyPlaces(userCoords, selectedRadius, activeKeywords);
    }
  }, [selectedRadius, activeKeywords.join(",")]);

  const toggleKeyword = (kw) =>
    setActiveKeywords(prev =>
      prev.includes(kw)
        ? prev.filter(k => k !== kw)
        : [...prev, kw]
    );

  const handleOnboardingSuccess = (name) => {
    fetchStartups();
    setIsModalOpen(false);
    toast.success(`${name} is now onboarded on Fluxora!`);
  };

  // ── Client-side filter for registered/local startups ─────────────────────────
  const filteredStartups = startups.filter((startup) => {
    const name      = (startup.StartUpName || startup.name || "").toLowerCase();
    const tagline   = (startup.onLineDescription || startup.tagline || "").toLowerCase();
    const techStack = startup.techStack || [];
    const industry  = startup.Category || startup.industry || "";
    const stage     = (startup.fundingRound?.stage || startup.stage || "").toLowerCase();
    const size      = startup.employeeCountRange || startup.size || "";
    const workMode  = (startup.workMode || "").toLowerCase();

    const q = filters.search.toLowerCase();
    if (q && !name.includes(q) && !tagline.includes(q) &&
        !techStack.some(t => t.toLowerCase().includes(q))) return false;
    if (filters.industry) {
      const mapped = (INDUSTRY_CATEGORY_MAP[filters.industry] || filters.industry).toLowerCase();
      if (industry.toLowerCase() !== mapped) return false;
    }
    if (filters.stage) {
      const sv = filters.stage.toLowerCase();
      if (!stage.includes(sv) && !sv.includes(stage)) return false;
    }
    if (filters.teamSize && size !== filters.teamSize) return false;
    if (filters.workMode && workMode && workMode !== filters.workMode) return false;
    if (filters.techStack.length > 0) {
      if (!filters.techStack.every(t => techStack.some(st => st.toLowerCase() === t.toLowerCase()))) return false;
    }
    if (filters.hiringNow       && startup.hiringNow       === false) return false;
    if (filters.internship      && startup.internship       === false) return false;
    if (filters.paid            && startup.paid             === false) return false;
    if (filters.visaSponsorship && startup.visaSponsorship  === false) return false;
    if (filters.equityAvailable && startup.equityAvailable  === false) return false;
    return true;
  });

  // ── Filter helpers ───────────────────────────────────────────────────────────
  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }));
  const toggleBool = (key) => setFilters(f => ({ ...f, [key]: !f[key] }));
  const toggleTech = (tech) => setFilters(f => ({ ...f, techStack: toggleArr(f.techStack, tech) }));
  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const activeCount = [
    filters.search, filters.workMode, filters.stage, filters.teamSize, filters.industry,
    filters.hiringNow, filters.internship, filters.paid, filters.visaSponsorship,
    filters.equityAvailable, filters.techStack.length > 0,
  ].filter(Boolean).length;

  const VIEW_TABS = [
    { value: "local",      label: "Local Match" },
    { value: "registered", label: "Registered" },
    { value: "nearby",     label: "📍 Nearby on Google" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10 max-w-7xl mx-auto relative">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-10 left-1/3 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-80 w-80 rounded-full bg-blue-500/5 blur-[100px]" />

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={13} className="animate-pulse" />
            <span>Fluxora Ecosystem</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-outfit text-zinc-50 tracking-tight leading-none">
            Explore Partner Startups
          </h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-xl leading-relaxed">
            Collaborate, complete development milestones, and build products with high-growth early-stage ventures.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          icon={Plus}
          className="self-start md:self-auto shrink-0 shadow-lg shadow-emerald-950/20"
        >
          Register Startup
        </Button>
      </div>

      {/* ── View-mode tabs ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 relative z-10">
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-xl w-fit gap-0.5">
          {VIEW_TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setViewMode(value)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                viewMode === value
                  ? value === "nearby"
                    ? "bg-blue-600 text-zinc-50 shadow-md shadow-blue-950/30"
                    : "bg-emerald-600 text-zinc-50 shadow-md shadow-emerald-950/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {viewMode === "local" && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/60 border border-zinc-800/80 px-4 py-2 rounded-xl backdrop-blur-sm self-start">
            <Navigation size={13} className="text-emerald-400" />
            <span>
              Matching: <strong className="text-emerald-300 font-semibold">{appliedLocation.city}</strong>
              {appliedLocation.area ? ` (${appliedLocation.area})` : ""}
            </span>
          </div>
        )}

        {viewMode === "nearby" && userCoords && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-blue-900/20 border border-blue-800/40 px-4 py-2 rounded-xl backdrop-blur-sm self-start">
            <LocateFixed size={13} className="text-blue-400" />
            <span className="text-blue-300 font-semibold">Using your location</span>
            <span className="text-zinc-500">({userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)})</span>
          </div>
        )}
      </div>

      {/* ── Nearby-mode controls ── */}
      {viewMode === "nearby" && (
        <Card className="bg-zinc-900/60 border-zinc-800/60 p-4 md:p-5 mb-8 relative z-10 backdrop-blur-md">
          <div className="flex flex-col gap-4">
            {/* Distance */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation size={12} /> Distance
              </span>
              {DISTANCE_RADIUS.map(({ label, value }) => (
                <FilterChip
                  key={value}
                  label={label}
                  active={selectedRadius === value}
                  onClick={() => setSelectedRadius(value)}
                />
              ))}
              {userCoords && (
                <button
                  onClick={() => fetchNearbyPlaces(userCoords, selectedRadius, activeKeywords)}
                  disabled={nearbyLoading}
                  className="ml-auto flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                >
                  <RefreshCw size={12} className={nearbyLoading ? "animate-spin" : ""} />
                  Refresh
                </button>
              )}
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Search size={12} /> Business Type
              </span>
              {NEARBY_KEYWORDS.map(({ label, value }) => (
                <FilterChip
                  key={value}
                  label={label}
                  active={activeKeywords.includes(value)}
                  onClick={() => toggleKeyword(value)}
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* ── Filter panel (local / registered modes only) ── */}
      {viewMode !== "nearby" && (
        <Card className="bg-zinc-900/60 border-zinc-800/60 mb-8 relative z-10 backdrop-blur-md overflow-hidden">
          <div className="p-4 md:p-5 flex flex-col md:flex-row gap-3 items-start md:items-end">
            <div className="flex-1 min-w-[220px]">
              <InputField label="Search" id="startup-search"
                placeholder="Name, pitch, tech stack…"
                value={filters.search} onChange={e => set("search", e.target.value)}
                icon={Search}
              />
            </div>
            <div className="min-w-[160px]">
              <Select label="Industry" id="industry" value={filters.industry}
                onChange={e => set("industry", e.target.value)} options={INDUSTRY_OPTIONS} />
            </div>
            <div className="min-w-[150px]">
              <Select label="Stage" id="stage" value={filters.stage}
                onChange={e => set("stage", e.target.value)} options={STAGE_OPTIONS} />
            </div>
            <div className="min-w-[130px]">
              <Select label="Team Size" id="teamSize" value={filters.teamSize}
                onChange={e => set("teamSize", e.target.value)} options={TEAM_SIZE_OPTIONS} />
            </div>
            <div className="flex items-center gap-2 mt-1 shrink-0">
              <button
                onClick={() => setShowAdvanced(v => !v)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  showAdvanced || activeCount > 0
                    ? "border-emerald-600 bg-emerald-600/10 text-emerald-400"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                <SlidersHorizontal size={13} />
                Filters
                {activeCount > 0 && (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
                {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              {activeCount > 0 && (
                <button onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-xs text-zinc-400 hover:text-zinc-200 transition-all">
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          </div>

          {showAdvanced && (
            <div className="border-t border-zinc-800/60 p-4 md:p-5 flex flex-col gap-5">
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <Wifi size={12} /> Work Mode
                </span>
                {WORK_MODE_OPTIONS.map(({ value, label }) => (
                  <FilterChip key={value || "all"} label={label}
                    active={filters.workMode === value}
                    onClick={() => set("workMode", filters.workMode === value ? "" : value)} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5 shrink-0 mr-1">
                  <BadgeCheck size={12} /> Opportunities
                </span>
                <FilterChip label="Hiring Now"       icon={Briefcase}     active={filters.hiringNow}       onClick={() => toggleBool("hiringNow")} />
                <FilterChip label="Internship"       icon={GraduationCap} active={filters.internship}      onClick={() => toggleBool("internship")} />
                <FilterChip label="Paid Roles"       icon={DollarSign}    active={filters.paid}            onClick={() => toggleBool("paid")} />
                <FilterChip label="Equity Available" icon={Star}          active={filters.equityAvailable} onClick={() => toggleBool("equityAvailable")} />
                <FilterChip label="Visa Sponsorship" icon={Globe}         active={filters.visaSponsorship} onClick={() => toggleBool("visaSponsorship")} />
              </div>
              <div>
                <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Users size={12} /> Tech Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {TECH_STACK_OPTIONS.map(tech => (
                    <FilterChip key={tech} label={tech}
                      active={filters.techStack.includes(tech)}
                      onClick={() => toggleTech(tech)} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ── Results count ── */}
      {!isLoading && !nearbyLoading && viewMode !== "nearby" && (
        <p className="text-xs text-zinc-500 mb-4 relative z-10">
          {filteredStartups.length} startup{filteredStartups.length !== 1 ? "s" : ""} found
          {activeCount > 0 && (
            <button onClick={clearFilters} className="ml-2 text-emerald-500 underline">clear filters</button>
          )}
        </p>
      )}
      {viewMode === "nearby" && !nearbyLoading && nearbyPlaces.length > 0 && (
        <p className="text-xs text-zinc-500 mb-4 relative z-10">
          {nearbyPlaces.length} businesses found nearby via Google Maps
        </p>
      )}

      {/* ── Grid ── */}
      {viewMode === "nearby" ? (
        /* GOOGLE PLACES MODE */
        nearbyLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : nearbyError ? (
          <Card className="bg-zinc-900 border-zinc-800/80 p-12 text-center my-10 max-w-xl mx-auto">
            <LocateFixed className="mx-auto text-zinc-600 mb-4" size={40} />
            <h3 className="text-lg font-bold font-outfit text-zinc-200">Location Required</h3>
            <p className="text-zinc-500 text-xs mt-2 max-w-xs mx-auto leading-relaxed">{nearbyError}</p>
            <Button variant="secondary" className="mt-6"
              onClick={() => { nearbyFetchRef.current = false; setViewMode("nearby"); }}>
              Try Again
            </Button>
          </Card>
        ) : nearbyPlaces.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800/80 p-12 text-center my-10 max-w-xl mx-auto">
            <HelpCircle className="mx-auto text-zinc-600 mb-4" size={40} />
            <h3 className="text-lg font-bold font-outfit text-zinc-200">No Businesses Found</h3>
            <p className="text-zinc-500 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
              Try increasing the radius or selecting different business type keywords.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {nearbyPlaces.map(place => (
              <GooglePlaceCard key={place._id} place={place} />
            ))}
          </div>
        )
      ) : (
        /* LOCAL / REGISTERED MODE */
        isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredStartups.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800/80 p-12 text-center my-10 max-w-xl mx-auto">
            <HelpCircle className="mx-auto text-zinc-600 mb-4" size={40} />
            <h3 className="text-lg font-bold font-outfit text-zinc-200">No Startups Found</h3>
            <p className="text-zinc-500 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
              No startups match your filters. Try widening your search.
            </p>
            <Button variant="secondary" onClick={clearFilters} className="mt-6">Reset Filters</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {filteredStartups.map(startup => (
              <StartupCard key={startup._id || startup.id} startup={startup} activeFilters={filters} />
            ))}
          </div>
        )
      )}

      {/* Onboarding Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title="Startup Registration & Onboarding" className="max-w-2xl">
        <StartupOnboarding onCancel={() => setIsModalOpen(false)} onSuccess={handleOnboardingSuccess} />
      </Modal>
    </div>
  );
}
