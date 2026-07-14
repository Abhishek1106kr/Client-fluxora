import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Loader2,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  ExternalLink,
  Code,
  Layers,
  Award,
  BookOpen
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import Textarea from "../components/ui/Textarea";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const STATUS_COLORS = {
  open: "text-emerald-400 bg-emerald-500/10",
  in_progress: "text-blue-400 bg-blue-500/10",
  review: "text-amber-400 bg-amber-500/10",
  completed: "text-zinc-400 bg-zinc-700",
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, userData, isLoggedIn } = useContext(AppContext);
  const base = backendUrl || "http://localhost:5002";
  const token = localStorage.getItem("token");

  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Applications & Assessment state
  const [myApplication, setMyApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApp, setLoadingApp] = useState(true);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [submittingAssessment, setSubmittingAssessment] = useState(false);
  const [submittingApply, setSubmittingApply] = useState(false);

  const [assessmentForm, setAssessmentForm] = useState({
    studentSkills: "",
    projectDescription: "",
    repositoryUrl: ""
  });

  const isDeveloper = !userData || userData?.role === "developer";
  const isStartup = userData && userData?.role === "startup";

  // Pre-fill student skills from profile if available
  useEffect(() => {
    if (userData && userData.skills) {
      setAssessmentForm((prev) => ({
        ...prev,
        studentSkills: userData.skills.join(", ")
      }));
    }
  }, [userData]);

  const fetchProjectData = async () => {
    try {
      const res = await fetch(`${base}/api/devlaunch/projects/${id}`);
      if (!res.ok) throw new Error("Failed to load project details");
      const d = await res.json();
      setProject(d.project);
      setMilestones(d.milestones || []);
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch project details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationData = async () => {
    if (!isLoggedIn && !token) {
      setLoadingApp(false);
      return;
    }
    setLoadingApp(true);
    try {
      if (isDeveloper) {
        const res = await fetch(`${base}/api/projectcard/my-application/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include"
        });
        const d = await res.json();
        if (d.success) {
          setMyApplication(d.data);
        }
      } else if (isStartup) {
        const res = await fetch(`${base}/api/projectcard/applications/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include"
        });
        const d = await res.json();
        if (d.success) {
          setApplications(d.data || []);
        }
      }
    } catch (err) {
      console.error("Error loading application states:", err);
    } finally {
      setLoadingApp(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  useEffect(() => {
    if (project) {
      fetchApplicationData();
    }
  }, [project, userData, isLoggedIn]);

  const handleFormChange = (e) => {
    setAssessmentForm({ ...assessmentForm, [e.target.name]: e.target.value });
  };

  const handleSubmitAssessment = async (e) => {
    e.preventDefault();
    if (!isLoggedIn && !token) {
      toast.error("Please log in to submit an assessment.");
      navigate("/login");
      return;
    }
    if (!assessmentForm.projectDescription.trim() || !assessmentForm.repositoryUrl.trim()) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setSubmittingAssessment(true);
    try {
      const res = await fetch(`${base}/api/projectcard/assessment/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify({
          projectId: id,
          ...assessmentForm
        })
      });

      const d = await res.json();
      if (res.ok && d.success) {
        setMyApplication(d.data);
        setShowAssessmentForm(false);
        toast.success(d.message || "Technical assessment scorecard generated!");
      } else {
        toast.error(d.message || "Assessment evaluation failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting technical assessment.");
    } finally {
      setSubmittingAssessment(false);
    }
  };

  const handleApply = async () => {
    if (!isLoggedIn && !token) return;
    setSubmittingApply(true);
    try {
      const res = await fetch(`${base}/api/projectcard/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify({ projectId: id })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setMyApplication(d.data);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(d.message || "Could not apply.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error applying to project.");
    } finally {
      setSubmittingApply(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    if (!isLoggedIn && !token) return;
    try {
      const res = await fetch(`${base}/api/projectcard/application/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify({ applicationId, status })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        toast.success(d.message || `Application status updated to ${status}.`);
        fetchApplicationData();
        fetchProjectData();
      } else {
        toast.error(d.message || "Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating application status.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  const projectStatus = project?.state?.lifecycleStatus || "DISCOVERY";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10 max-w-5xl mx-auto font-inter">
      {/* Back link */}
      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-350 text-xs font-semibold uppercase tracking-wider mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Projects
      </button>

      {project && (
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Main Details Panel (Left Column) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Card className="bg-zinc-900 border-zinc-800/80 p-6 md:p-8 relative overflow-hidden">
              {/* Vertical accent colored bar */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                projectStatus === "DISCOVERY" ? "bg-amber-500" :
                projectStatus === "ACTIVE_WORK" ? "bg-blue-500" :
                "bg-emerald-500"
              }`} />

              <div className="pl-3">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                      {project.startupId?.companyName || project.startupId?.name || "Startup Partner"}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-extrabold font-outfit text-zinc-50 leading-tight">
                      {project.title}
                    </h1>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                    projectStatus === "DISCOVERY" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    projectStatus === "ACTIVE_WORK" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {projectStatus}
                  </span>
                </div>

                <div className="text-zinc-350 text-sm leading-relaxed mb-6 whitespace-pre-line">
                  {project.description}
                </div>

                <div className="flex flex-col gap-1.5 mb-6">
                  <span className="text-[10px] font-bold uppercase text-zinc-550 tracking-wider">Required Technical Profile</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(project.requiredSkills || []).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-300 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key metadata grid */}
                <div className="grid grid-cols-3 gap-4 border-t border-zinc-800/60 pt-4 text-xs">
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-zinc-550 mb-0.5">Stipend Offer</span>
                    <span className="font-bold text-zinc-200 text-sm">{project.stipend}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-zinc-550 mb-0.5">Project Duration</span>
                    <span className="font-bold text-zinc-200 text-sm">{project.duration}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-zinc-550 mb-0.5">Score Threshold</span>
                    <span className="font-bold text-emerald-400 text-sm">{project.eligibilityCriteria?.minAssessmentScore}%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Milestones list section */}
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-zinc-200 text-lg font-outfit pl-1">
                Project Milestones <span className="text-zinc-550 font-normal text-sm">({milestones.length})</span>
              </h2>

              {milestones.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-850 rounded-2xl bg-zinc-950/20">
                  <Layers size={24} className="mx-auto mb-2 text-zinc-700" />
                  <p className="text-xs">No active work milestones created for this lifecycle.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {milestones.map((m) => (
                    <Card
                      key={m._id}
                      hoverable
                      className="p-4 cursor-pointer bg-zinc-900 border-zinc-850"
                      onClick={() => navigate(`/devlaunch/milestone/${m._id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-zinc-200 text-sm">{m.title}</h4>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{m.description}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${STATUS_COLORS[m.status] || "text-zinc-400 bg-zinc-800"}`}>
                          {m.status.replace("_", " ")}
                        </span>
                        <ChevronRight size={14} className="text-zinc-650" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side Panel (Right Column) - Handle Assessment & Apply (Developer) or Review Candidates (Startup) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* ── DEVELOPER/STUDENT FLOW ── */}
            {isDeveloper && (
              <div className="flex flex-col gap-6">
                {loadingApp ? (
                  <Card className="bg-zinc-900 border-zinc-800/80 p-12 text-center flex flex-col items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-emerald-500" size={24} />
                    <span className="text-xs text-zinc-500">Checking application eligibility...</span>
                  </Card>
                ) : myApplication ? (
                  <Card className="bg-zinc-900 border-zinc-800/80 p-6 shadow-xl flex flex-col gap-5">
                    <div className="border-b border-zinc-800 pb-4">
                      <span className="text-[10px] text-zinc-550 uppercase font-bold tracking-wider">Application Summary</span>
                      <div className="flex items-center justify-between mt-1">
                        <h3 className="text-base font-bold text-zinc-150 font-outfit">Your Scorecard</h3>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          myApplication.status === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          myApplication.status === "applied" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                          myApplication.status === "accepted" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {myApplication.status}
                        </span>
                      </div>
                    </div>

                    {/* Score Indicator */}
                    <div className="flex items-center gap-4 bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
                      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-zinc-950 border border-zinc-800">
                        <span className={`text-base font-black font-outfit ${myApplication.passed ? "text-emerald-400" : "text-red-400"}`}>
                          {myApplication.assessmentScore}%
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-200">
                          {myApplication.passed ? "Threshold Passed" : "Below Minimum Score"}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          Required threshold: {project.eligibilityCriteria?.minAssessmentScore || 70}%
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Gaps */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Key Strengths</span>
                        {myApplication.technicalStrengths?.length > 0 ? (
                          <ul className="flex flex-col gap-1 text-[11px] text-zinc-400">
                            {myApplication.technicalStrengths.map((s, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <CheckCircle size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-[11px] text-zinc-550 italic">None highlighted.</span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-1">Ecosystem Gaps</span>
                        {myApplication.criticalKnowledgeGaps?.length > 0 ? (
                          <ul className="flex flex-col gap-1 text-[11px] text-zinc-400">
                            {myApplication.criticalKnowledgeGaps.map((g, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                                <span>{g}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-[11px] text-zinc-550 italic">No critical gaps identified.</span>
                        )}
                      </div>
                    </div>

                    {/* Apply Actions */}
                    <div className="border-t border-zinc-800 pt-4 flex flex-col gap-3">
                      {myApplication.status === "pending" && myApplication.passed && (
                        <Button
                          variant="primary"
                          className="w-full justify-center text-sm py-2.5"
                          icon={Award}
                          onClick={handleApply}
                          loading={submittingApply}
                        >
                          Submit Formal Application
                        </Button>
                      )}

                      {myApplication.status === "pending" && !myApplication.passed && (
                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] text-red-400 leading-relaxed">
                            Your scorecard complexity is below the threshold. Refactor your codebase modules and click below to retake.
                          </p>
                          <Button
                            variant="secondary"
                            className="w-full justify-center text-xs py-2"
                            icon={Sparkles}
                            onClick={() => setShowAssessmentForm(true)}
                          >
                            Retake Technical Assessment
                          </Button>
                        </div>
                      )}

                      {myApplication.status === "applied" && (
                        <p className="text-xs text-zinc-400 bg-zinc-950/60 p-3 rounded-lg border border-zinc-850 text-center leading-relaxed">
                          📨 Application is successfully submitted! The startup partner has been notified to review your scorecard.
                        </p>
                      )}

                      {myApplication.status === "accepted" && (
                        <p className="text-xs text-emerald-400 bg-emerald-950/10 p-3 rounded-lg border border-emerald-900/20 text-center leading-relaxed font-medium">
                          🎉 Application accepted! Collaborate with the startup partner using the milestones workflow on the left.
                        </p>
                      )}

                      {myApplication.status === "rejected" && (
                        <p className="text-xs text-red-400 bg-red-950/10 p-3 rounded-lg border border-red-900/20 text-center leading-relaxed font-medium">
                          ❌ This application was rejected. Keep reviewing details on other startup projects!
                        </p>
                      )}
                    </div>
                  </Card>
                ) : (
                  <Card className="bg-zinc-900 border-zinc-800/80 p-6 flex flex-col gap-4 text-center">
                    <Award size={32} className="text-emerald-500 mx-auto" />
                    <div>
                      <h3 className="font-bold text-zinc-100 font-outfit text-base">Submit Application</h3>
                      <p className="text-zinc-400 text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
                        To guarantee high matching quality, Fluxora requires candidates to run their project code through our AI Technical Assessment before applying.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full justify-center text-sm py-2.5 mt-2"
                      icon={Sparkles}
                      onClick={() => setShowAssessmentForm(true)}
                    >
                      Take Technical Assessment
                    </Button>
                  </Card>
                )}

                {/* Inline Assessment Form Modal / Block */}
                {showAssessmentForm && (
                  <Card className="bg-zinc-900 border-zinc-800/80 p-6 shadow-2xl animate-in slide-in-from-right duration-300">
                    <h2 className="text-base font-bold text-zinc-50 mb-4 font-outfit flex items-center gap-2">
                      <Sparkles size={16} className="text-emerald-500" />
                      Technical Assessment
                    </h2>

                    <form onSubmit={handleSubmitAssessment} className="flex flex-col gap-4 text-left">
                      <InputField
                        label="Profile Technical Skills"
                        id="studentSkills"
                        name="studentSkills"
                        value={assessmentForm.studentSkills}
                        onChange={handleFormChange}
                        placeholder="e.g. Node.js, Express, Socket.io, React"
                        required
                      />

                      <Textarea
                        label="Project Architecture & Execution"
                        id="projectDescription"
                        name="projectDescription"
                        value={assessmentForm.projectDescription}
                        onChange={handleFormChange}
                        placeholder="Explain your nominated codebase modules. Detail how you implemented database modeling, caching layer, or async event brokers..."
                        required
                        rows={4}
                      />

                      <InputField
                        label="Code Repository URL (GitHub, GitLab)"
                        id="repositoryUrl"
                        name="repositoryUrl"
                        value={assessmentForm.repositoryUrl}
                        onChange={handleFormChange}
                        placeholder="e.g. https://github.com/username/project"
                        required
                      />

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="submit"
                          variant="primary"
                          className="flex-1 justify-center py-2"
                          loading={submittingAssessment}
                        >
                          Submit Assessment
                        </Button>
                        <Button
                          variant="secondary"
                          className="py-2"
                          onClick={() => setShowAssessmentForm(false)}
                          disabled={submittingAssessment}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}
              </div>
            )}

            {/* ── STARTUP REVIEW FLOW ── */}
            {isStartup && (
              <Card className="bg-zinc-900 border-zinc-800/80 p-6 shadow-xl flex flex-col gap-5">
                <h3 className="font-bold text-zinc-50 text-base font-outfit flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <BookOpen size={16} className="text-emerald-500" />
                  Candidate Applications <span className="text-zinc-500 font-normal">({applications.length})</span>
                </h3>

                {loadingApp ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-zinc-500">
                    <Loader2 className="animate-spin text-emerald-500" size={20} />
                    <span className="text-[10px]">Loading scorecard reviews...</span>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-850 rounded-xl bg-zinc-950/20 text-xs">
                    No applications submitted for this project card.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1.5 custom-scrollbar">
                    {applications.map((app) => (
                      <div
                        key={app._id}
                        className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-xl flex flex-col gap-3 relative overflow-hidden"
                      >
                        {/* Status bar indication */}
                        <div className={`absolute top-0 left-0 w-1 h-full ${
                          app.status === "applied" ? "bg-blue-500" :
                          app.status === "accepted" ? "bg-emerald-500" :
                          "bg-zinc-700"
                        }`} />

                        <div className="pl-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={app.studentId?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                                className="w-8 h-8 rounded-full border border-zinc-800"
                                alt=""
                              />
                              <div>
                                <h4 className="font-bold text-zinc-150 text-xs leading-none">{app.studentId?.name}</h4>
                                <span className="text-[10px] text-zinc-500 mt-1 block">{app.studentId?.email}</span>
                              </div>
                            </div>

                            {/* Circular Score display */}
                            <div className="bg-zinc-900 border border-zinc-800 text-[10px] font-black font-mono text-emerald-400 px-2 py-0.5 rounded">
                              {app.assessmentScore}%
                            </div>
                          </div>

                          {/* Technical summary */}
                          <div className="mt-3 text-[11px] text-zinc-400 leading-relaxed border-t border-b border-zinc-900 py-2">
                            <p className="font-semibold text-zinc-500">Nominated Project Profile:</p>
                            <p className="line-clamp-2 mt-0.5">{app.submittedAnswers?.projectDescription}</p>
                            <a
                              href={app.submittedAnswers?.repositoryUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-500 hover:underline mt-1.5 flex items-center gap-1 font-mono text-[10px]"
                            >
                              Codebase Repo <ExternalLink size={10} />
                            </a>
                          </div>

                          {/* Strengths & Gaps lists */}
                          <div className="grid grid-cols-2 gap-3 mt-2.5 text-[10px]">
                            <div>
                              <span className="font-bold text-emerald-500 block mb-0.5">Strengths</span>
                              <ul className="list-disc list-inside text-zinc-400 flex flex-col gap-0.5">
                                {(app.technicalStrengths || []).slice(0, 2).map((s, idx) => (
                                  <li key={idx} className="truncate">{s}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-bold text-amber-500 block mb-0.5">Gaps</span>
                              <ul className="list-disc list-inside text-zinc-400 flex flex-col gap-0.5">
                                {(app.criticalKnowledgeGaps || []).slice(0, 2).map((g, idx) => (
                                  <li key={idx} className="truncate">{g}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Actions block */}
                          <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-zinc-900">
                            <span className="text-[10px] text-zinc-500 capitalize">
                              Status: <span className="font-semibold text-zinc-400">{app.status}</span>
                            </span>

                            {app.status === "applied" && (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleStatusUpdate(app._id, "accepted")}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-colors"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(app._id, "rejected")}
                                  className="px-2 py-1 bg-zinc-800 hover:bg-red-950 hover:text-red-400 text-zinc-400 rounded text-[10px] font-bold transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            )}

                            {app.status === "accepted" && (
                              <span className="text-[10px] font-bold text-emerald-400">Accepted Partner</span>
                            )}
                            {app.status === "rejected" && (
                              <span className="text-[10px] font-bold text-red-400">Rejected Candidate</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
