import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Zap, Clock, ChevronRight, Star } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";

const TECH_OPTIONS = ["React", "Node.js", "MongoDB", "Python", "TypeScript", "Vue", "Django", "PostgreSQL", "GraphQL", "Docker"];
const DIFFICULTY_COLORS = {
  beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  advanced: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function Marketplace() {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedTech, setSelectedTech] = useState([]);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMilestones();
    if (role === "developer" && token) fetchRecommendations();
  }, []);

  useEffect(() => {
    fetchMilestones();
  }, [search, difficulty, selectedTech]);

  async function fetchMilestones() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (difficulty) params.append("difficulty", difficulty);
    if (selectedTech.length) params.append("tech", selectedTech.join(","));
    const res = await fetch(`http://localhost:5002/api/devlaunch/milestones?${params}`);
    const data = await res.json();
    setMilestones(data);
    setLoading(false);
  }

  async function fetchRecommendations() {
    const res = await fetch("http://localhost:5002/api/devlaunch/matching/recommendations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setRecommendations(data);
    }
  }

  function toggleTech(tech) {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-zinc-50">DevLaunch Marketplace</h1>
          <p className="text-zinc-400 text-sm mt-1">Find scoped milestones from early-stage startups</p>
        </div>
        {role === "startup" && (
          <Button variant="primary" onClick={() => navigate("/startup/dashboard")} icon={Zap}>
            Manage Projects
          </Button>
        )}
        {role === "developer" && (
          <Button variant="secondary" onClick={() => navigate("/devlaunch/dev-dashboard")}>
            My Milestones
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <InputField
              placeholder="Search milestones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
              id="search"
            />
          </div>
          <div className="flex gap-2">
            {["", "beginner", "intermediate", "advanced"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  difficulty === d
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                {d || "All"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {TECH_OPTIONS.map((tech) => (
            <button
              key={tech}
              onClick={() => toggleTech(tech)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                selectedTech.includes(tech)
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-zinc-200 mb-3 flex items-center gap-2">
            <Star size={18} className="text-amber-400" /> Best Matches for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map(({ milestone, matchScore }) => (
              <MilestoneCard key={milestone._id} milestone={milestone} matchScore={matchScore} />
            ))}
          </div>
        </div>
      )}

      {/* All Milestones */}
      <h2 className="text-lg font-bold text-zinc-200 mb-3">
        Open Milestones{" "}
        <span className="text-zinc-500 font-normal text-sm">({milestones.length})</span>
      </h2>
      {loading ? (
        <div className="text-zinc-500 text-center py-16">Loading...</div>
      ) : milestones.length === 0 ? (
        <div className="text-zinc-500 text-center py-16">No milestones found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map((m) => (
            <MilestoneCard key={m._id} milestone={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function MilestoneCard({ milestone, matchScore }) {
  return (
    <Link to={`/devlaunch/milestone/${milestone._id}`}>
      <Card hoverable className="p-5 flex flex-col gap-3 cursor-pointer h-full">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-500 mb-1 truncate">
              {milestone.startupId?.companyName || milestone.startupId?.name}
            </p>
            <h3 className="font-semibold text-zinc-100 leading-snug">{milestone.title}</h3>
          </div>
          {matchScore !== undefined && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
              {matchScore}% match
            </span>
          )}
        </div>

        <p className="text-xs text-zinc-400 line-clamp-2">{milestone.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {(milestone.techStack || []).slice(0, 4).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs border border-zinc-700">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[milestone.difficulty] || DIFFICULTY_COLORS.intermediate}`}>
            {milestone.difficulty}
          </span>
          {milestone.duration && (
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock size={12} /> {milestone.duration}
            </span>
          )}
          <ChevronRight size={14} className="text-zinc-600" />
        </div>
      </Card>
    </Link>
  );
}
