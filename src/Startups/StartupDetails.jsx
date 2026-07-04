import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Target, Users, Globe, Send, Sparkles, AlertCircle } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Textarea from "../components/ui/Textarea";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

export default function StartupDetails() {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  // Connect Form State
  const [connectName, setConnectName] = useState("");
  const [connectEmail, setConnectEmail] = useState("");
  const [connectMessage, setConnectMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchStartupDetails = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/startup/${id}`);
        if (data.success) {
          setStartup(data.startup);
        } else {
          toast.error(data.message || "Failed to load startup details.");
        }
      } catch (err) {
        console.error("Error loading startup details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl && id) {
      fetchStartupDetails();
    }
  }, [backendUrl, id]);

  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    if (!connectName || !connectEmail || !connectMessage) {
      toast.error("Please fill in all contact fields.");
      return;
    }

    setSending(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSending(false);
    toast.success(`Message sent successfully to ${startup?.StartUpName || startup?.name} team!`);
    setConnectName("");
    setConnectEmail("");
    setConnectMessage("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold font-outfit text-zinc-100">Startup Not Found</h2>
        <p className="text-zinc-500 text-xs mt-2">The startup you are looking for does not exist or has been removed.</p>
        <Link to="/startups" className="inline-block mt-6">
          <Button variant="secondary" icon={ArrowLeft}>Back to Directory</Button>
        </Link>
      </div>
    );
  }

  const name = startup.StartUpName || startup.companyName || startup.name || "Unnamed Startup";
  const tagline = startup.onLineDescription || startup.motto || startup.tagline || "Innovative tech startup.";
  const industry = startup.Category || startup.industry || "Technology";
  const stage = startup.fundingRound?.stage || startup.stage || "Seed";
  const size = startup.employeeCountRange || startup.size || "11-50";
  
  const location = startup.address || 
    (startup.location?.city ? `${startup.location.city}${startup.location.area ? `, ${startup.location.area}` : ""}` : "") || 
    `${startup.city || ""}, ${startup.state || ""}`.trim().replace(/^,\s*/, "") || 
    "";
    
  const website = startup.WebSiteUrl || startup.website || "";
  const rawLogoVal = startup.logoURL || startup.logoBg || "";
  const logoBg = (rawLogoVal && !rawLogoVal.startsWith("http")) ? rawLogoVal : "from-emerald-500 to-teal-600";
  const logoUrl = startup.logoUrl || (startup.logoURL?.startsWith("http") ? startup.logoURL : "") || "";
  const mission = startup.fullDescription || startup.mission || "";
  const founders = startup.founders || "Founders details not registered.";
  const techStack = startup.techStack || ["React", "Node.js"];
  const rolesNeeded = startup.rolesNeeded || "";
  const activeProjects = startup.activeProjects || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8 max-w-6xl mx-auto">
      {/* Back link */}
      <Link to="/startups" className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-200 text-xs font-semibold mb-6 transition-colors">
        <ArrowLeft size={14} />
        <span>Back to Directory</span>
      </Link>

      {/* Main Header Card */}
      <Card className="bg-zinc-900 border-zinc-800/80 p-6 md:p-8 mb-8 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-[60px]" />

        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
          {/* Logo symbol */}
          {logoUrl && (logoUrl.startsWith("http") || logoUrl.startsWith("https")) ? (
            <img 
              src={logoUrl} 
              alt={`${name} logo`} 
              className="w-20 h-20 rounded-2xl object-cover shadow-xl shadow-black/40 shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.outerHTML = `<div class="w-20 h-20 rounded-2xl bg-gradient-to-br ${logoBg} flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-black/40 shrink-0 font-outfit">${name.charAt(0)}</div>`;
              }}
            />
          ) : (
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${logoBg} flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-black/40 shrink-0 font-outfit`}>
              {name.charAt(0)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold font-outfit text-zinc-50 tracking-tight">{name}</h1>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wide">
                {industry}
              </span>
            </div>
            <p className="text-zinc-400 text-sm mt-2 font-medium max-w-2xl">{tagline}</p>
            
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5"><MapPin size={13} className="text-emerald-500 shrink-0" /> {location}</span>
              <span className="flex items-center gap-1.5"><Target size={13} className="text-emerald-500 shrink-0" /> {stage} Stage</span>
              <span className="flex items-center gap-1.5"><Users size={13} className="text-emerald-500 shrink-0" /> {size} employees</span>
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  <Globe size={13} className="text-emerald-500 shrink-0" />
                  <span>Visit Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Grid Layout: Left Detail Content, Right Connect Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Mission */}
          <Card className="bg-zinc-900 border-zinc-800/80 p-6">
            <h3 className="text-base font-bold font-outfit text-zinc-50 border-b border-zinc-800/60 pb-3 mb-4">Our Mission & Vision</h3>
            <p className="text-zinc-300 text-xs leading-relaxed font-normal whitespace-pre-line">{mission}</p>
          </Card>

          {/* Founders & Team */}
          <Card className="bg-zinc-900 border-zinc-800/80 p-6">
            <h3 className="text-base font-bold font-outfit text-zinc-50 border-b border-zinc-800/60 pb-3 mb-4">Founding Team</h3>
            <p className="text-zinc-300 text-xs leading-relaxed font-normal">{founders}</p>
          </Card>

          {/* Tech Stack */}
          <Card className="bg-zinc-900 border-zinc-800/80 p-6">
            <h3 className="text-base font-bold font-outfit text-zinc-50 border-b border-zinc-800/60 pb-3 mb-4">Core Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs bg-zinc-950 border border-zinc-850 hover:border-zinc-700 text-zinc-300 px-3.5 py-1.5 rounded-lg font-mono transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Card>

          {/* Active Projects / Milestones */}
          <Card className="bg-zinc-900 border-zinc-800/80 p-6">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3 mb-4">
              <h3 className="text-base font-bold font-outfit text-zinc-50">Active Projects & Scopes</h3>
              <span className="text-[10px] text-zinc-500 uppercase font-semibold">Matched on DevLaunch</span>
            </div>
            
            {activeProjects.length === 0 ? (
              <p className="text-zinc-500 text-xs py-2">No active projects matching developers currently. Check back later!</p>
            ) : (
              <div className="space-y-3.5">
                {activeProjects.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                  >
                    <div>
                      <h4 className="font-semibold text-zinc-200 text-xs font-outfit leading-tight group-hover:text-emerald-400 transition-colors">
                        {proj.title}
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                        <Sparkles size={11} className="text-emerald-500 shrink-0" />
                        <span>Compensation: {proj.reward}</span>
                      </p>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 self-start md:self-auto font-semibold uppercase tracking-wider shrink-0">
                      {proj.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Developer Needs Box */}
          {rolesNeeded && (
            <Card className="bg-zinc-900 border-emerald-950/20 shadow-lg shadow-emerald-950/5 border-l-4 border-l-emerald-500 p-5">
              <h4 className="font-bold text-zinc-200 text-xs uppercase tracking-wider mb-2">Talent Acquisition</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">{rolesNeeded}</p>
            </Card>
          )}

          {/* Connect Form */}
          <Card className="bg-zinc-900 border-zinc-800/80 p-6">
            <h3 className="text-base font-bold font-outfit text-zinc-50 border-b border-zinc-800/60 pb-3 mb-4">Connect with Founders</h3>
            <p className="text-zinc-500 text-xs mb-4 leading-normal">
              Interested in collaborating or asking a question? Send a direct message to {name}'s leadership.
            </p>
            
            <form onSubmit={handleConnectSubmit} className="space-y-4">
              <InputField
                label="Your Name"
                id="cname"
                placeholder="Enter your full name"
                value={connectName}
                onChange={(e) => setConnectName(e.target.value)}
                required
              />

              <InputField
                label="Your Email"
                id="cemail"
                type="email"
                placeholder="you@example.com"
                value={connectEmail}
                onChange={(e) => setConnectEmail(e.target.value)}
                required
              />

              <Textarea
                label="Your Message"
                id="cmessage"
                placeholder="Pitch yourself, list your skills, or ask about opportunities..."
                value={connectMessage}
                onChange={(e) => setConnectMessage(e.target.value)}
                rows={4}
                required
              />

              <Button
                type="submit"
                variant="primary"
                loading={sending}
                icon={Send}
                className="w-full justify-center"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
