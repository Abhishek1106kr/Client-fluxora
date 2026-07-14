import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Terminal,
  Cpu,
  Code,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  GitBranch,
  ShieldCheck,
  Clock,
  Layers,
  ChevronRight,
  Search,
  Plus,
} from "lucide-react";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

export default function Projects() {
  const { backendUrl, userData } = useContext(AppContext);
  const base = backendUrl || "http://localhost:5002";
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("browse"); // "browse" | "screening"

  // Browse projects state (real projects using lifecycle states)
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dynamic filter states
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedStipend, setSelectedStipend] = useState("all");

  // Initialize new project form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    targetRole: "",
    requiredSkills: "",
    stipend: "",
    duration: "",
    repositoryUrl: "",
    minAssessmentScore: 70,
    skillsMatchThreshold: 2
  });

  // Action states
  const [activatingId, setActivatingId] = useState(null);
  const [activationStudentId, setActivationStudentId] = useState("");

  // Screening state
  const [form, setForm] = useState({
    jobTitle: "",
    requiredSkills: "",
    studentSkills: "",
    projectDescription: "",
    repositoryUrl: "",
  });
  const [loadingScreening, setLoadingScreening] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  // Fetch projects on load & when browse tab becomes active
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch(`${base}/api/projectcard/all`);
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch projects list.");
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeTab]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleScreeningSubmit = async (e) => {
    e.preventDefault();
    if (!form.jobTitle.trim() || !form.projectDescription.trim()) {
      toast.error("Job Title and Project Description are required.");
      return;
    }

    setLoadingScreening(true);
    setEvaluation(null);

    const requiredSkillsArray = form.requiredSkills
      ? form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const studentSkillsArray = form.studentSkills
      ? form.studentSkills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    try {
      const res = await fetch(`${base}/api/ai/evaluate-project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: form.jobTitle,
          requiredSkills: requiredSkillsArray,
          studentSkills: studentSkillsArray,
          projectDescription: form.projectDescription,
          repositoryUrl: form.repositoryUrl,
        }),
      });

      if (!res.ok) throw new Error("Screening failed. Please verify API connection.");

      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
        toast.success("Screening analysis complete!");
      } else {
        throw new Error(data.message || "Failed to parse analysis response.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred during evaluation.");
    } finally {
      setLoadingScreening(false);
    }
  };

  const handleCreateCardSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to initialize a project card.");
      navigate("/login");
      return;
    }

    try {
      const payload = {
        title: newCard.title,
        description: newCard.description,
        targetRole: newCard.targetRole,
        requiredSkills: newCard.requiredSkills.split(",").map(s => s.trim()).filter(Boolean),
        stipend: newCard.stipend,
        duration: newCard.duration,
        repositoryUrl: newCard.repositoryUrl,
        eligibilityCriteria: {
          minAssessmentScore: Number(newCard.minAssessmentScore),
          skillsMatchThreshold: Number(newCard.skillsMatchThreshold)
        }
      };

      const res = await fetch(`${base}/api/projectcard/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Project card initialized successfully!");
        setNewCard({
          title: "",
          description: "",
          targetRole: "",
          requiredSkills: "",
          stipend: "",
          duration: "",
          repositoryUrl: "",
          minAssessmentScore: 70,
          skillsMatchThreshold: 2
        });
        setShowCreateForm(false);
        fetchProjects();
      } else {
        toast.error(data.message || "Failed to create project card.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating project card.");
    }
  };

  const handleActivateCollaboration = async (mongoJobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to activate collaboration.");
      navigate("/login");
      return;
    }
    if (!activationStudentId.trim()) {
      toast.error("Please enter a Student ID to assign.");
      return;
    }

    try {
      const res = await fetch(`${base}/api/projectcard/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          mongoJobId,
          studentId: activationStudentId
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Collaboration activated successfully!");
        setActivatingId(null);
        setActivationStudentId("");
        fetchProjects();
      } else {
        toast.error(data.message || "Failed to activate collaboration.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error activating collaboration.");
    }
  };

  const handleCompleteProject = async (mongoJobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to complete project.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${base}/api/projectcard/complete/${mongoJobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Project completed successfully!");
        fetchProjects();
      } else {
        toast.error(data.message || "Failed to complete project.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error completing project.");
    }
  };

  // Filter projects by search query and filters
  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    const status = project.state?.lifecycleStatus || "DISCOVERY";
    const stipend = project.stipend || "";

    const matchesQuery = (
      project.title?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.targetRole?.toLowerCase().includes(query) ||
      (project.requiredSkills || []).some((tech) => tech.toLowerCase().includes(query))
    );

    const matchesRole = selectedRole === "all" || project.targetRole === selectedRole;
    const matchesStatus = selectedStatus === "all" || status === selectedStatus;
    
    let matchesStipend = true;
    if (selectedStipend === "paid") {
      matchesStipend = /[\d₹\$]/.test(stipend) && !stipend.toLowerCase().includes("unpaid");
    } else if (selectedStipend === "unpaid") {
      matchesStipend = stipend.toLowerCase().includes("unpaid") || stipend.toLowerCase().includes("free") || stipend.trim() === "";
    }

    return matchesQuery && matchesRole && matchesStatus && matchesStipend;
  });

  const roles = ["all", ...new Set(projects.map(p => p.targetRole).filter(Boolean))];

  const compScore = evaluation
    ? Math.max(0, Math.min(100, evaluation.projectComplexityScore - (evaluation.alignmentDeductions || 0)))
    : 0;

  return (
    <div data-testid="projects-page" className="flex flex-col gap-8 min-h-screen font-inter pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-900">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-400 font-medium mb-3">
            <Sparkles size={12} />
            <span>Fluxora Project Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-50 font-outfit">
            Startup Projects & Alignment
          </h1>
          <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
            Browse real startup codebases, track active builder tracks, or test project architecture against target requirements.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80 self-end">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "browse"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Browse Projects
          </button>
          <button
            onClick={() => setActiveTab("screening")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "screening"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            AI Screening Engine
          </button>
        </div>
      </div>

      {/* ── Browse Projects Tab ── */}
      {activeTab === "browse" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="flex flex-col gap-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/60">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm font-medium text-zinc-400 font-outfit">
                Showing <span className="text-emerald-400 font-extrabold">{filteredProjects.length}</span> of {projects.length} Listed Projects
              </div>
              
              {/* Show create button ONLY to startup/admin roles (Authorization!) */}
              {userData?.role !== "developer" && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => setShowCreateForm(!showCreateForm)}
                >
                  {showCreateForm ? "Hide Form" : "Initialize New Project"}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <InputField
                placeholder="Search projects by title, role, or stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                id="search-projects"
                className="sm:col-span-2"
              />

              {/* Role filter */}
              <div className="flex flex-col gap-1">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500 font-medium capitalize"
                >
                  <option value="all">Filter by Role (All)</option>
                  {roles.filter(r => r !== "all").map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Status & Stipend filters combined */}
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-lg px-2 py-2.5 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="all">Status (All)</option>
                  <option value="DISCOVERY">Discovery</option>
                  <option value="ACTIVE_WORK">Active Work</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                <select
                  value={selectedStipend}
                  onChange={(e) => setSelectedStipend(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-lg px-2 py-2.5 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="all">Stipend (All)</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          {showCreateForm && (
            <Card className="bg-zinc-900 border-zinc-800/80 p-6 shadow-xl max-w-2xl animate-in slide-in-from-top duration-250">
              <h2 className="text-lg font-bold text-zinc-50 mb-5 font-outfit flex items-center gap-2">
                <Plus size={18} className="text-emerald-500" />
                Initialize Project Card
              </h2>
              
              <form onSubmit={handleCreateCardSubmit} className="flex flex-col gap-4">
                <InputField
                  label="Project Title"
                  id="title"
                  placeholder="e.g. Realtime Collaborative Editor"
                  value={newCard.title}
                  onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                  required
                />
                <Textarea
                  label="Project Description"
                  id="description"
                  placeholder="Describe the project objective, key modules..."
                  value={newCard.description}
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                  required
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Target Role"
                    id="targetRole"
                    placeholder="e.g. Backend Dev"
                    value={newCard.targetRole}
                    onChange={(e) => setNewCard({ ...newCard, targetRole: e.target.value })}
                    required
                  />
                  <InputField
                    label="Duration"
                    id="duration"
                    placeholder="e.g. 6 Weeks"
                    value={newCard.duration}
                    onChange={(e) => setNewCard({ ...newCard, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Stipend"
                    id="stipend"
                    placeholder="e.g. $1200 / Month"
                    value={newCard.stipend}
                    onChange={(e) => setNewCard({ ...newCard, stipend: e.target.value })}
                    required
                  />
                  <InputField
                    label="Repository URL"
                    id="repositoryUrl"
                    placeholder="e.g. https://github.com/..."
                    value={newCard.repositoryUrl}
                    onChange={(e) => setNewCard({ ...newCard, repositoryUrl: e.target.value })}
                    required
                  />
                </div>
                <InputField
                  label="Required Skills (comma separated)"
                  id="requiredSkills"
                  placeholder="e.g. Node.js, WebSockets, Redis"
                  value={newCard.requiredSkills}
                  onChange={(e) => setNewCard({ ...newCard, requiredSkills: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-4 bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/60">
                  <InputField
                    label="Min Assessment Score (%)"
                    id="minAssessmentScore"
                    type="number"
                    value={newCard.minAssessmentScore}
                    onChange={(e) => setNewCard({ ...newCard, minAssessmentScore: e.target.value })}
                    required
                  />
                  <InputField
                    label="Skills Match Threshold"
                    id="skillsMatchThreshold"
                    type="number"
                    value={newCard.skillsMatchThreshold}
                    onChange={(e) => setNewCard({ ...newCard, skillsMatchThreshold: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full py-2.5 mt-2" icon={Plus}>
                  Initialize Project Card
                </Button>
              </form>
            </Card>
          )}

          {loadingProjects ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-4">
                  <div className="h-4 bg-zinc-800 rounded w-2/3" />
                  <div className="h-3 bg-zinc-800 rounded w-full" />
                  <div className="h-3 bg-zinc-800 rounded w-5/6" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-5 w-14 bg-zinc-800 rounded" />
                    <div className="h-5 w-14 bg-zinc-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800 p-16 text-center flex flex-col items-center justify-center gap-4">
              <Layers size={36} className="text-zinc-700" />
              <div>
                <p className="font-semibold text-zinc-400 font-outfit text-base">No projects found</p>
                <p className="text-xs text-zinc-550 mt-1">Try adjusting search parameters or check back later.</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const status = project.state?.lifecycleStatus || "DISCOVERY";
                const studentId = project.state?.studentId;

                return (
                  <Card
                    key={project._id}
                    hoverable
                    className="flex flex-col bg-zinc-900 border-zinc-800/80 p-6 gap-4 cursor-pointer group relative overflow-hidden"
                  >
                    {/* Status indicator bar */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${
                      status === "DISCOVERY" ? "bg-amber-500" :
                      status === "ACTIVE_WORK" ? "bg-blue-500" :
                      status === "COMPLETED" ? "bg-emerald-500" : "bg-red-500"
                    }`} />

                    <div className="pl-2 flex flex-col h-full justify-between gap-4">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-0.5 truncate">
                              {project.startupId?.companyName || project.startupId?.name || "Startup Partner"}
                            </span>
                            <h3 className="font-bold text-zinc-100 font-outfit leading-tight group-hover:text-emerald-400 transition-colors line-clamp-1">
                              {project.title}
                            </h3>
                            <p className="text-[11px] text-zinc-500 font-medium">{project.targetRole}</p>
                          </div>
                          
                          {/* Status Badge */}
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                            status === "DISCOVERY" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            status === "ACTIVE_WORK" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {status}
                          </span>
                        </div>

                        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {(project.requiredSkills || []).slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-400"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-zinc-800/40 text-[10px] text-zinc-500 mb-3">
                          <div>
                            <span className="block uppercase text-[8px] tracking-wider text-zinc-650">Stipend</span>
                            <span className="font-bold text-zinc-350">{project.stipend}</span>
                          </div>
                          <div>
                            <span className="block uppercase text-[8px] tracking-wider text-zinc-650">Duration</span>
                            <span className="font-bold text-zinc-350">{project.duration}</span>
                          </div>
                          <div>
                            <span className="block uppercase text-[8px] tracking-wider text-zinc-650">Min Score</span>
                            <span className="font-bold text-zinc-350">{project.eligibilityCriteria?.minAssessmentScore}%</span>
                          </div>
                        </div>

                        {studentId && (
                          <div className="flex items-center gap-1.5 p-2 bg-zinc-950/60 rounded-lg border border-zinc-850 text-[10px] text-zinc-400 mb-3 font-mono">
                            <span className="font-semibold text-zinc-500 font-sans">Student:</span>
                            <span className="text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/30 truncate flex-1">{studentId}</span>
                          </div>
                        )}

                        {/* Actions block */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/25" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => navigate(`/devlaunch/project/${project._id}`)}
                            className="text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                          >
                            Details <ChevronRight size={14} />
                          </button>

                          {/* Student/Developer Apply button */}
                          {(!userData || userData?.role === "developer") && (
                            <Button
                              variant="primary"
                              size="xs"
                              onClick={() => navigate(`/devlaunch/project/${project._id}`)}
                            >
                              Apply
                            </Button>
                          )}

                          {/* Startup Lifecycle Controls (Authorization!) */}
                          {userData?.role === "startup" && (
                            <>
                              {status === "DISCOVERY" && (
                                <div className="flex items-center gap-1.5">
                                  {activatingId === project._id ? (
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="text"
                                        placeholder="Student ID..."
                                        className="bg-zinc-950 border border-zinc-805 text-[10px] text-zinc-200 placeholder-zinc-650 rounded px-2 py-1 w-24 focus:outline-none focus:border-emerald-500 font-mono"
                                        value={activationStudentId}
                                        onChange={(e) => setActivationStudentId(e.target.value)}
                                      />
                                      <button
                                        onClick={() => handleActivateCollaboration(project._id)}
                                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-semibold"
                                      >
                                        OK
                                      </button>
                                      <button
                                        onClick={() => { setActivatingId(null); setActivationStudentId(""); }}
                                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-350 rounded text-[10px] font-semibold"
                                      >
                                        X
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setActivatingId(project._id)}
                                      className="px-2 py-1 bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 text-emerald-400 rounded text-[10px] font-bold"
                                    >
                                      Activate
                                    </button>
                                  )}
                                </div>
                              )}

                              {status === "ACTIVE_WORK" && (
                                <button
                                  onClick={() => handleCompleteProject(project._id)}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                                >
                                  Complete
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── AI Screening Engine Tab ── */}
      {activeTab === "screening" && (
        <div className="grid gap-8 lg:grid-cols-12 items-start animate-in fade-in duration-200">
          {/* Form Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card className="bg-zinc-900 border-zinc-800/80 p-6 shadow-xl">
              <h2 className="text-lg font-bold text-zinc-50 mb-5 font-outfit flex items-center gap-2">
                <Terminal size={18} className="text-emerald-500" />
                Screening Parameters
              </h2>

              <form onSubmit={handleScreeningSubmit} className="flex flex-col gap-5">
                <InputField
                  label="Target Job Title"
                  id="jobTitle"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleFormChange}
                  placeholder="e.g. Senior Fullstack Developer"
                  required
                />

                <InputField
                  label="Required Skills (Comma separated)"
                  id="requiredSkills"
                  name="requiredSkills"
                  value={form.requiredSkills}
                  onChange={handleFormChange}
                  placeholder="e.g. React, Node.js, WebSockets, Redis"
                />

                <InputField
                  label="Your Profile Technical Skills (Comma separated)"
                  id="studentSkills"
                  name="studentSkills"
                  value={form.studentSkills}
                  onChange={handleFormChange}
                  placeholder="e.g. React, Express, MongoDB, Tailwind"
                />

                <Textarea
                  label="Project Description (Highlight architecture & stack)"
                  id="projectDescription"
                  name="projectDescription"
                  value={form.projectDescription}
                  onChange={handleFormChange}
                  placeholder="e.g. Built a real-time collaborative whiteboard app utilizing socket.io room management, Redis Pub/Sub for cross-instance sync, and MongoDB indexes to support low latency lookup of strokes..."
                  required
                  rows={5}
                />

                <InputField
                  label="Repository URL (Optional)"
                  id="repositoryUrl"
                  name="repositoryUrl"
                  value={form.repositoryUrl}
                  onChange={handleFormChange}
                  placeholder="e.g. https://github.com/username/project"
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-2 py-3"
                  loading={loadingScreening}
                  icon={Sparkles}
                >
                  Start Screening Evaluation
                </Button>
              </form>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            {loadingScreening ? (
              <Card className="bg-zinc-900 border-zinc-800/80 p-16 flex flex-col items-center justify-center text-center gap-4 min-h-[500px]">
                <div className="relative flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500" />
                  <Cpu size={20} className="absolute text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-zinc-50 font-bold font-outfit text-base">Running Screen Analysis</h3>
                  <p className="text-zinc-500 text-xs mt-1.5 max-w-sm">
                    Critically inspecting architectural complexity, evaluating tech stack maturity, and calculating ecosystem alignment gaps...
                  </p>
                </div>
              </Card>
            ) : evaluation ? (
              <div className="flex flex-col gap-6">
                <Card className="bg-zinc-900 border-zinc-800/80 p-6 md:p-8 shadow-xl">
                  {/* Score Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-800">
                    <div>
                      <h3 className="text-xl font-bold font-outfit text-zinc-50">Screening Scorecard</h3>
                      <p className="text-xs text-zinc-500 mt-1">Automated screening metrics from Fluxora core</p>
                    </div>
                    {/* Circle Score */}
                    <div className="relative flex items-center justify-center shrink-0 w-24 h-24 rounded-full bg-zinc-950 border border-zinc-800 shadow-inner">
                      <div className="text-center">
                        <span className="text-2xl font-black text-emerald-400 font-outfit leading-none">{compScore}</span>
                        <span className="text-[10px] text-zinc-500 block font-bold mt-0.5">SCORE</span>
                      </div>
                    </div>
                  </div>

                  {/* Score breakdown metrics */}
                  <div className="grid grid-cols-2 gap-4 py-6 border-b border-zinc-800">
                    <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/60 flex flex-col gap-1">
                      <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Complexity</span>
                      <span className="text-zinc-100 font-black text-xl font-outfit flex items-center gap-1.5">
                        <Code size={16} className="text-emerald-500" />
                        {evaluation.projectComplexityScore} <span className="text-xs text-zinc-500 font-normal">/100</span>
                      </span>
                    </div>

                    <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/60 flex flex-col gap-1">
                      <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Deductions</span>
                      <span className="text-red-400 font-black text-xl font-outfit flex items-center gap-1.5">
                        <TrendingUp size={16} className="rotate-180 text-red-500" />
                        -{evaluation.alignmentDeductions || 0}
                      </span>
                    </div>
                  </div>

                  {/* Strengths & Gaps lists */}
                  <div className="grid md:grid-cols-2 gap-6 pt-6">
                    {/* Strengths */}
                    <div className="flex flex-col gap-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck size={14} />
                        Technical Strengths
                      </h4>
                      <ul className="flex flex-col gap-2">
                        {evaluation.technicalStrengths && evaluation.technicalStrengths.length > 0 ? (
                          evaluation.technicalStrengths.map((str, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-zinc-350 text-xs leading-relaxed">
                              <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span>{str}</span>
                            </li>
                          ))
                        ) : (
                          <span className="text-zinc-500 text-xs italic">No specific strengths recognized.</span>
                        )}
                      </ul>
                    </div>

                    {/* Knowledge Gaps */}
                    <div className="flex flex-col gap-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                        <AlertTriangle size={14} />
                        Critical Knowledge Gaps
                      </h4>
                      <ul className="flex flex-col gap-2">
                        {evaluation.criticalKnowledgeGaps && evaluation.criticalKnowledgeGaps.length > 0 ? (
                          evaluation.criticalKnowledgeGaps.map((gap, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-zinc-350 text-xs leading-relaxed">
                              <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                              <span>{gap}</span>
                            </li>
                          ))
                        ) : (
                          <span className="text-zinc-500 text-xs italic">No significant knowledge gaps identified.</span>
                        )}
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Action Prompt */}
                <div className="flex items-center gap-3 p-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-[11px] text-zinc-500">
                  <GitBranch size={16} className="text-emerald-500 shrink-0" />
                  <span>
                    Fluxora algorithms dynamically crosscheck evaluations against active opportunity requirements. Refactor project dependencies to cover identified gaps.
                  </span>
                </div>
              </div>
            ) : (
              <Card className="bg-zinc-900 border-zinc-800/80 p-16 flex flex-col items-center justify-center text-center gap-4 min-h-[500px]">
                <div className="p-4 rounded-full bg-zinc-950 border border-zinc-850 text-zinc-700">
                  <Code size={36} />
                </div>
                <div>
                  <h3 className="text-zinc-400 font-bold font-outfit text-base">Awaiting Evaluation</h3>
                  <p className="text-zinc-500 text-xs mt-1.5 max-w-sm mx-auto">
                    Provide screening parameters on the left to run an automated technical evaluation of the project.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
