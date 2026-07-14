import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { AppContext } from "../context/AppContext";

// Normalises both old (trending) and new (dashboard) event shapes
function normaliseEvent(e) {
  return {
    _id: e._id || e.id,
    title: e.title || e.name || "Untitled Event",
    category: e.type || e.category || "Event",
    description: e.description || "",
    date: e.startDate
      ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(e.startDate))
      : e.date || "TBA",
    time: e.time || "",
    location: e.location || "Online",
    image: e.image || `https://picsum.photos/seed/${e._id || e.id}/600/300`,
    registrationLink: e.registrationLink || null,
    source: e.source || "platform_curated",
  };
}

const EventCard = ({ event, onRegister }) => (
  <Card hoverable className="flex flex-col h-full bg-zinc-900 border-zinc-800/80 group">
    <div className="relative h-48 overflow-hidden">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/10">
        {event.category}
      </div>
    </div>
    <div className="flex-1 p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-zinc-50 mb-2 font-outfit group-hover:text-emerald-400 transition-colors">
          {event.title}
        </h3>
        <p className="text-zinc-400 text-sm mb-5 line-clamp-3">{event.description}</p>
      </div>

      <div className="space-y-2.5 pt-4 border-t border-zinc-800/50">
        <div className="flex items-center text-xs text-zinc-400">
          <Calendar size={14} className="mr-2.5 text-emerald-500" />
          <span>{event.date}</span>
        </div>
        {event.time && (
          <div className="flex items-center text-xs text-zinc-400">
            <Clock size={14} className="mr-2.5 text-emerald-500" />
            <span>{event.time}</span>
          </div>
        )}
        <div className="flex items-center text-xs text-zinc-400">
          <MapPin size={14} className="mr-2.5 text-emerald-500" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-6">
        <Link to={`/event/${event._id}`}>
          <Button variant="secondary" size="sm" className="w-full">
            Details
          </Button>
        </Link>
        {event.registrationLink ? (
          <a href={event.registrationLink} target="_blank" rel="noreferrer">
            <Button variant="primary" size="sm" className="w-full" icon={ExternalLink}>
              Register
            </Button>
          </a>
        ) : (
          <Button variant="primary" size="sm" onClick={() => onRegister(event._id)} className="w-full">
            Register
          </Button>
        )}
      </div>
    </div>
  </Card>
);

const EventsSection = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const base = backendUrl || "http://localhost:5002";

  useEffect(() => {
    // Try the new unified dashboard endpoint first; fall back to legacy endpoint
    fetch(`${base}/api/events/events`)
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((json) => {
        // New endpoint returns { success, count, data: [...] }
        const list = json?.data ?? (Array.isArray(json) ? json : []);
        setEvents(list.map(normaliseEvent));
      })
      .catch(() => {
        // Fallback to the legacy trending endpoint if new one is unavailable
        fetch(`${base}/api/trendingevents`)
          .then((r) => r.json())
          .then((list) => setEvents((Array.isArray(list) ? list : []).map(normaliseEvent)))
          .catch(() => setEvents([]));
      });
  }, [base]);

  const handleRegister = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to register.");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch("http://localhost:5002/api/event-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Successfully registered! Check your inbox.");
      } else {
        toast.error(data.error || "Failed to register.");
      }
    } catch (err) {
      toast.error("Network error. Try again.");
    }
  };

  const tabs = [
    { id: "all", label: "All Events" },
    { id: "Hackathon", label: "Hackathons" },
    { id: "Meetup", label: "Meetups" },
    { id: "Webinar", label: "Webinars" },
    { id: "Conference", label: "Conferences" },
  ];

  return (
    <section id="events" className="py-20 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-400 font-medium mb-3">
            <Sparkles size={12} />
            <span>Expand Your Network & Skills</span>
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-50 sm:text-4xl font-outfit">
            Trending Events
          </h2>
          <p className="mt-4 text-zinc-400">
            Discover hackathons, hands-on workshops, and networking gatherings designed to accelerate your growth.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="mt-8 flex justify-center flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
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

        {/* Events Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events
            .filter(
              (event) =>
                activeTab === "all" ||
                event.category === activeTab
            )
            .map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRegister={handleRegister}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
