import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, TrendingUp, ArrowLeft, Briefcase, Calendar, Sparkles } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function OpportunityMe() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5002/api/opportunities/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setOpportunity)
      .catch(() => setOpportunity(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-4 font-inter">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
        <span>Loading opportunity details...</span>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400 gap-4 font-inter">
        <p className="text-red-400 font-semibold font-outfit">Opportunity not found.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)} icon={ArrowLeft}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      <Card className="bg-zinc-900 border-zinc-800 p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-zinc-800">
          <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-850 p-2.5 flex items-center justify-center shrink-0">
            <img
              src={opportunity.logo}
              alt={opportunity.company}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center sm:text-left min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">
              <Sparkles size={11} />
              <span>Project & Career</span>
            </div>
            <h1 className="text-2xl font-bold font-outfit text-zinc-50 leading-tight">
              {opportunity.title}
            </h1>
            <p className="text-zinc-500 text-sm mt-0.5 font-medium">{opportunity.company}</p>
          </div>
        </div>

        {/* Specs Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 text-xs text-zinc-400">
          <div className="flex items-center gap-2.5">
            <MapPin size={14} className="text-emerald-500 shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <TrendingUp size={14} className="text-emerald-500 shrink-0" />
            <span className="font-bold text-zinc-350">{opportunity.salary}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Briefcase size={14} className="text-emerald-500 shrink-0" />
            <span className="truncate">{opportunity.type || "Contract"}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Calendar size={14} className="text-emerald-500 shrink-0" />
            <span className="truncate">{opportunity.duration || "Flexible"}</span>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-zinc-350 uppercase tracking-wider">Description</h3>
          <p className="text-zinc-400 text-sm leading-relaxed font-normal">
            {opportunity.description}
          </p>
        </div>

        {/* Requirements */}
        {opportunity.requirements && opportunity.requirements.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-zinc-350 uppercase tracking-wider">Requirements</h3>
            <ul className="text-zinc-400 text-sm list-disc pl-4 space-y-1.5 leading-relaxed font-normal">
              {opportunity.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits */}
        {opportunity.benefits && opportunity.benefits.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-zinc-350 uppercase tracking-wider">Benefits</h3>
            <ul className="text-zinc-400 text-sm list-disc pl-4 space-y-1.5 leading-relaxed font-normal">
              {opportunity.benefits.map((ben, idx) => (
                <li key={idx}>{ben}</li>
              ))}
            </ul>
          </div>
        )}

        {/* How To Apply */}
        {opportunity.howToApply && (
          <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-zinc-950/40 border border-zinc-850">
            <h3 className="text-xs font-bold text-zinc-350 uppercase tracking-wider">How to Apply</h3>
            <p className="text-zinc-400 text-xs leading-relaxed font-normal">
              {opportunity.howToApply}
            </p>
          </div>
        )}

        {/* Navigation Action Footer */}
        <div className="pt-4 border-t border-zinc-800/40 mt-4 flex items-center justify-between">
          <Button variant="secondary" size="md" onClick={() => navigate(-1)} icon={ArrowLeft}>
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
}
