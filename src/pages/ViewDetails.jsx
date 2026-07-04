import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowLeft, Sparkles } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function ViewDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5002/api/trendingevents/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-4 font-inter">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
        <span>Loading event details...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400 gap-4 font-inter">
        <p className="text-red-400 font-semibold font-outfit">Event not found.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)} icon={ArrowLeft}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden shadow-2xl">
        {/* Banner Image */}
        <div className="relative h-64 overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md text-emerald-400 px-3.5 py-1 rounded-full text-xs font-semibold border border-emerald-500/10">
            {event.category}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">
              <Sparkles size={11} className="text-emerald-500" />
              <span>Event Details</span>
            </div>
            <h2 className="text-2xl font-bold font-outfit text-zinc-50 leading-tight">
              {event.title}
            </h2>
            <p className="text-zinc-400 text-sm mt-3.5 leading-relaxed font-normal">
              {event.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid gap-3 p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <Calendar size={14} className="text-emerald-500 shrink-0" />
              <span className="font-medium">{event.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={14} className="text-emerald-500 shrink-0" />
              <span className="font-medium">{event.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={14} className="text-emerald-500 shrink-0" />
              <span className="font-medium truncate">{event.location}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-zinc-800/40 flex items-center justify-between mt-2">
            <Button variant="secondary" size="md" onClick={() => navigate(-1)} icon={ArrowLeft}>
              Back
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
