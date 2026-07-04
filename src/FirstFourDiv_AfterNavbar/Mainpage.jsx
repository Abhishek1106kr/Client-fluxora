import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  Globe,
  Award,
  Layers,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

// Import other landing sections
import HeroSection from "../components/HeroSection";
import OpportunitiesSection from "../components/OpportunitiesSection";
import EventsSection from "../components/EventsSection";
import TestimonialsSection from "../components/TestimonialsSection";

function Mainpage() {
  const [stats, setStats] = useState({
    opportunities: 0,
    events: 0,
    users: 0,
    companies: 0,
  });

  // Fetch events from backend
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5002/api/events")
      .then((res) => res.json())
      .then(setUpcomingEvents)
      .catch(() => setUpcomingEvents([]));
  }, []);

  // Fetch resources from backend
  const [resources, setResources] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5002/api/resources")
      .then((res) => res.json())
      .then(setResources)
      .catch(() => setResources([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        opportunities: 150,
        events: 45,
        users: 5000,
        companies: 120,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const quickLinks = [
    {
      title: "Find Jobs",
      description: "Browse through our curated list of opportunities",
      icon: Briefcase,
      link: "/job",
    },
    {
      title: "Upcoming Events",
      description: "Discover hackathons and workshops",
      icon: Calendar,
      link: "#events",
    },
    {
      title: "Career Resources",
      description: "Access learning materials and guides",
      icon: BookOpen,
      link: "#resources",
    },
  ];

  // Carousel states for events, resources
  const [eventIndex, setEventIndex] = useState(0);
  const [resIndex, setResIndex] = useState(0);

  // Carousel swipe/drag logic (reusable)
  function useCarouselHandlers(index, setIndex, length) {
    const touchStartX = useRef(null);
    const dragStartX = useRef(null);

    const prev = () => setIndex((i) => Math.max(i - 2, 0));
    const next = () => setIndex((i) => Math.min(i + 2, length - 2));
    const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e) => {
      if (touchStartX.current == null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (dx > 50) prev();
      else if (dx < -50) next();
      touchStartX.current = null;
    };
    const onMouseDown = (e) => {
      dragStartX.current = e.clientX;
    };
    const onMouseUp = (e) => {
      if (dragStartX.current == null) return;
      const dx = e.clientX - dragStartX.current;
      if (dx > 50) prev();
      else if (dx < -50) next();
      dragStartX.current = null;
    };
    return { prev, next, onTouchStart, onTouchEnd, onMouseDown, onMouseUp };
  }

  // Carousel handlers
  const eventsCarousel = useCarouselHandlers(
    eventIndex,
    setEventIndex,
    upcomingEvents.length
  );
  const resCarousel = useCarouselHandlers(
    resIndex,
    setResIndex,
    resources.length
  );

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId.substring(1));
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigate = useNavigate();

  // Resource Card Component
  const ResourceCard = ({ resource }) => {
    const iconMap = { BookOpen, TrendingUp, Users, Layers, Globe, Award };
    const Icon = iconMap[resource.icon] || BookOpen;

    const handleResourceClick = (e) => {
      e.preventDefault();
      const title = resource.title.toLowerCase();
      if (title.includes("interview") && title.includes("preparation")) {
        navigate("/InterviewPreparation");
      } else if (title.includes("resume")) {
        navigate("/resumePreparation");
      } else {
        navigate(`/resource/${resource.title.replace(/\s+/g, "-").toLowerCase()}`);
      }
    };

    return (
      <Card
        hoverable
        onClick={handleResourceClick}
        className="flex-1 min-w-[280px] md:min-w-[340px] p-6 bg-zinc-900 border-zinc-800 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600/10 border border-emerald-500/15 rounded-lg text-emerald-500 group-hover:bg-emerald-600/25 transition-all">
            <Icon size={20} />
          </div>
          <div className="pr-4">
            <h3 className="font-bold font-outfit text-sm text-zinc-100 group-hover:text-emerald-400 transition-colors">
              {resource.title}
            </h3>
            <p className="text-zinc-500 text-xs mt-1 leading-relaxed line-clamp-1">{resource.description}</p>
          </div>
        </div>
        <ArrowRight size={16} className="text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
      </Card>
    );
  };

  const handleQuickLinkClick = (e, link) => {
    if (link.startsWith("#")) {
      handleSmoothScroll(e, link);
    } else if (link.startsWith("/")) {
      e.preventDefault();
      navigate(link);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Platform Stats & Hub Entrance Banner */}
      <section className="py-8 border-t border-b border-zinc-900 bg-zinc-900/10 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 py-4">
          <div className="text-left max-w-sm">
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mb-1 uppercase tracking-wider">
              <Sparkles size={12} className="animate-spin duration-1000" />
              <span>Fluxora Network</span>
            </div>
            <h2 className="text-xl font-bold font-outfit text-zinc-100 leading-tight">
              Good morning. Let's pick up where you left off.
            </h2>
            <p className="text-xs text-zinc-500 mt-2">
              Track opportunities, join hackathons, and learn with our curated guides.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto md:min-w-[600px]">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Active Jobs</span>
              <span className="text-2xl font-bold text-zinc-100 font-outfit mt-1">{stats.opportunities}+</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Events</span>
              <span className="text-2xl font-bold text-zinc-100 font-outfit mt-1">{stats.events}+</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Users Connected</span>
              <span className="text-2xl font-bold text-zinc-100 font-outfit mt-1">{stats.users}+</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Partners</span>
              <span className="text-2xl font-bold text-zinc-100 font-outfit mt-1">{stats.companies}+</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick Links Section */}
      <section className="py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {quickLinks.map((link, index) => {
            const LinkIcon = link.icon;
            return (
              <a
                href={link.link}
                key={index}
                className="group flex items-center justify-between p-5 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200"
                onClick={(e) => handleQuickLinkClick(e, link.link)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-600/10 border border-emerald-500/15 rounded-lg text-emerald-500">
                    <LinkIcon size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold font-outfit text-sm text-zinc-100 group-hover:text-emerald-400 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed line-clamp-1">{link.description}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </a>
            );
          })}
        </div>
      </section>

      {/* 4. Opportunities Section */}
      <OpportunitiesSection />

      {/* 5. Events Section */}
      <EventsSection />

      {/* 6. Events Carousel Section */}
      {upcomingEvents.length > 0 && (
        <section id="upcoming-events" className="py-16 bg-zinc-950 border-t border-zinc-900">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Calendar</span>
              <h2 className="text-2xl font-extrabold text-zinc-50 mt-1 font-outfit">Upcoming Schedule</h2>
              <p className="text-zinc-500 text-xs mt-1">Check out scheduled events for the upcoming weeks.</p>
            </div>
            <div className="flex items-center gap-1.5 self-end">
              <button
                className={`p-2 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors ${
                  eventIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
                }`}
                onClick={eventsCarousel.prev}
                disabled={eventIndex === 0}
                aria-label="Previous Events"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className={`p-2 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors ${
                  eventIndex >= upcomingEvents.length - 2 ? "opacity-40 cursor-not-allowed" : ""
                }`}
                onClick={eventsCarousel.next}
                disabled={eventIndex >= upcomingEvents.length - 2}
                aria-label="Next Events"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div
            className="overflow-hidden"
            onTouchStart={eventsCarousel.onTouchStart}
            onTouchEnd={eventsCarousel.onTouchEnd}
            onMouseDown={eventsCarousel.onMouseDown}
            onMouseUp={eventsCarousel.onMouseUp}
          >
            <div className="flex gap-6 transition-all duration-300">
              {upcomingEvents
                .slice(eventIndex, eventIndex + 2)
                .map((event, idx) => (
                  <Card key={event._id || idx} className="flex-1 min-w-[280px] p-6 bg-zinc-900 border-zinc-800/80 flex gap-5">
                    <div className="flex flex-col items-center justify-center p-3 w-16 h-16 rounded-lg bg-emerald-600/10 border border-emerald-500/20 shrink-0 text-center">
                      <span className="text-lg font-extrabold text-emerald-400 font-outfit leading-none">{event.day}</span>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1">{event.month}</span>
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold font-outfit text-zinc-150 line-clamp-1">{event.title}</h3>
                        <div className="flex flex-col gap-1 mt-2.5 text-xs text-zinc-500">
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-emerald-500" /> {event.time}</span>
                          <span className="flex items-center gap-1.5 truncate"><MapPin size={12} className="text-emerald-500 shrink-0" /> {event.location}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Resources Carousel Section */}
      {resources.length > 0 && (
        <section id="resources" className="py-16 bg-zinc-950 border-t border-zinc-900">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Guides</span>
              <h2 className="text-2xl font-extrabold text-zinc-50 mt-1 font-outfit">Career Resources</h2>
              <p className="text-zinc-500 text-xs mt-1">Interactive walkthroughs and files to prep for interviews and resumes.</p>
            </div>
            <div className="flex items-center gap-1.5 self-end">
              <button
                className={`p-2 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors ${
                  resIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
                }`}
                onClick={resCarousel.prev}
                disabled={resIndex === 0}
                aria-label="Previous Resources"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className={`p-2 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors ${
                  resIndex >= resources.length - 2 ? "opacity-40 cursor-not-allowed" : ""
                }`}
                onClick={resCarousel.next}
                disabled={resIndex >= resources.length - 2}
                aria-label="Next Resources"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div
            className="overflow-hidden"
            onTouchStart={resCarousel.onTouchStart}
            onTouchEnd={resCarousel.onTouchEnd}
            onMouseDown={resCarousel.onMouseDown}
            onMouseUp={resCarousel.onMouseUp}
          >
            <div className="flex gap-6 transition-all duration-300">
              {resources.slice(resIndex, resIndex + 2).map((resource, idx) => (
                <ResourceCard key={idx} resource={resource} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}

export default Mainpage;