import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, ChevronRight, Clock, Loader2 } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const STATUS_COLORS = {
  open: "text-emerald-400 bg-emerald-500/10",
  in_progress: "text-blue-400 bg-blue-500/10",
  review: "text-amber-400 bg-amber-500/10",
  completed: "text-zinc-400 bg-zinc-700",
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5002/api/devlaunch/projects/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProject(d.project);
        setMilestones(d.milestones);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {project && (
        <>
          <div className="mb-8">
            <span className={`text-xs px-2 py-0.5 rounded-full mb-2 inline-block ${
              project.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-700 text-zinc-400"
            }`}>
              {project.status}
            </span>
            <h1 className="text-3xl font-bold font-outfit text-zinc-50 mb-2">{project.title}</h1>
            <p className="text-zinc-300 text-sm leading-relaxed mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {(project.techStack || []).map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-300">{t}</span>
              ))}
            </div>
            {project.estimatedDuration && (
              <div className="flex items-center gap-1 mt-3 text-sm text-zinc-500">
                <Clock size={14} /> {project.estimatedDuration}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-zinc-200 text-lg">
              Milestones <span className="text-zinc-500 font-normal text-sm">({milestones.length})</span>
            </h2>
          </div>

          {milestones.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">No milestones for this project yet.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {milestones.map((m) => (
                <Card key={m._id} hoverable className="p-4 cursor-pointer" onClick={() => navigate(`/devlaunch/milestone/${m._id}`)}>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-zinc-200">{m.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{m.description}</p>
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
                    <ChevronRight size={16} className="text-zinc-600 shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
