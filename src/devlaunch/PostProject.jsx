import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";

const TECH_OPTIONS = [
  "React", "Vue", "Angular", "Node.js", "Express", "Python", "Django", "FastAPI",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "TypeScript", "GraphQL", "Docker",
  "AWS", "Firebase", "Next.js", "Tailwind CSS", "Figma",
];

const DIFFICULTY_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const emptyMilestone = () => ({
  title: "",
  description: "",
  techStack: [],
  difficulty: "intermediate",
  duration: "",
  requiredScore: 0,
  deadline: "",
  questions: [],
});

const emptyQuestion = () => ({ question: "", options: ["", "", "", ""], correctIndex: 0 });

// ──────────────────────────────────────────────────────
// Submission states: "idle" | "loading" | "success" | "error"
// ──────────────────────────────────────────────────────
export default function PostProject({ onBack, existingProjects }) {
  const token = localStorage.getItem("token");

  const [useExisting, setUseExisting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Project form
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectTech, setProjectTech] = useState([]);
  const [projectDuration, setProjectDuration] = useState("");

  // Milestones
  const [milestones, setMilestones] = useState([emptyMilestone()]);
  const [expandedIdx, setExpandedIdx] = useState(0);

  // Explicit submission state (idle | loading | success | error)
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [error, setError] = useState("");

  // Field-level validation errors
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Helpers ──────────────────────────────────────────
  function toggleTech(list, setList, tech) {
    setList((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  }

  function updateMilestone(idx, field, value) {
    setMilestones((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  }

  function addMilestone() {
    setMilestones((prev) => [...prev, emptyMilestone()]);
    setExpandedIdx(milestones.length);
  }

  function removeMilestone(idx) {
    setMilestones((prev) => prev.filter((_, i) => i !== idx));
    setExpandedIdx((prev) => (prev >= idx ? Math.max(0, prev - 1) : prev));
  }

  function updateQuestion(mIdx, qIdx, field, value) {
    setMilestones((prev) =>
      prev.map((m, i) => {
        if (i !== mIdx) return m;
        const questions = m.questions.map((q, qi) =>
          qi === qIdx ? { ...q, [field]: value } : q
        );
        return { ...m, questions };
      })
    );
  }

  function updateOption(mIdx, qIdx, optIdx, value) {
    setMilestones((prev) =>
      prev.map((m, i) => {
        if (i !== mIdx) return m;
        const questions = m.questions.map((q, qi) => {
          if (qi !== qIdx) return q;
          const options = q.options.map((o, oi) => (oi === optIdx ? value : o));
          return { ...q, options };
        });
        return { ...m, questions };
      })
    );
  }

  function addQuestion(mIdx) {
    setMilestones((prev) =>
      prev.map((m, i) =>
        i === mIdx ? { ...m, questions: [...m.questions, emptyQuestion()] } : m
      )
    );
  }

  function removeQuestion(mIdx, qIdx) {
    setMilestones((prev) =>
      prev.map((m, i) =>
        i === mIdx ? { ...m, questions: m.questions.filter((_, qi) => qi !== qIdx) } : m
      )
    );
  }

  // ── Validation ────────────────────────────────────────
  function validateForm() {
    const errors = {};
    if (!useExisting && !projectTitle.trim()) {
      errors.projectTitle = "Project title is required.";
    }
    if (useExisting && !selectedProjectId) {
      errors.selectedProjectId = "Please select an existing project.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // ── Submit ────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitStatus("loading");
    setError("");

    try {
      let projectId = selectedProjectId;

      if (!useExisting || !selectedProjectId) {
        const pRes = await fetch("http://localhost:5002/api/devlaunch/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: projectTitle,
            description: projectDesc,
            techStack: projectTech,
            estimatedDuration: projectDuration,
          }),
        });
        const pData = await pRes.json();
        if (!pRes.ok) throw new Error(pData.error || "Failed to create project");
        projectId = pData._id;
      }

      for (const ms of milestones) {
        if (!ms.title.trim()) continue;
        const mRes = await fetch("http://localhost:5002/api/devlaunch/milestones", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectId,
            title: ms.title,
            description: ms.description,
            techStack: ms.techStack,
            difficulty: ms.difficulty,
            duration: ms.duration,
            requiredScore: ms.requiredScore,
            deadline: ms.deadline || undefined,
          }),
        });
        const mData = await mRes.json();
        if (!mRes.ok) throw new Error(mData.error || "Failed to create milestone");

        if (ms.questions && ms.questions.length > 0) {
          const validQs = ms.questions.filter(
            (q) => q.question.trim() && q.options.every((o) => o.trim())
          );
          if (validQs.length > 0) {
            await fetch(`http://localhost:5002/api/devlaunch/assessments/${mData._id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                questions: validQs,
                passingScore: ms.requiredScore || 60,
              }),
            });
          }
        }
      }

      setSubmitStatus("success");
      // Brief success pause before redirecting
      setTimeout(() => onBack(), 1200);
    } catch (err) {
      setError(err.message);
      setSubmitStatus("error");
    }
  }

  const isSubmitting = submitStatus === "loading";

  // ── Render ────────────────────────────────────────────
  return (
    <div
      data-testid="post-project-page"
      className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10 max-w-3xl mx-auto"
    >
      {/* Back Button */}
      <button
        data-testid="back-button"
        aria-label="Go back to dashboard"
        onClick={onBack}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold font-outfit text-zinc-50 mb-6">
        Create Project + Milestones
      </h1>

      {/* Success Banner */}
      {submitStatus === "success" && (
        <div
          data-testid="submit-status-success"
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400 font-semibold"
        >
          <CheckCircle2 size={16} aria-hidden="true" /> Project saved! Redirecting…
        </div>
      )}

      <form
        data-testid="post-project-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-6"
      >
        {/* ── PROJECT DETAILS CARD ── */}
        <Card className="p-6" data-testid="project-details-card">
          <h2 className="font-bold text-zinc-200 mb-4">Project Details</h2>

          {/* Toggle: New vs Existing */}
          {existingProjects && existingProjects.length > 0 && (
            <div
              data-testid="project-mode-toggle"
              role="group"
              aria-label="Choose new or existing project"
              className="flex gap-2 mb-4"
            >
              <button
                type="button"
                data-testid="mode-new-project"
                aria-pressed={!useExisting}
                onClick={() => {
                  setUseExisting(false);
                  setFieldErrors((p) => ({ ...p, selectedProjectId: "" }));
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  !useExisting
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "border-zinc-700 text-zinc-400"
                }`}
              >
                New Project
              </button>
              <button
                type="button"
                data-testid="mode-existing-project"
                aria-pressed={useExisting}
                onClick={() => {
                  setUseExisting(true);
                  setFieldErrors((p) => ({ ...p, projectTitle: "" }));
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  useExisting
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "border-zinc-700 text-zinc-400"
                }`}
              >
                Add to Existing
              </button>
            </div>
          )}

          {useExisting ? (
            <div className="flex flex-col gap-1">
              <Select
                label="Select Project"
                id="existingProject"
                data-testid="select-existing-project"
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setFieldErrors((p) => ({ ...p, selectedProjectId: "" }));
                }}
                options={[
                  { value: "", label: "-- Choose a project --" },
                  ...(existingProjects || []).map((p) => ({ value: p._id, label: p.title })),
                ]}
                aria-invalid={!!fieldErrors.selectedProjectId}
                aria-describedby={fieldErrors.selectedProjectId ? "error-selected-project" : undefined}
                required
              />
              {fieldErrors.selectedProjectId && (
                <p
                  id="error-selected-project"
                  data-testid="input-error-selected-project"
                  role="alert"
                  className="text-xs text-red-400 mt-1"
                >
                  {fieldErrors.selectedProjectId}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Project Title */}
              <div className="flex flex-col gap-1">
                <InputField
                  label="Project Title"
                  id="projectTitle"
                  data-testid="input-project-title"
                  placeholder="e.g. SaaS Dashboard"
                  value={projectTitle}
                  onChange={(e) => {
                    setProjectTitle(e.target.value);
                    if (fieldErrors.projectTitle) setFieldErrors((p) => ({ ...p, projectTitle: "" }));
                  }}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.projectTitle}
                  aria-describedby={fieldErrors.projectTitle ? "error-project-title" : undefined}
                  required
                />
                {fieldErrors.projectTitle && (
                  <p
                    id="error-project-title"
                    data-testid="input-error-project-title"
                    role="alert"
                    className="text-xs text-red-400"
                  >
                    {fieldErrors.projectTitle}
                  </p>
                )}
              </div>

              <Textarea
                label="Project Description"
                id="projectDesc"
                data-testid="input-project-desc"
                placeholder="What are you building? What problem does it solve?"
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                rows={3}
              />

              <InputField
                label="Estimated Duration"
                id="projectDuration"
                data-testid="input-project-duration"
                placeholder="e.g. 3 months"
                value={projectDuration}
                onChange={(e) => setProjectDuration(e.target.value)}
              />

              {/* Tech Stack */}
              <div>
                <p
                  id="project-tech-label"
                  className="text-xs font-semibold text-zinc-300 uppercase mb-2"
                >
                  Tech Stack
                </p>
                <div
                  data-testid="project-tech-stack"
                  role="group"
                  aria-labelledby="project-tech-label"
                  className="flex flex-wrap gap-1.5"
                >
                  {TECH_OPTIONS.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      data-testid={`tech-btn-${tech.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
                      aria-pressed={projectTech.includes(tech)}
                      aria-label={`${projectTech.includes(tech) ? "Remove" : "Add"} tech: ${tech}`}
                      onClick={() => toggleTech(projectTech, setProjectTech, tech)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                        projectTech.includes(tech)
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ── MILESTONES ── */}
        <div data-testid="milestones-section">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-zinc-200">Milestones</h2>
            <Button
              type="button"
              data-testid="add-milestone-btn"
              aria-label="Add a new milestone"
              variant="secondary"
              size="sm"
              onClick={addMilestone}
              icon={Plus}
            >
              Add Milestone
            </Button>
          </div>

          <div className="flex flex-col gap-4" role="list" aria-label="Milestone list">
            {milestones.map((ms, idx) => (
              <Card
                key={idx}
                data-testid={`milestone-card-${idx}`}
                role="listitem"
                className="p-5"
              >
                {/* Milestone Header (collapse toggle) */}
                <div
                  className="flex items-center gap-3 mb-4 cursor-pointer"
                  onClick={() => setExpandedIdx(expandedIdx === idx ? -1 : idx)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedIdx === idx}
                  aria-controls={`milestone-body-${idx}`}
                  data-testid={`milestone-toggle-${idx}`}
                  onKeyDown={(e) => e.key === "Enter" && setExpandedIdx(expandedIdx === idx ? -1 : idx)}
                >
                  <span className="text-xs font-bold text-zinc-400">#{idx + 1}</span>
                  <span className="font-semibold text-zinc-200 flex-1">
                    {ms.title || "Untitled Milestone"}
                  </span>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      data-testid={`remove-milestone-${idx}`}
                      aria-label={`Remove milestone ${idx + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMilestone(idx);
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  )}
                  {expandedIdx === idx
                    ? <ChevronUp size={16} className="text-zinc-500" aria-hidden="true" />
                    : <ChevronDown size={16} className="text-zinc-500" aria-hidden="true" />}
                </div>

                {/* Milestone Body */}
                {expandedIdx === idx && (
                  <div
                    id={`milestone-body-${idx}`}
                    data-testid={`milestone-body-${idx}`}
                    className="flex flex-col gap-4"
                  >
                    <InputField
                      label="Milestone Title"
                      id={`ms-title-${idx}`}
                      data-testid={`input-milestone-title-${idx}`}
                      placeholder='e.g. "Build Auth Module"'
                      value={ms.title}
                      onChange={(e) => updateMilestone(idx, "title", e.target.value)}
                      required
                    />
                    <Textarea
                      label="Description"
                      id={`ms-desc-${idx}`}
                      data-testid={`input-milestone-desc-${idx}`}
                      placeholder="What exactly needs to be built?"
                      value={ms.description}
                      onChange={(e) => updateMilestone(idx, "description", e.target.value)}
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Difficulty"
                        id={`ms-diff-${idx}`}
                        data-testid={`select-milestone-difficulty-${idx}`}
                        value={ms.difficulty}
                        onChange={(e) => updateMilestone(idx, "difficulty", e.target.value)}
                        options={DIFFICULTY_OPTIONS}
                      />
                      <InputField
                        label="Duration"
                        id={`ms-dur-${idx}`}
                        data-testid={`input-milestone-duration-${idx}`}
                        placeholder="e.g. 2 weeks"
                        value={ms.duration}
                        onChange={(e) => updateMilestone(idx, "duration", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Min. Assessment Score (%)"
                        id={`ms-score-${idx}`}
                        data-testid={`input-milestone-score-${idx}`}
                        type="number"
                        min={0}
                        max={100}
                        value={ms.requiredScore}
                        onChange={(e) => updateMilestone(idx, "requiredScore", Number(e.target.value))}
                      />
                      <InputField
                        label="Deadline"
                        id={`ms-deadline-${idx}`}
                        data-testid={`input-milestone-deadline-${idx}`}
                        type="date"
                        value={ms.deadline}
                        onChange={(e) => updateMilestone(idx, "deadline", e.target.value)}
                      />
                    </div>

                    {/* Tech Stack for Milestone */}
                    <div>
                      <p
                        id={`ms-tech-label-${idx}`}
                        className="text-xs font-semibold text-zinc-300 uppercase mb-2"
                      >
                        Required Tech Stack
                      </p>
                      <div
                        data-testid={`milestone-tech-stack-${idx}`}
                        role="group"
                        aria-labelledby={`ms-tech-label-${idx}`}
                        className="flex flex-wrap gap-1.5"
                      >
                        {TECH_OPTIONS.map((tech) => (
                          <button
                            key={tech}
                            type="button"
                            data-testid={`ms-${idx}-tech-${tech.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
                            aria-pressed={ms.techStack.includes(tech)}
                            aria-label={`${ms.techStack.includes(tech) ? "Remove" : "Add"} tech: ${tech}`}
                            onClick={() =>
                              updateMilestone(
                                idx,
                                "techStack",
                                ms.techStack.includes(tech)
                                  ? ms.techStack.filter((t) => t !== tech)
                                  : [...ms.techStack, tech]
                              )
                            }
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                              ms.techStack.includes(tech)
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                                : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Assessment Questions */}
                    <div data-testid={`assessment-questions-${idx}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-zinc-300 uppercase">
                          Assessment Questions
                        </p>
                        <Button
                          type="button"
                          data-testid={`add-question-btn-${idx}`}
                          aria-label={`Add assessment question to milestone ${idx + 1}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => addQuestion(idx)}
                          icon={Plus}
                        >
                          Add Question
                        </Button>
                      </div>

                      {ms.questions.length === 0 && (
                        <p
                          data-testid={`no-questions-placeholder-${idx}`}
                          className="text-xs text-zinc-600 text-center py-3"
                        >
                          No questions yet. Click "Add Question" to get started.
                        </p>
                      )}

                      {ms.questions.map((q, qi) => (
                        <div
                          key={qi}
                          data-testid={`question-block-${idx}-${qi}`}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-3"
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <label htmlFor={`q-text-${idx}-${qi}`} className="sr-only">
                              Question {qi + 1} text
                            </label>
                            <input
                              id={`q-text-${idx}-${qi}`}
                              data-testid={`input-question-${idx}-${qi}`}
                              className="flex-1 bg-transparent border-b border-zinc-700 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 pb-1"
                              placeholder={`Question ${qi + 1}`}
                              value={q.question}
                              onChange={(e) => updateQuestion(idx, qi, "question", e.target.value)}
                            />
                            <button
                              type="button"
                              data-testid={`remove-question-${idx}-${qi}`}
                              aria-label={`Remove question ${qi + 1}`}
                              onClick={() => removeQuestion(idx, qi)}
                              className="text-red-400 hover:text-red-300 shrink-0"
                            >
                              <Trash2 size={13} aria-hidden="true" />
                            </button>
                          </div>

                          <fieldset>
                            <legend className="sr-only">Answer options for question {qi + 1}</legend>
                            {q.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-2 mb-1.5">
                                <input
                                  type="radio"
                                  id={`opt-${idx}-${qi}-${oi}`}
                                  data-testid={`radio-correct-${idx}-${qi}-${oi}`}
                                  name={`correct-${idx}-${qi}`}
                                  checked={q.correctIndex === oi}
                                  onChange={() => updateQuestion(idx, qi, "correctIndex", oi)}
                                  className="accent-emerald-500"
                                  aria-label={`Mark option ${oi + 1} as correct`}
                                />
                                <label htmlFor={`opt-input-${idx}-${qi}-${oi}`} className="sr-only">
                                  Option {oi + 1}
                                </label>
                                <input
                                  id={`opt-input-${idx}-${qi}-${oi}`}
                                  data-testid={`input-option-${idx}-${qi}-${oi}`}
                                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                                  placeholder={`Option ${oi + 1}`}
                                  value={opt}
                                  onChange={(e) => updateOption(idx, qi, oi, e.target.value)}
                                />
                              </div>
                            ))}
                          </fieldset>
                          <p className="text-xs text-zinc-500 mt-1">
                            Select the radio button next to the correct answer.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Global Error Display */}
        {submitStatus === "error" && error && (
          <div
            data-testid="submit-error-message"
            role="alert"
            aria-live="assertive"
            className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg"
          >
            <XCircle size={16} aria-hidden="true" /> {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          data-testid="submit-project-btn"
          aria-label="Save project and milestones"
          aria-disabled={isSubmitting}
          variant="primary"
          className="w-full py-3"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving…" : "Save Project & Milestones"}
        </Button>
      </form>
    </div>
  );
}
