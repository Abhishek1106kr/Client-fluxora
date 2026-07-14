import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { Plus, Edit2, Trash2, MapPin, Tag, Briefcase, FileText, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function ManagePostings({ backendUrl, token }) {
  const base = backendUrl || "http://localhost:5002";

  // Data States
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [editingJobId, setEditingJobId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "Remote",
    jobType: "Full Time",
    tags: "",
    description: "",
    applyLink: ""
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/jobs/startup/mine`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setJobs(d.data || []);
      }
    } catch (err) {
      toast.error("Failed to load your posted jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.description) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const method = editingJobId ? "PUT" : "POST";
      const url = editingJobId ? `${base}/api/jobs/${editingJobId}` : `${base}/api/jobs`;
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
        })
      });

      const d = await res.json();
      if (res.ok && d.success) {
        toast.success(editingJobId ? "Job updated successfully!" : "Job posted successfully!");
        setForm({
          title: "",
          company: "",
          location: "Remote",
          jobType: "Full Time",
          tags: "",
          description: "",
          applyLink: ""
        });
        setEditingJobId(null);
        fetchJobs();
      } else {
        toast.error(d.message || "Operation failed.");
      }
    } catch (err) {
      toast.error("Error submitting job card.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (job) => {
    setEditingJobId(job._id);
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "Remote",
      jobType: job.jobType || "Full Time",
      tags: (job.tags || []).join(", "),
      description: job.description || "",
      applyLink: job.applyLink || ""
    });
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;

    try {
      const res = await fetch(`${base}/api/jobs/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      const d = await res.json();
      if (res.ok && d.success) {
        toast.success("Job posting deleted.");
        fetchJobs();
      } else {
        toast.error(d.message || "Failed to delete.");
      }
    } catch (err) {
      toast.error("Error deleting job posting.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-bold font-outfit text-zinc-50">Manage Job Postings</h3>
        <p className="text-xs text-zinc-550 mt-1">Create, update, and manage your venture's active job card listings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left pane: Job card form */}
        <Card className="p-6 bg-zinc-900 border-zinc-800 flex flex-col gap-5 h-fit">
          <h4 className="font-bold text-zinc-150 text-sm font-outfit">
            {editingJobId ? "Edit Job Posting" : "Post a New Role"}
          </h4>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <InputField
              label="Job Title *"
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Lead Frontend Architect"
              value={form.title}
              onChange={handleInputChange}
              required
              icon={Briefcase}
            />

            <InputField
              label="Company Name *"
              id="company"
              name="company"
              type="text"
              placeholder="e.g. Stripe Labs"
              value={form.company}
              onChange={handleInputChange}
              required
              icon={Briefcase}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Location"
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Remote / New York"
                value={form.location}
                onChange={handleInputChange}
                icon={MapPin}
              />

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Job Type</label>
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleInputChange}
                  className="bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-2 text-zinc-300 text-xs focus:outline-none focus:border-emerald-600 h-[38px]"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <InputField
              label="Tags (Comma separated)"
              id="tags"
              name="tags"
              type="text"
              placeholder="React, Node.js, TypeScript"
              value={form.tags}
              onChange={handleInputChange}
              icon={Tag}
            />

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Job Description *</label>
              <textarea
                name="description"
                placeholder="Detailed explanation of requirements and roles..."
                value={form.description}
                onChange={handleInputChange}
                required
                className="bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-zinc-300 text-xs focus:outline-none focus:border-emerald-600 h-28 resize-none"
              />
            </div>

            <InputField
              label="Application Link (optional)"
              id="applyLink"
              name="applyLink"
              type="url"
              placeholder="https://company.com/careers/lead-frontend"
              value={form.applyLink}
              onChange={handleInputChange}
              icon={FileText}
            />

            <div className="flex gap-3 mt-2">
              <Button
                type="submit"
                variant="primary"
                className="flex-1 py-2.5"
                loading={submitting}
              >
                {editingJobId ? "Save Changes" : "Create Card"}
              </Button>

              {editingJobId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingJobId(null);
                    setForm({
                      title: "",
                      company: "",
                      location: "Remote",
                      jobType: "Full Time",
                      tags: "",
                      description: "",
                      applyLink: ""
                    });
                  }}
                  className="px-4 border border-zinc-805 bg-zinc-950 hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-white transition-all text-xs font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </Card>

        {/* Right pane: Active job card grids */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-bold text-zinc-150 text-sm pl-1 font-outfit">Active Postings ({jobs.length})</h4>

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl">
              <Loader2 className="animate-spin text-emerald-555" size={24} />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-2xl bg-zinc-950/20">
              No active job openings created yet. Use the creation form to list your first role.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <Card key={job._id} className="p-5 bg-zinc-900 border-zinc-800 flex justify-between items-start gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-zinc-150 text-base font-outfit">{job.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                        <span className="font-semibold text-zinc-300">{job.company}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span>{job.location}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span className="px-1.5 py-0.5 bg-zinc-950 text-[10px] text-zinc-500 rounded border border-zinc-850">
                          {job.jobType}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {(job.tags || []).map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-zinc-950 text-[10px] text-zinc-450 border border-zinc-850 rounded">
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-550 line-clamp-2 leading-relaxed">{job.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(job)}
                      className="p-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-all"
                      title="Edit Job Card"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
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
