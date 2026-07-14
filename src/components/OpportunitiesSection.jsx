import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Clock, MapPin, Star, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";
import Card from "./ui/Card";
import Button from "./ui/Button";

const OpportunityCard = ({ opportunity, onApply }) => (
  <Card
    hoverable
    asymmetric={opportunity.isFeatured}
    className="flex flex-col justify-between p-6 bg-zinc-900 border-zinc-800"
  >
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden p-1.5 flex items-center justify-center shrink-0">
            <img
              src={opportunity.logo}
              alt={opportunity.company}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="font-bold font-outfit text-zinc-50 group-hover:text-emerald-400 transition-colors line-clamp-1">
              {opportunity.title}
            </h3>
            <p className="text-zinc-500 text-xs font-medium">{opportunity.company}</p>
          </div>
        </div>
        {opportunity.isFeatured && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            <Star size={10} className="fill-current" />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-400 mb-4 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/40">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin size={13} className="text-emerald-500 shrink-0" />
          <span className="truncate">{opportunity.location}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock size={13} className="text-emerald-500 shrink-0" />
          <span className="truncate">{opportunity.duration}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <Briefcase size={13} className="text-emerald-500 shrink-0" />
          <span className="truncate">{opportunity.type}</span>
        </div>
      </div>

      <p className="text-zinc-400 text-sm mb-5 line-clamp-3 leading-relaxed">
        {opportunity.description}
      </p>

      {/* Skill Tags */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {opportunity.skills.map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 bg-zinc-950 text-zinc-400 text-[11px] font-medium rounded border border-zinc-850 hover:text-zinc-200 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-800/50 mt-auto">
      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">Pay / Budget</span>
        <div className="flex items-center gap-1.5 text-zinc-200 font-bold text-sm font-outfit">
          <TrendingUp size={14} className="text-emerald-500" />
          <span>{opportunity.salary}</span>
        </div>
      </div>
      <Button variant="primary" size="sm" onClick={() => onApply(opportunity._id)}>
        Apply Now
      </Button>
    </div>
  </Card>
);

const skillOptions = [
  "All Skills",
  "React",
  "TypeScript",
  "CSS",
  "Figma",
  "Adobe XD",
  "UI/UX",
  "Node.js",
  "MongoDB",
  "APIs",
  "Python",
  "Machine Learning",
  "SQL",
];

const payOptions = [
  "All Pay",
  "$20-25/hr",
  "$25-30/hr",
  "$30/hr",
  "$40/hr",
  "$2500 fixed",
  "$3000 fixed",
];

const domainOptions = [
  { id: "all", label: "All Domains" },
  { id: "internship", label: "Internships" },
  { id: "project", label: "Projects" },
  { id: "part-time", label: "Part-time" },
];

const sortOptions = [
  { id: "default", label: "Sort by Default" },
  { id: "salary-asc", label: "Salary Ascending" },
  { id: "salary-desc", label: "Salary Descending" },
];

function parseSalary(salary) {
  const match = salary && salary.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

const OpportunitiesSection = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [activeDomain, setActiveDomain] = useState("all");
  const [activeSkill, setActiveSkill] = useState("All Skills");
  const [activePay, setActivePay] = useState("All Pay");
  const [sortBy, setSortBy] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5002/api/opportunities")
      .then((res) => res.json())
      .then(setOpportunities)
      .catch(() => setOpportunities([]));
  }, []);

  let filtered = opportunities;

  if (activeDomain !== "all") {
    filtered = filtered.filter((o) => o.type && o.type.toLowerCase() === activeDomain);
  }

  if (activeSkill !== "All Skills") {
    filtered = filtered.filter((o) => o.skills && o.skills.includes(activeSkill));
  }

  if (activePay !== "All Pay") {
    filtered = filtered.filter((o) => o.salary && o.salary.includes(activePay));
  }

  if (sortBy === "salary-asc") {
    filtered = [...filtered].sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
  } else if (sortBy === "salary-desc") {
    filtered = [...filtered].sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
  }

  const handleApply = async (opportunityId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to apply.");
      navigate("/login");
      return;
    }
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5002';
      const res = await fetch(`${backendUrl}/api/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ opportunityId }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Application successfully submitted!");
      } else {
        toast.error(data.error || "Failed to apply.");
      }
    } catch (err) {
      toast.error("Network error. Try again.");
    }
  };

  return (
    <section id="opportunities" className="py-20 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Opportunities</span>
            <h2 className="text-3xl font-extrabold text-zinc-50 mt-1 font-outfit">
              Featured Opportunities
            </h2>
            <p className="text-zinc-400 mt-3 text-sm">
              Discover real-world projects, student-friendly internships, and part-time roles curated specifically for career builders.
            </p>
          </div>

          {/* Filter Container */}
          <div className="flex flex-wrap gap-2 text-sm">
            <select
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer text-xs uppercase tracking-wide font-medium"
              value={activeDomain}
              onChange={(e) => setActiveDomain(e.target.value)}
            >
              {domainOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer text-xs uppercase tracking-wide font-medium"
              value={activeSkill}
              onChange={(e) => setActiveSkill(e.target.value)}
            >
              {skillOptions.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>

            <select
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer text-xs uppercase tracking-wide font-medium"
              value={activePay}
              onChange={(e) => setActivePay(e.target.value)}
            >
              {payOptions.map((pay) => (
                <option key={pay} value={pay}>
                  {pay}
                </option>
              ))}
            </select>

            <select
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer text-xs uppercase tracking-wide font-medium"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} onApply={handleApply} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-zinc-500 text-sm border border-zinc-900 rounded-xl bg-zinc-900/10">
              No matching opportunities found. Try adjusting your filters.
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link to="/job">
            <Button variant="secondary" size="md">
              Browse All Opportunities
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesSection;
