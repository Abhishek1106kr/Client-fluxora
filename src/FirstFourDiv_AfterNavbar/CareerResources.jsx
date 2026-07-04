import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { ArrowLeft, Sparkles } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function CareerResources() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/resources/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setResource)
      .catch(() => setResource(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-4 font-inter">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
        <span>Loading resource guide...</span>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400 gap-4 font-inter">
        <p className="text-red-400 font-semibold font-outfit">Resource not found.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)} icon={ArrowLeft}>
          Go Back
        </Button>
      </div>
    );
  }

  const Icon = LucideIcons[resource.icon] || LucideIcons.BookOpen;

  return (
    <div className="max-w-2xl mx-auto py-4">
      <Card className="bg-zinc-900 border-zinc-800 p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-zinc-800">
          <div className="p-3.5 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 shrink-0">
            <Icon size={32} />
          </div>
          <div className="text-center sm:text-left min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">
              <Sparkles size={11} />
              <span>Learning Article</span>
            </div>
            <h1 className="text-2xl font-bold font-outfit text-zinc-50 leading-tight">
              {resource.title}
            </h1>
            <p className="text-zinc-500 text-xs mt-1.5 font-normal leading-relaxed">
              {resource.description}
            </p>
          </div>
        </div>

        {/* Detailed Content */}
        <div className="text-zinc-350 text-sm leading-relaxed space-y-4 py-2 font-normal font-inter">
          {resource.content && (
            <div className="prose prose-invert max-w-none text-zinc-300">
              {resource.content}
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="pt-4 border-t border-zinc-800/40 mt-4 flex items-center justify-between">
          <Button variant="secondary" size="md" onClick={() => navigate(-1)} icon={ArrowLeft}>
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
}
