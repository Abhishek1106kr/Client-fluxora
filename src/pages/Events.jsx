import React, { useState, useEffect, useContext } from "react";
import {
  Calendar,
  MapPin,
  ExternalLink,
  Search,
  Sparkles,
  Tag,
  RefreshCw,
  Globe,
  Database,
  AlertCircle,
  Trophy,
  Users,
  Radio,
  Presentation,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import { AppContext } from "../context/AppContext";

// ── Backend URL ────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5002";

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(raw) {
  if (!raw) return "TBA";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(raw));
  } catch {
    return String(raw);
  }
}

function daysUntil(raw) {
  if (!raw) return null;
  const diff = Math.ceil((new Date(raw) - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `${diff}d left`;
}

// ── Type icon map ──────────────────────────────────────────────────────────────
const TYPE_ICON = {
  Hackathon: Trophy,
  Meetup: Users,
  Webinar: Radio,
  Conference: Presentation,
};

const TYPE_COLOR = {
  Hackathon: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Meetup: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Webinar: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Conference: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

// ── Source badge ───────────────────────────────────────────────────────────────
function SourceBadge({ source }) {
  const isExternal = source === "external_feed";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${
        isExternal
          ? "text-sky-400 bg-sky-400/10 border-sky-400/20"
          : "text-zinc-400 bg-zinc-800 border-zinc-700"
      }`}
    >
      {isExternal ? <Globe size={9} /> : <Database size={9} />}
      {isExternal ? "Devfolio" : "Fluxora"}
    </span>
  );
}

// ── Skeleton Card ──────────────────────────────────────────────────────────────
function SkeletonEventCard() {
  return (
    <div
      data-testid="event-skeleton"
      aria-busy="true"
      aria-label="Loading event"
      className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="h-5 bg-zinc-800 rounded w-2/3" />
        <div className="h-5 bg-zinc-800 rounded w-16" />
      </div>
      <div className="h-3 bg-zinc-800 rounded w-1/3" />
      <div className="h-3 bg-zinc-800 rounded w-1/2" />
      <div className="flex gap-2 mt-2">
        <div className="h-3 bg-zinc-800 rounded w-12" />
        <div className="h-3 bg-zinc-800 rounded w-12" />
      </div>
      <div className="h-9 bg-zinc-800 rounded mt-auto" />
    </div>
  );
}

// ── Event Card ─────────────────────────────────────────────────────────────────
function EventCard({ event }) {
  const TypeIcon = TYPE_ICON[event.type] || Sparkles;
  const typeColor = TYPE_COLOR[event.type] || "text-zinc-400 bg-zinc-800 border-zinc-700";
  const countdown = daysUntil(event.startDate);

  return (
    <Card
      hoverable
      data-testid={`event-card-${event._id}`}
      className="flex flex-col bg-zinc-900 border-zinc-800/80 p-5 gap-4 group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`shrink-0 p-2 rounded-xl border ${typeColor}`}>
            <TypeIcon size={16} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zinc-50 font-outfit leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
              {event.title}
            </h3>
            <SourceBadge source={event.source} />
          </div>
        </div>

        {countdown && (
          <span
            data-testid={`event-countdown-${event._id}`}
            className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 whitespace-nowrap"
          >
            {countdown}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className="flex flex-col gap-1.5 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-emerald-500 shrink-0" aria-hidden="true" />
          <span data-testid={`event-date-${event._id}`}>{formatDate(event.startDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-emerald-500 shrink-0" aria-hidden="true" />
          <span className="truncate">{event.location || "Online"}</span>
        </div>
      </div>

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div
          data-testid={`event-tags-${event._id}`}
          className="flex flex-wrap gap-1"
        >
          {event.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400"
            >
              <Tag size={8} aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <a
        href={event.registrationLink}
        target="_blank"
        rel="noreferrer noopener"
        data-testid={`event-register-btn-${event._id}`}
        aria-label={`Register for ${event.title}`}
        className="mt-auto"
      >
        <Button variant="primary" size="sm" className="w-full" icon={ExternalLink}>
          Register Now
        </Button>
      </a>
    </Card>
  );
}

// ── Filter Tab config ──────────────────────────────────────────────────────────
const FILTER_TABS = [
  { id: "all", label: "All Events" },
  { id: "Hackathon", label: "Hackathons" },
  { id: "Meetup", label: "Meetups" },
  { id: "Webinar", label: "Webinars" },
  { id: "Conference", label: "Conferences" },
];

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const { backendUrl } = useContext(AppContext);
  const base = backendUrl || API_BASE;

  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const fetchEvents = async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`${base}/api/events/events`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load events");
      setEvents(json.data || []);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ── Client-side filtering ────────────────────────────────────────────────────
  const filtered = events.filter((e) => {
    const matchesTab = activeTab === "all" || e.type === activeTab;
    const matchesSearch =
      !search ||
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase()) ||
      (e.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const isLoading = status === "loading";
  const hasError = status === "error";

  return (
    <div
      data-testid="events-page"
      className="flex flex-col gap-8 min-h-screen"
    >
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-900">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-400 font-medium mb-3">
            <Sparkles size={12} aria-hidden="true" />
            <span>Live from Devfolio + Fluxora</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-50 font-outfit">
            Upcoming Tech Events
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Discover hackathons, meetups, webinars, and conferences. Register directly from this page.
          </p>
          {status === "success" && (
            <p
              data-testid="events-count"
              className="text-xs text-zinc-500 mt-1"
            >
              {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Search + Refresh */}
        <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[340px]">
          <InputField
            id="events-search"
            data-testid="events-search-input"
            placeholder="Search by title, location, or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
            aria-label="Search events"
            className="flex-1"
          />
          <button
            data-testid="events-refresh-btn"
            aria-label="Refresh events"
            onClick={fetchEvents}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div
        data-testid="events-filter-tabs"
        role="tablist"
        aria-label="Filter events by type"
        className="flex flex-wrap gap-2"
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            data-testid={`filter-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls="events-grid"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
              activeTab === tab.id
                ? "bg-emerald-600 text-white border-transparent shadow-sm"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Error State ── */}
      {hasError && (
        <div
          data-testid="events-error-state"
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center py-16 gap-4 text-center border border-red-900/30 rounded-2xl bg-red-950/10"
        >
          <AlertCircle size={36} className="text-red-400" aria-hidden="true" />
          <div>
            <p className="text-red-400 font-semibold">Failed to load events</p>
            <p className="text-xs text-zinc-500 mt-1">{error}</p>
          </div>
          <Button
            data-testid="events-retry-btn"
            variant="secondary"
            size="sm"
            onClick={fetchEvents}
            icon={RefreshCw}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* ── Events Grid ── */}
      {!hasError && (
        <div
          id="events-grid"
          role="tabpanel"
          data-testid="events-grid"
          aria-label={`${activeTab === "all" ? "All" : activeTab} events`}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Skeleton loaders */}
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonEventCard key={i} />
            ))}

          {/* Real event cards */}
          {!isLoading &&
            filtered.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && status === "success" && (
            <div
              data-testid="events-empty-state"
              className="col-span-full py-20 text-center text-zinc-500 text-sm border border-zinc-900 rounded-2xl bg-zinc-900/10"
            >
              <Sparkles className="mx-auto mb-3 text-zinc-700" size={28} aria-hidden="true" />
              <p className="font-semibold">No events match your filter.</p>
              <p className="text-xs mt-1 text-zinc-600">
                Try changing the category tab or clearing your search.
              </p>
              <button
                className="mt-4 text-xs text-emerald-500 underline"
                onClick={() => { setActiveTab("all"); setSearch(""); }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Info footer ── */}
      {status === "success" && events.length > 0 && (
        <p
          data-testid="events-feed-info"
          className="text-[11px] text-zinc-600 text-center pb-4"
        >
          Data sourced from Fluxora platform events and the Devfolio hackathon feed.
          External events open in a new tab.
        </p>
      )}
    </div>
  );
}
