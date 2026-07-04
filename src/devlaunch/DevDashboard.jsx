import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, ChevronRight, Loader2, Star, XCircle } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const STATUS_COLORS = {
  open: "text-emerald-400 bg-emerald-500/10",
  in_progress: "text-blue-400 bg-blue-500/10",
  review: "text-amber-400 bg-amber-500/10",
  completed: "text-zinc-400 bg-zinc-700",
};

const APP_STATUS = {
  pending: "text-zinc-400 bg-zinc-800",
  approved: "text-emerald-400 bg-emerald-500/10",
  rejected: "text-red-400 bg-red-500/10",
};

export default function DevDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [assignedMilestones, setAssignedMilestones] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assigned");

  useEffect(() => {
    if (role !== "developer") {
      navigate("/devlaunch");
      return;
    }
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [mRes, aRes] = await Promise.all([
      fetch("http://localhost:5002/api/devlaunch/milestones/developer/mine", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5002/api/devlaunch/applications/mine", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    if (mRes.ok) setAssignedMilestones(await mRes.json());
    if (aRes.ok) setMyApplications(await aRes.json());
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  const active = assignedMilestones.filter((m) => m.status === "in_progress" || m.status === "review");
  const completed = assignedMilestones.filter((m) => m.status === "completed");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-zinc-50">My DevLaunch</h1>
          <p className="text-zinc-400 text-sm mt-1">Track your milestones and applications</p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/devlaunch")}>
          Browse Marketplace
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{active.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Active Milestones</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-zinc-200">{completed.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Completed</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-zinc-200">{myApplications.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Applications</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800 mb-6">
        {["assigned", "applications"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? "text-emerald-400 border-b-2 border-emerald-500"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab === "assigned" ? "My Milestones" : "My Applications"}
          </button>
        ))}
      </div>

      {activeTab === "assigned" && (
        <div className="flex flex-col gap-3">
          {assignedMilestones.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <p>No milestones assigned yet. Browse the marketplace to apply.</p>
              <Button variant="primary" className="mt-4" onClick={() => navigate("/devlaunch")}>
                Browse Marketplace
              </Button>
            </div>
          ) : (
            assignedMilestones.map((m) => (
              <Card key={m._id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-500 mb-0.5">
                      {m.projectId?.title} · {m.startupId?.companyName || m.startupId?.name}
                    </p>
                    <h4 className="font-semibold text-zinc-200 truncate">{m.title}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(m.techStack || []).slice(0, 3).map((t) => (
                        <span key={t} className="text-xs px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-400">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[m.status]}`}>
                      {m.status.replace("_", " ")}
                    </span>
                    {m.deadline && (
                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                        <Clock size={11} /> {new Date(m.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <Link to={`/devlaunch/milestone/${m._id}`}>
                    <Button variant="ghost" size="sm" icon={ChevronRight}>View</Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "applications" && (
        <div className="flex flex-col gap-3">
          {myApplications.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <p>No applications yet.</p>
            </div>
          ) : (
            myApplications.map((app) => {
              const ms = app.milestoneId;
              return (
                <Card key={app._id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-zinc-200 truncate">{ms?.title || "Milestone"}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                        {app.assessmentScore !== null && (
                          <span className="flex items-center gap-1">
                            {app.assessmentPassed ? <CheckCircle size={11} className="text-emerald-400" /> : <XCircle size={11} className="text-red-400" />}
                            Score: {app.assessmentScore}%
                          </span>
                        )}
                        {ms?.difficulty && <span>{ms.difficulty}</span>}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${APP_STATUS[app.status]}`}>
                      {app.status}
                    </span>
                    {ms?._id && (
                      <Link to={`/devlaunch/milestone/${ms._id}`}>
                        <Button variant="ghost" size="sm" icon={ChevronRight}>View</Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
