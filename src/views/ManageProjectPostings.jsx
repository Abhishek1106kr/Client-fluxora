import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { Plus, Edit2, Trash2, Tag, Briefcase, FileText, Loader2, DollarSign, Clock, GitBranch } from "lucide-react";
import { toast } from "react-toastify";

export default function ManageProjectPostings({ backendUrl, token }) {
  const base = backendUrl || "http://localhost:5002";

  // Data States
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetRole: "",
    requiredSkills: "",
    stipend: "$1000 / Month",
    duration: "8 Weeks",
    repositoryUrl: "",
    minAssessmentScore: 70,
    skillsMatchThreshold: 2
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/projectcard/startup/mine`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setProjects(d.data || []);
      }
    } catch (err) {
      toast.error("Failed to load your posted projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.targetRole || !form.repositoryUrl) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const method = editingProjectId ? "PUT" : "POST";
      const url = editingProjectId ? `${base}/api/projectcard/${editingProjectId}` : `${base}/api/projectcard/create`;
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          targetRole: form.targetRole,
          requiredSkills: form.requiredSkills.split(",").map(t => t.trim()).filter(Boolean),
          stipend: form.stipend,
          duration: form.duration,
          repositoryUrl: form.repositoryUrl,
          eligibilityCriteria: {
            minAssessmentScore: Number(form.minAssessmentScore),
            skillsMatchThreshold: Number(form.skillsMatchThreshold)
          }
        })
      });

      const d = await res.json();
      if (res.ok && d.success) {
        toast.success(editingProjectId ? "Project updated successfully!" : "Project posted successfully!");
        setForm({
          title: "",
          description: "",
          targetRole: "",
          requiredSkills: "",
          stipend: "$1000 / Month",
          duration: "8 Weeks",
          repositoryUrl: "",
          minAssessmentScore: 70,
          skillsMatchThreshold: 2
        });
        setEditingProjectId(null);
        fetchProjects();
      } else {
        toast.error(d.message || "Operation failed.");
      }
    } catch (err) {
      toast.error("Error submitting project card.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (proj) => {
    setEditingProjectId(proj._id);
    setForm({
      title: proj.title || "",
      description: proj.description || "",
      targetRole: proj.targetRole || "",
      requiredSkills: (proj.requiredSkills || []).join(", "),
      stipend: proj.stipend || "$1000 / Month",
      duration: proj.duration || "8 Weeks",
      repositoryUrl: proj.repositoryUrl || "",
      minAssessmentScore: proj.eligibilityCriteria?.minAssessmentScore || 70,
      skillsMatchThreshold: proj.eligibilityCriteria?.skillsMatchThreshold || 2
    });
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project card?")) return;

    try {
      const res = await fetch(`${base}/api/projectcard/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      const d = await res.json();
      if (res.ok && d.success) {
        toast.success("Project card deleted.");
        fetchProjects();
      } else {
        toast.error(d.message || "Failed to delete.");
      }
    } catch (err) {
      toast.error("Error deleting project card.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-bold font-outfit text-zinc-50">Manage Project Postings</h3>
        <p className="text-xs text-zinc-550 mt-1">Create, update, and manage MongoDB Project cards for developer collaborations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left pane: Project card form */}
        <Card className="p-6 bg-zinc-900 border-zinc-800 flex flex-col gap-5 h-fit">
          <h4 className="font-bold text-zinc-150 text-sm font-outfit">
            {editingProjectId ? "Edit Project Card" : "Post a New Project"}
          </h4>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <InputField
              label="Project Title *"
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Real-Time Chat App"
              value={form.title}
              onChange={handleInputChange}
              required
              icon={Briefcase}
            />

            <InputField
              label="Target Role *"
              id="targetRole"
              name="targetRole"
              type="text"
              placeholder="e.g. React Native Developer"
              value={form.targetRole}
              onChange={handleInputChange}
              required
              icon={Briefcase}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Stipend"
                id="stipend"
                name="stipend"
                type="text"
                placeholder="e.g. $1000 / Month"
                value={form.stipend}
                onChange={handleInputChange}
                icon={DollarSign}
              />

              <InputField
                label="Duration"
                id="duration"
                name="duration"
                type="text"
                placeholder="e.g. 6 Weeks"
                value={form.duration}
                onChange={handleInputChange}
                icon={Clock}
              />
            </div>

            <InputField
              label="Repository URL *"
              id="repositoryUrl"
              name="repositoryUrl"
              type="url"
              placeholder="https://github.com/company/repo"
              value={form.repositoryUrl}
              onChange={handleInputChange}
              required
              icon={GitBranch}
            />

            <InputField
              label="Required Skills (Comma separated)"
              id="requiredSkills"
              name="requiredSkills"
              type="text"
              placeholder="React, Node.js, WebSockets"
              value={form.requiredSkills}
              onChange={handleInputChange}
              icon={Tag}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Min Score *"
                id="minAssessmentScore"
                name="minAssessmentScore"
                type="number"
                value={form.minAssessmentScore}
                onChange={handleInputChange}
                required
              />

              <InputField
                label="Min Skills *"
                id="skillsMatchThreshold"
                name="skillsMatchThreshold"
                type="number"
                value={form.skillsMatchThreshold}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Project Description *</label>
              <textarea
                name="description"
                placeholder="Describe project architecture, milestones, and expected outputs..."
                value={form.description}
                onChange={handleInputChange}
                required
                className="bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-zinc-300 text-xs focus:outline-none focus:border-emerald-600 h-28 resize-none"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <Button
                type="submit"
                variant="primary"
                className="flex-1 py-2.5"
                loading={submitting}
              >
                {editingProjectId ? "Save Changes" : "Post Project"}
              </Button>

              {editingProjectId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProjectId(null);
                    setForm({
                      title: "",
                      description: "",
                      targetRole: "",
                      requiredSkills: "",
                      stipend: "$1000 / Month",
                      duration: "8 Weeks",
                      repositoryUrl: "",
                      minAssessmentScore: 70,
                      skillsMatchThreshold: 2
                    });
                  }}
                  className="px-4 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-white transition-all text-xs font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </Card>

        {/* Right pane: Active project card grids */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-bold text-zinc-150 text-sm pl-1 font-outfit">Active Projects ({projects.length})</h4>

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl">
              <Loader2 className="animate-spin text-emerald-500" size={24} />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-2xl bg-zinc-950/20">
              No active projects listed yet. Use the creation form to list your first collaboration.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {projects.map((proj) => (
                <Card key={proj._id} className="p-5 bg-zinc-900 border-zinc-800 flex justify-between items-start gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-zinc-150 text-base font-outfit">{proj.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-zinc-300">{proj.targetRole}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span>{proj.stipend}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span>{proj.duration}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {(proj.requiredSkills || []).map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-zinc-950 text-[10px] text-zinc-450 border border-zinc-850 rounded">
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-500 font-mono select-all truncate max-w-[400px]">{proj.repositoryUrl}</p>
                    <p className="text-xs text-zinc-550 line-clamp-2 leading-relaxed">{proj.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(proj)}
                      className="p-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-all"
                      title="Edit Project Card"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(proj._id)}
                      className="p-2 border border-zinc-855 bg-zinc-950 hover:bg-red-950 hover:text-red-400 text-zinc-450 rounded-xl transition-all"
                      title="Delete Posting"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
