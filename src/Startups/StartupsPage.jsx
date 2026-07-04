import React, { useState, useEffect, useContext } from "react";
import { Search, Plus, Filter, HelpCircle, Sparkles, MapPin } from "lucide-react";
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

const INDUSTRY_OPTIONS = [
  { label: "All Industries", value: "" },
  { label: "AI & ML", value: "AI/ML" },
  { label: "SaaS", value: "SaaS" },
  { label: "FinTech", value: "FinTech" },
  { label: "HealthTech", value: "HealthTech" },
  { label: "Web3 & Blockchain", value: "Web3" },
  { label: "EdTech", value: "EdTech" },
];

const STAGE_OPTIONS = [
  { label: "All Stages", value: "" },
  { label: "Bootstrapped", value: "Bootstrapped" },
  { label: "Pre-Seed", value: "Pre-Seed" },
  { label: "Seed", value: "Seed" },
  { label: "Series A", value: "Series A" },
  { label: "Series B & Beyond", value: "Series B+" },
];

const SIZE_OPTIONS = [
  { label: "All Sizes", value: "" },
  { label: "1 - 10 employees", value: "1-10" },
  { label: "11 - 50 employees", value: "11-50" },
  { label: "51 - 200 employees", value: "51-200" },
  { label: "200+ employees", value: "200+" },
];

