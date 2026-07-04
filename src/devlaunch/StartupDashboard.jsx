import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronRight, Users, Clock, Loader2, Zap } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PostProject from "./PostProject";
import ApplicantsPanel from "./ApplicantsPanel";

const STATUS_COLORS = {
  open: "text-emerald-400 bg-emerald-500/10",
  in_progress: "text-blue-400 bg-blue-500/10",
  review: "text-amber-400 bg-amber-500/10",
  completed: "text-zinc-400 bg-zinc-700",
};

export default function StartupDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostProject, setShowPostProject] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    if (role !== "startup") {
      navigate("/devlaunch");
      return;
    }
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [pRes, mRes] = await Promise.all([
      fetch("http://localhost:5002/api/devlaunch/projects/my/projects", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5002/api/devlaunch/milestones/startup/mine", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    if (pRes.ok) setProjects(await pRes.json());
    if (mRes.ok) setMilestones(await mRes.json());
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  if (showPostProject) {
    return (
      <PostProject
        onBack={() => {
          setShowPostProject(false);
          fetchData();
        }}
        existingProjects={projects}
      />
    );
  }

  if (selectedMilestone) {
    return (
      <ApplicantsPanel
        milestoneId={selectedMilestone}
        onBack={() => {
          setSelectedMilestone(null);
          fetchData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-zinc-50">Startup Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your projects and developer assignments</p>
        </div>
        <Button variant="primary" onClick={() => setShowPostProject(true)} icon={Plus}>
          New Project
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800 mb-6">
        {["projects", "milestones"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? "text-emerald-400 border-b-2 border-emerald-500"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "projects" && (
        <div>
          {projects.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <Zap size={32} className="mx-auto mb-3 text-zinc-700" />
              <p>No projects yet. Create your first project!</p>
              <Button variant="primary" className="mt-4" onClick={() => setShowPostProject(true)}>
                Create Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <Card key={p._id} hoverable className="p-5 cursor-pointer" onClick={() => navigate(`/devlaunch/project/${p._id}`)}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-zinc-100">{p.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-700 text-zinc-400"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {(p.techStack || []).slice(0, 3).map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-300">{t}</span>
                    ))}
                  </div>
                  {p.estimatedDuration && (
                    <div className="flex items-center gap-1 mt-3 text-xs text-zinc-500">
                      <Clock size={11} /> {p.estimatedDuration}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "milestones" && (
        <div>
          {milestones.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <p>No milestones yet. Create a project first, then add milestones.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {milestones.map((m) => (
                <Card key={m._id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-500 mb-0.5">{m.projectId?.title}</p>
                      <h4 className="font-semibold text-zinc-200 truncate">{m.title}</h4>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[m.status]}`}>
                      {m.status.replace("_", " ")}
                    </span>
                    {m.assignedDeveloper && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <img
                          src={m.assignedDeveloper.avatar || "https://randomuser.me/api/portraits/lego/2.jpg"}
                          className="w-6 h-6 rounded-full border border-zinc-700"
                          alt=""
                        />
                        <span className="text-xs text-zinc-400">{m.assignedDeveloper.name}</span>
                      </div>
                    )}
                    <div className="flex gap-2 shrink-0">
                      {m.status === "open" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedMilestone(m._id)}
                          icon={Users}
                        >
                          Applicants
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/devlaunch/milestone/${m._id}`)}
                        icon={ChevronRight}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
