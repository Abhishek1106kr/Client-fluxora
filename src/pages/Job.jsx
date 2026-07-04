import React, { useState, useEffect, useContext } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Tag,
  Clock,
} from "lucide-react";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { AppContext } from "../context/AppContext";

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeSince(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const JOB_TYPE_COLOR = {
  "Full Time": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Part Time": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Contract: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Temporary: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Internship: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const SOURCE_LABEL = {
  platform_internal: "Fluxora",
  external_feed: "Remotive",
};

// ── Skeleton Card ──────────────────────────────────────────────────────────────
function SkeletonJobCard() {
  return (
    <div
      data-testid="job-skeleton"
      aria-busy="true"
      className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-4"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
          <div className="h-3 bg-zinc-800 rounded w-1/2" />
        </div>
        <div className="h-5 w-20 bg-zinc-800 rounded-full" />
      </div>
      <div className="h-3 bg-zinc-800 rounded w-full" />
      <div className="h-3 bg-zinc-800 rounded w-5/6" />
      <div className="flex gap-2 mt-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 w-14 bg-zinc-800 rounded" />
        ))}
      </div>
      <div className="h-9 bg-zinc-800 rounded-xl mt-2" />
    </div>
  );
}

// ── Job Card ───────────────────────────────────────────────────────────────────
function JobCard({ job }) {
  const typeStyle = JOB_TYPE_COLOR[job.jobType] || JOB_TYPE_COLOR["Full Time"];
  const tags = Array.isArray(job.tags) ? job.tags : (job.tags ? [job.tags] : []);

  return (
    <Card
      hoverable
      data-testid={`job-card-${job._id}`}
      className="flex flex-col bg-zinc-900 border-zinc-800/80 p-6 gap-4 group"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Company logo or fallback placeholder */}
        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center text-zinc-400 font-bold text-lg shrink-0 uppercase">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load, remove it and show fallback letter
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = job.company?.charAt(0) ?? "?";
              }}
            />
          ) : (
            job.company?.charAt(0) ?? "?"
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-50 font-outfit leading-snug group-hover:text-emerald-400 transition-colors truncate">
            {job.title}
          </h3>
          <p className="text-sm text-zinc-400 mt-0.5 truncate">{job.company}</p>
        </div>

        <span
          data-testid={`job-type-${job._id}`}
          className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeStyle}`}
        >
          {job.jobType || "Full Time"}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <MapPin size={11} className="text-emerald-500" />
          {job.location || "Remote"}
        </span>
        {job.createdAt && (
          <span className="flex items-center gap-1.5">
            <Clock size={11} className="text-zinc-600" />
            {timeSince(job.createdAt)}
          </span>
        )}
        <span className="ml-auto text-[10px] text-zinc-600 font-semibold">
          {SOURCE_LABEL[job.source] || "Platform"}
        </span>
      </div>

      {/* Description */}
      <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
        {job.description || "No description provided."}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div
          data-testid={`job-tags-${job._id}`}
          className="flex flex-wrap gap-1.5"
        >
          {tags.slice(0, 5).map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400"
            >
              <Tag size={8} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      {job.applyLink ? (
        <a
          href={job.applyLink}
          target="_blank"
          rel="noreferrer noopener"
          data-testid={`job-apply-btn-${job._id}`}
          aria-label={`Apply to ${job.title} at ${job.company}`}
        >
          <Button variant="primary" size="md" className="w-full mt-auto" icon={ExternalLink}>
            Apply Now
          </Button>
        </a>
      ) : (
        <Button variant="secondary" size="md" className="w-full mt-auto" disabled>
          No Link Provided
        </Button>
      )}
    </Card>
  );
}

// ── Filter config ──────────────────────────────────────────────────────────────
const JOB_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "Full Time", label: "Full Time" },
  { value: "Part Time", label: "Part Time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Temporary", label: "Temporary" },
];

const SOURCE_OPTIONS = [
  { value: "all", label: "All Sources" },
  { value: "platform_internal", label: "Fluxora Jobs" },
  { value: "external_feed", label: "External Feed" },
];

// ── Main Page ──────────────────────────────────────────────────────────────────
const Jobs = () => {
  const { backendUrl } = useContext(AppContext);
  const base = backendUrl || "http://localhost:5000";

  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");

  const fetchJobs = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`${base}/api/jobs`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch jobs");
      setJobs(json.data || []);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ── Client-side filtering ─────────────────────────────────────────────────────
  const filtered = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      job.title?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q) ||
      (Array.isArray(job.tags) && job.tags.some((t) => t.toLowerCase().includes(q)));
    const matchesType = selectedType === "all" || job.jobType === selectedType;
    const matchesSource = selectedSource === "all" || job.source === selectedSource;
    return matchesSearch && matchesType && matchesSource;
  });

  const isLoading = status === "loading";
  const hasError = status === "error";

  return (
    <div data-testid="jobs-page" className="flex flex-col gap-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-900">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-400 font-medium mb-3">
            <Sparkles size={12} />
            <span>Live from Fluxora + The Muse</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-50 font-outfit">
            Find Your Dream Job
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Browse active roles posted by startups on Fluxora and curated listings from The Muse.
          </p>
          {status === "success" && (
            <p data-testid="jobs-count" className="text-xs text-zinc-500 mt-1">
              {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Search + Refresh */}
        <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[400px]">
          <InputField
            id="jobs-search"
            data-testid="jobs-search-input"
            placeholder="Search title, company, skills…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            aria-label="Search jobs"
            className="flex-1"
          />
          <button
            data-testid="jobs-refresh-btn"
            aria-label="Refresh job listings"
            onClick={fetchJobs}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div
        data-testid="jobs-filters"
        className="flex flex-wrap gap-3 items-center"
      >
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Briefcase size={13} />
          <span className="font-semibold uppercase tracking-wider">Type:</span>
        </div>
        <Select
          id="job-type-filter"
          data-testid="select-job-type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          options={JOB_TYPE_OPTIONS}
          className="w-40"
          aria-label="Filter by job type"
        />
        <Select
          id="job-source-filter"
          data-testid="select-job-source"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          options={SOURCE_OPTIONS}
          className="w-44"
          aria-label="Filter by source"
        />
        {(searchQuery || selectedType !== "all" || selectedSource !== "all") && (
          <button
            onClick={() => { setSearchQuery(""); setSelectedType("all"); setSelectedSource("all"); }}
            className="text-xs text-emerald-500 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Error State ── */}
      {hasError && (
        <div
          data-testid="jobs-error-state"
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center py-16 gap-4 text-center border border-red-900/30 rounded-2xl bg-red-950/10"
        >
          <AlertCircle size={36} className="text-red-400" />
          <div>
            <p className="text-red-400 font-semibold">Failed to load jobs</p>
            <p className="text-xs text-zinc-500 mt-1">{errorMsg}</p>
          </div>
          <Button
            data-testid="jobs-retry-btn"
            variant="secondary"
            size="sm"
            onClick={fetchJobs}
            icon={RefreshCw}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* ── Grid ── */}
      {!hasError && (
        <div
          data-testid="jobs-grid"
          className="grid gap-6 md:grid-cols-2"
        >
          {/* Skeletons */}
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonJobCard key={i} />)}

          {/* Job cards */}
          {!isLoading &&
            filtered.map((job) => <JobCard key={job._id} job={job} />)}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && status === "success" && (
            <div
              data-testid="jobs-empty-state"
              className="col-span-full py-20 text-center text-zinc-500 text-sm border border-zinc-900 rounded-2xl bg-zinc-900/10"
            >
              <Briefcase className="mx-auto mb-3 text-zinc-700" size={28} />
              <p className="font-semibold">No jobs match your filters.</p>
              <p className="text-xs mt-1 text-zinc-600">
                Try adjusting the type filter or clearing the search.
              </p>
              <button
                className="mt-4 text-xs text-emerald-500 underline"
                onClick={() => { setSearchQuery(""); setSelectedType("all"); setSelectedSource("all"); }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer note */}
      {status === "success" && jobs.length > 0 && (
        <p
          data-testid="jobs-feed-info"
          className="text-[11px] text-zinc-600 text-center pb-4"
        >
          Platform jobs are posted directly by employers on Fluxora.
          External jobs are sourced from The Muse public API.
        </p>
      )}
    </div>
  );
};

export default Jobs;