export default function StartupsPage() {
  const { backendUrl, userData } = useContext(AppContext);
  const [startups, setStartups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Toggling between Local Smart Match directory and Registered Ecosystem
  const [viewMode, setViewMode] = useState("local");
  const [appliedLocation, setAppliedLocation] = useState({ city: "Bangalore", area: "Whitefield" });
  const [isLoading, setIsLoading] = useState(false);

  // Read location settings from developer local profile
  useEffect(() => {
    const profileStr = localStorage.getItem("dev_profile");
    if (profileStr) {
      try {
        const parsed = JSON.parse(profileStr);
        if (parsed.location && parsed.location !== "NA") {
          const parts = parsed.location.split(",").map(p => p.trim());
          setAppliedLocation({
            city: parts[0] || "Bangalore",
            area: parts[1] || ""
          });
        }
      } catch (e) {
        console.error("Error reading dev_profile location:", e);
      }
    }
  }, [userData]);

  const fetchStartups = async () => {
    setIsLoading(true);
    try {
      let url = "";
      if (viewMode === "local") {
        url = `${backendUrl}/api/startup/local?city=${encodeURIComponent(appliedLocation.city)}&area=${encodeURIComponent(appliedLocation.area)}`;
      } else {
        url = `${backendUrl}/api/startup/all`;
      }
      
      const { data } = await axios.get(url);
      if (data.success) {
        setStartups(data.data || data.startups || []);
      } else {
        toast.error(data.message || "Failed to load startups.");
      }
    } catch (err) {
      console.error("Error loading startups:", err);
      toast.error("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load startups from backend when dependencies update
  useEffect(() => {
    if (backendUrl) {
      fetchStartups();
    }
  }, [backendUrl, viewMode, appliedLocation.city, appliedLocation.area]);

  const handleOnboardingSuccess = (newStartupName) => {
    fetchStartups();
    setIsModalOpen(false);
    toast.success(`${newStartupName} is now onboarded on Fluxora!`);
  };

  // Filter logic
  const filteredStartups = startups.filter((startup) => {
    const name = startup.StartUpName || startup.name || "";
    const tagline = startup.onLineDescription || startup.tagline || "";
    const techStack = startup.techStack || ["React", "Node.js"];
    const industry = startup.Category || startup.industry || "";
    const stage = startup.fundingRound?.stage || startup.stage || "";
    const size = startup.employeeCountRange || startup.size || "";

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (techStack || []).some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const industryMap = {
      "AI/ML": "technology",
      "SaaS": "technology",
      "FinTech": "fintech",
      "HealthTech": "healthcare",
      "Web3": "other",
      "EdTech": "edtech"
    };
    const category = industryMap[industryFilter] || industryFilter;

    const normalisedIndustry = industry.toLowerCase();
    const normalisedFilter = category.toLowerCase();
    const matchesIndustry = !industryFilter || normalisedIndustry === normalisedFilter;

    const normalisedStage = stage.toLowerCase();
    const normalisedStageFilter = stageFilter.toLowerCase();
    const matchesStage = !stageFilter || normalisedStage === normalisedStageFilter;

    const matchesSize = !sizeFilter || size === sizeFilter;

    return matchesSearch && matchesIndustry && matchesStage && matchesSize;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setIndustryFilter("");
    setStageFilter("");
    setSizeFilter("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10 max-w-6xl mx-auto relative">
      {/* Glow ambient background elements */}
      <div className="pointer-events-none absolute top-10 left-1/3 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-80 w-80 rounded-full bg-teal-500/5 blur-[100px]" />

      {/* Header section */}
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

      {/* Directory Views Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 relative z-10">
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode("local")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              viewMode === "local"
                ? "bg-emerald-600 text-zinc-50 shadow-md shadow-emerald-950/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Local & Smart Matching Directory
          </button>
          <button
            onClick={() => setViewMode("registered")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              viewMode === "registered"
                ? "bg-emerald-600 text-zinc-50 shadow-md shadow-emerald-950/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Ecosystem Registrations
          </button>
        </div>

        {viewMode === "local" && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/60 border border-zinc-800/80 px-4 py-2 rounded-xl backdrop-blur-sm self-start">
            <MapPin size={13} className="text-emerald-400" />
            <span>Matching: <strong className="text-emerald-300 font-semibold">{appliedLocation.city}</strong>{appliedLocation.area ? ` (${appliedLocation.area})` : ""}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar Row */}
      <Card className="bg-zinc-900/60 border-zinc-850 p-4 md:p-5 mb-8 relative z-10 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Search field */}
          <div className="md:col-span-4">
            <InputField
              label="Search Directory"
              id="search"
              placeholder="Search by name, pitch, or stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Industry dropdown */}
          <div className="md:col-span-2.5">
            <Select
              label="Industry"
              id="industry"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              options={INDUSTRY_OPTIONS}
            />
          </div>

          {/* Stage dropdown */}
          <div className="md:col-span-2.5">
            <Select
              label="Funding Stage"
              id="stage"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              options={STAGE_OPTIONS}
            />
          </div>

          {/* Size dropdown */}
          <div className="md:col-span-2">
            <Select
              label="Size"
              id="size"
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              options={SIZE_OPTIONS}
            />
          </div>

          {/* Reset Filters */}
          <div className="md:col-span-1 flex justify-end">
            {(searchQuery || industryFilter || stageFilter || sizeFilter) ? (
              <button
                onClick={clearFilters}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold py-2.5 px-3 hover:bg-zinc-800/40 rounded-lg transition-colors w-full text-center border border-zinc-800/60 md:border-transparent md:py-3"
              >
                Clear
              </button>
            ) : (
              <div className="text-zinc-600 p-2.5 hidden md:block" title="Filters active state">
                <Filter size={16} />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Grid of Startup Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredStartups.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800/80 p-12 text-center my-10 max-w-xl mx-auto">
          <HelpCircle className="mx-auto text-zinc-600 mb-4" size={40} />
          <h3 className="text-lg font-bold font-outfit text-zinc-200">No Startups Found</h3>
          <p className="text-zinc-500 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
            We couldn't find any startups matching your current filter settings. Try adjusting your query or filters.
          </p>
          <Button variant="secondary" onClick={clearFilters} className="mt-6">
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredStartups.map((startup) => (
            <StartupCard key={startup._id || startup.id} startup={startup} />
          ))}
        </div>
      )}

      {/* Onboarding Wizard Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Startup Registration & Onboarding"
        className="max-w-2xl"
      >
        <StartupOnboarding
          onCancel={() => setIsModalOpen(false)}
          onSuccess={handleOnboardingSuccess}
        />
      </Modal>
    </div>
  );
}
