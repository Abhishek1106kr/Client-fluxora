import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, XCircle, Star, Github, Loader2 } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function ApplicantsPanel({ milestoneId, onBack }) {
  const token = localStorage.getItem("token");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [milestoneId]);
  

  async function fetchApplications() {
    setLoading(true);
    const res = await fetch(`http://localhost:5002/api/devlaunch/applications/milestone/${milestoneId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setApplications(await res.json());
    setLoading(false);
  }

  async function assignDeveloper(applicationId) {
    setAssigning(applicationId);
    const res = await fetch(`http://localhost:5002/api/devlaunch/milestones/${milestoneId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ applicationId }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Developer assigned!");
      onBack();
    } else {
      alert(data.error || "Could not assign");
    }
    setAssigning(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold font-outfit text-zinc-50 mb-6">
        Applicants{" "}
        <span className="text-zinc-500 font-normal text-base">({applications.length})</span>
      </h1>

      {applications.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">No applications yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => {
            const dev = app.developerId;
            return (
              <Card key={app._id} className="p-5">
                <div className="flex items-start gap-4">
                  <img
                    src={dev?.avatar || "https://randomuser.me/api/portraits/lego/2.jpg"}
                    className="w-12 h-12 rounded-full border border-zinc-700 object-cover shrink-0"
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-zinc-100">{dev?.name}</h3>
                      {app.assessmentPassed ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle size={11} /> Passed
                        </span>
                      ) : app.assessmentScore !== null ? (
                        <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                          <XCircle size={11} /> Failed
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">Pending</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-zinc-400 mb-2">
                      {app.assessmentScore !== null && (
                        <span>Score: <strong className="text-zinc-200">{app.assessmentScore}%</strong></span>
                      )}
                      {dev?.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star size={11} className="text-amber-400" />
                          {dev.rating.toFixed(1)} ({dev.ratingCount})
                        </span>
                      )}
                      {dev?.github && (
                        <a href={dev.github} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-400 hover:underline">
                          <Github size={11} /> GitHub
                        </a>
                      )}
                    </div>

                    {(dev?.skills || []).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dev.skills.slice(0, 5).map((s) => (
                          <span key={s} className="text-xs px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-300">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {app.assessmentPassed && app.status === "pending" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => assignDeveloper(app._id)}
                      loading={assigning === app._id}
                      className="shrink-0"
                    >
                      Assign
                    </Button>
                  )}
                  {app.status === "approved" && (
                    <span className="text-xs text-emerald-400 font-semibold shrink-0">Assigned</span>
                  )}
                  {app.status === "rejected" && (
                    <span className="text-xs text-zinc-500 shrink-0">Rejected</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
