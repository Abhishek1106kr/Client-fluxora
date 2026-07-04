import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Clock, Code2, CheckCircle, Send, ArrowLeft, Star,
  Github, Users, AlertCircle, Loader2
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const DIFFICULTY_COLORS = {
  beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  advanced: "text-red-400 bg-red-500/10 border-red-500/20",
};

const STATUS_COLORS = {
  open: "text-emerald-400 bg-emerald-500/10",
  in_progress: "text-blue-400 bg-blue-500/10",
  review: "text-amber-400 bg-amber-500/10",
  completed: "text-zinc-400 bg-zinc-700",
};

const SOCKET_URL = "http://localhost:5002";

export default function MilestoneDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [milestone, setMilestone] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [myApplication, setMyApplication] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState("");
  const [kanban, setKanban] = useState([]);
  const [newTask, setNewTask] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  useEffect(() => {
    fetchMilestone();
    if (token) {
      fetchAssessment();
      fetchMyApplication();
    }
  }, [id]);

  useEffect(() => {
    if (!token || !milestone) return;
    const isParticipant =
      milestone.startupId?._id === userId ||
      milestone.assignedDeveloper?._id === userId;
    if (!isParticipant) return;

    fetchMessages();
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;
    socket.emit("join_room", id);
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.emit("leave_room", id);
      socket.disconnect();
    };
  }, [milestone]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchMilestone() {
    const res = await fetch(`http://localhost:5002/api/devlaunch/milestones/${id}`);
    if (res.ok) {
      const data = await res.json();
      setMilestone(data);
      setKanban(data.kanban || []);
    }
    setLoading(false);
  }

  async function fetchAssessment() {
    const res = await fetch(`http://localhost:5002/api/devlaunch/assessments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setAssessment(await res.json());
  }

  async function fetchMyApplication() {
    const res = await fetch("http://localhost:5002/api/devlaunch/applications/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const apps = await res.json();
      const mine = apps.find((a) => a.milestoneId?._id === id || a.milestoneId === id);
      setMyApplication(mine || null);
    }
  }

  async function fetchMessages() {
    const res = await fetch(`http://localhost:5002/api/devlaunch/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setMessages(await res.json());
  }

  async function handleApply() {
    setApplying(true);
    const res = await fetch(`http://localhost:5002/api/devlaunch/applications/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setMyApplication(data);
      setShowAssessment(true);
    } else {
      alert(data.error || "Could not apply");
    }
    setApplying(false);
  }

  async function handleSubmitAssessment(e) {
    e.preventDefault();
    const res = await fetch(`http://localhost:5002/api/devlaunch/assessments/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    setResult(data);
    setSubmitted(true);
    fetchMyApplication();
  }

  async function sendMessage() {
    if (!msgText.trim()) return;
    const senderName = "You";
    socketRef.current?.emit("send_message", {
      milestoneId: id,
      senderId: userId,
      senderName,
      text: msgText.trim(),
    });
    setMsgText("");
  }

  async function addKanbanTask() {
    if (!newTask.trim()) return;
    const updated = [...kanban, newTask.trim()];
    await fetch(`http://localhost:5002/api/devlaunch/milestones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ kanban: updated }),
    });
    setKanban(updated);
    setNewTask("");
  }

  async function removeKanbanTask(idx) {
    const updated = kanban.filter((_, i) => i !== idx);
    await fetch(`http://localhost:5002/api/devlaunch/milestones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ kanban: updated }),
    });
    setKanban(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  if (!milestone) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-400">
        Milestone not found.
      </div>
    );
  }

  const isParticipant =
    milestone.startupId?._id === userId ||
    (milestone.assignedDeveloper && milestone.assignedDeveloper._id === userId);
  const isStartup = role === "startup" && milestone.startupId?._id === userId;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10 max-w-5xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate("/devlaunch")}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Milestone Info */}
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-xs text-zinc-500 mb-1">
                  {milestone.projectId?.title} · {milestone.startupId?.companyName || milestone.startupId?.name}
                </p>
                <h1 className="text-2xl font-bold text-zinc-50">{milestone.title}</h1>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[milestone.status]}`}>
                {milestone.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed mb-4">{milestone.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {(milestone.techStack || []).map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs border border-zinc-700">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
              <span className={`font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[milestone.difficulty]}`}>
                {milestone.difficulty}
              </span>
              {milestone.duration && (
                <span className="flex items-center gap-1"><Clock size={12} /> {milestone.duration}</span>
              )}
              {milestone.requiredScore > 0 && (
                <span className="flex items-center gap-1"><Star size={12} /> Min. score: {milestone.requiredScore}%</span>
              )}
              {milestone.assignedDeveloper && (
                <span className="flex items-center gap-1">
                  <Users size={12} /> Assigned: {milestone.assignedDeveloper.name}
                </span>
              )}
            </div>
          </Card>

          {/* Developer: Apply / Assessment */}
          {role === "developer" && milestone.status === "open" && (
            <Card className="p-6">
              {!myApplication && (
                <div>
                  <h3 className="font-bold text-zinc-200 mb-2">Apply for this Milestone</h3>
                  <p className="text-xs text-zinc-400 mb-4">
                    You'll be asked to complete a quick assessment after applying.
                  </p>
                  <Button variant="primary" onClick={handleApply} loading={applying} icon={CheckCircle}>
                    Apply Now
                  </Button>
                </div>
              )}

              {myApplication && !submitted && assessment && (showAssessment || !myApplication.assessmentPassed) && (
                <div>
                  <h3 className="font-bold text-zinc-200 mb-4 flex items-center gap-2">
                    <Code2 size={16} className="text-emerald-400" /> Assessment ({assessment.questions.length} questions)
                  </h3>
                  <form onSubmit={handleSubmitAssessment} className="flex flex-col gap-5">
                    {assessment.questions.map((q, qi) => (
                      <div key={qi}>
                        <p className="text-sm font-medium text-zinc-200 mb-2">{qi + 1}. {q.question}</p>
                        <div className="flex flex-col gap-1.5">
                          {q.options.map((opt, oi) => (
                            <label key={oi} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-sm transition-all ${
                              answers[qi] === oi
                                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                                : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}>
                              <input
                                type="radio"
                                name={`q${qi}`}
                                className="hidden"
                                onChange={() => {
                                  const a = [...answers];
                                  a[qi] = oi;
                                  setAnswers(a);
                                }}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button type="submit" variant="primary" disabled={answers.filter((a) => a !== undefined).length !== assessment.questions.length}>
                      Submit Assessment
                    </Button>
                  </form>
                </div>
              )}

              {(submitted || (myApplication && myApplication.assessmentScore !== null)) && (
                <div className={`p-4 rounded-xl border ${
                  (result?.passed || myApplication?.assessmentPassed)
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {(result?.passed || myApplication?.assessmentPassed) ? (
                      <CheckCircle size={18} className="text-emerald-400" />
                    ) : (
                      <AlertCircle size={18} className="text-red-400" />
                    )}
                    <span className="font-semibold text-zinc-200">
                      {(result?.passed || myApplication?.assessmentPassed) ? "Assessment Passed!" : "Assessment Failed"}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Score: {result?.score ?? myApplication?.assessmentScore}% · Passing: {result?.passingScore ?? assessment?.passingScore}%
                  </p>
                  {(result?.passed || myApplication?.assessmentPassed) && (
                    <p className="text-xs text-emerald-400 mt-1">Waiting for startup approval.</p>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* Kanban Board (for participants) */}
          {isParticipant && (
            <Card className="p-6">
              <h3 className="font-bold text-zinc-200 mb-4">Task Board</h3>
              <div className="flex flex-col gap-2">
                {kanban.length === 0 && (
                  <p className="text-xs text-zinc-500">No tasks yet. Add one below.</p>
                )}
                {kanban.map((task, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-zinc-800 rounded-lg border border-zinc-700">
                    <CheckCircle size={14} className="text-zinc-500 shrink-0" />
                    <span className="text-sm text-zinc-300 flex-1">{task}</span>
                    <button onClick={() => removeKanbanTask(i)} className="text-zinc-600 hover:text-red-400 transition-colors text-xs">✕</button>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60"
                    placeholder="Add a task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addKanbanTask()}
                  />
                  <Button variant="secondary" size="sm" onClick={addKanbanTask}>Add</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Chat (for participants) */}
          {isParticipant && (
            <Card className="p-6">
              <h3 className="font-bold text-zinc-200 mb-4">Milestone Chat</h3>
              <div className="flex flex-col gap-2 min-h-[160px] max-h-[300px] overflow-y-auto mb-3 pr-1">
                {messages.length === 0 && (
                  <p className="text-xs text-zinc-500">No messages yet. Start the conversation.</p>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col gap-0.5 ${msg.senderId === userId ? "items-end" : "items-start"}`}>
                    <span className="text-xs text-zinc-500">{msg.senderName}</span>
                    <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                      msg.senderId === userId
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-800 text-zinc-200"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60"
                  placeholder="Type a message..."
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button variant="primary" size="sm" onClick={sendMessage} icon={Send}>Send</Button>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Startup Info */}
          <Card className="p-5">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-3">Posted by</h4>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={milestone.startupId?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                className="w-10 h-10 rounded-full border border-zinc-700 object-cover"
                alt=""
              />
              <div>
                <p className="font-semibold text-zinc-200 text-sm">{milestone.startupId?.companyName || milestone.startupId?.name}</p>
                <p className="text-xs text-zinc-500">{milestone.startupId?.name}</p>
              </div>
            </div>
            {milestone.startupId?.companyOverview && (
              <p className="text-xs text-zinc-400 leading-relaxed">{milestone.startupId.companyOverview}</p>
            )}
          </Card>

          {/* Assigned Developer */}
          {milestone.assignedDeveloper && (
            <Card className="p-5">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-3">Assigned Developer</h4>
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={milestone.assignedDeveloper.avatar || "https://randomuser.me/api/portraits/lego/2.jpg"}
                  className="w-10 h-10 rounded-full border border-zinc-700 object-cover"
                  alt=""
                />
                <div>
                  <p className="font-semibold text-zinc-200 text-sm">{milestone.assignedDeveloper.name}</p>
                  {milestone.assignedDeveloper.github && (
                    <a href={milestone.assignedDeveloper.github} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-emerald-400 flex items-center gap-1 hover:underline">
                      <Github size={11} /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Startup: manage milestone */}
          {isStartup && milestone.status === "in_progress" && (
            <Card className="p-5">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-3">Actions</h4>
              <Button
                variant="primary"
                className="w-full"
                onClick={async () => {
                  const rating = prompt("Rate the developer (1-5):");
                  if (!rating) return;
                  await fetch(`http://localhost:5002/api/devlaunch/milestones/${id}/complete`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ rating: parseFloat(rating) }),
                  });
                  fetchMilestone();
                }}
              >
                Mark Complete & Rate Dev
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
