import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { 
  User, 
  Rocket, 
  Layers, 
  CheckSquare, 
  Cpu, 
  Activity, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Settings, 
  Bell, 
  Flame, 
  ChevronRight, 
  Terminal, 
  FileText, 
  ExternalLink, 
  Plus, 
  Check, 
  X, 
  Search, 
  Clock, 
  Send, 
  Image as ImageIcon, 
  Paperclip, 
  Code,
  Github
} from "lucide-react";
import { toast } from "react-toastify";

// Helper to color-code status chips
const getStatusConfig = (status) => {
  switch (status) {
    case "PENDING": return { bg: "bg-zinc-800 text-zinc-400 border-zinc-700", label: "Not Started" };
    case "PR_OPEN": return { bg: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "PR Open" };
    case "UNDER_REVIEW": return { bg: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Under Review" };
    case "MERGED": return { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Merged" };
    case "REJECTED": return { bg: "bg-red-500/10 text-red-400 border-red-500/20", label: "Changes Requested" };
    default: return { bg: "bg-zinc-800 text-zinc-400 border-zinc-700", label: status };
  }
};

export default function ActiveWorkSpace({ project, token, backendUrl, userRole = "developer" }) {
  const base = backendUrl || "http://localhost:5002";
  
  // Tabs & Views
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("overview");
  
  // Milestones State
  const [milestones, setMilestones] = useState(project.state?.milestones || []);
  const [socket, setSocket] = useState(null);
  
  // Terminal logs
  const [terminalLogs, setTerminalLogs] = useState([
    `[SYSTEM] Workspace initialized. Listening for repository '${project.title}' events...`,
    `[SYSTEM] Webhook URL: ${base}/api/webhook/github`
  ]);

  // Milestone builder state
  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    description: "",
    prNumber: ""
  });
  const [loadingMilestone, setLoadingMilestone] = useState(false);

  // Mock Repository details
  const branchName = "main";
  const daysRemaining = 24;

  // Mock Commits Timeline
  const [commits, setCommits] = useState([
    {
      id: "c1",
      author: "Abhishek Chauhan",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      message: "feat: integrate Google Gemini analyzer for resumes",
      filesChanged: 4,
      additions: 124,
      deletions: 12,
      branch: "main",
      timestamp: "5m ago"
    },
    {
      id: "c2",
      author: "Test Student",
      avatar: "",
      message: "fix: resolve routing loops in dashboard roles",
      filesChanged: 2,
      additions: 45,
      deletions: 3,
      branch: "main",
      timestamp: "20m ago"
    },
    {
      id: "c3",
      author: "Test Student",
      avatar: "",
      message: "docs: update development guide and specs",
      filesChanged: 1,
      additions: 15,
      deletions: 0,
      branch: "main",
      timestamp: "1h ago"
    }
  ]);

  // Mock Pull Requests
  const [pullRequests, setPullRequests] = useState([
    {
      id: "pr-12",
      number: 12,
      title: "Integrate dashboard layout updates and role routers",
      status: "Reviewing", // Open, Reviewing, Approved, Merged
      reviewer: "Abhishek Chauhan",
      feedback: "Looks clean, ensure to test database update queries on student profiles.",
      filesChanged: 6,
      checksPassed: true,
      timestamp: "2h ago"
    }
  ]);

  // Mock Discussion Posts
  const [discussionPosts, setDiscussionPosts] = useState([
    {
      id: "dp-1",
      author: "Abhishek Chauhan",
      role: "Startup Maintainer",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "Welcome to the Fluxora live sandbox! Feel free to upload your resume, define your aspirations, and launch the first milestone PR. Let's make this microservice awesome.",
      timestamp: "Yesterday",
      attachments: []
    }
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [stagedFiles, setStagedFiles] = useState([]);
  
  // Mock AI chatbot
  const [aiChat, setAiChat] = useState([
    {
      role: "assistant",
      content: "Hello! I am your Fluxora Workspace Assistant. I am tuned to help summarize this repository, explain pull requests, or generate tests."
    }
  ]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // File Ref for discussion attaches
  const fileInputRef = useRef(null);

  // Connect socket and listen for webhooks
  useEffect(() => {
    const s = io(base);
    setSocket(s);

    s.emit("join_room", `project_${project._id}`);

    s.on("status_update", (data) => {
      setTerminalLogs(prev => [
        ...prev,
        `[GITHUB EVENT] PR #${data.prNumber} status updated to: ${data.status} at ${new Date().toLocaleTimeString()}`
      ]);
      
      // Live updates to PRs state if exists
      setPullRequests(prev => 
        prev.map(pr => 
          pr.number === data.prNumber 
            ? { ...pr, status: data.status } 
            : pr
        )
      );
    });

    s.on("milestone_update", (updatedData) => {
      setMilestones((prev) => 
        prev.map((m) => 
          m.prNumber === updatedData.prNumber 
            ? { ...m, status: updatedData.status } 
            : m
        )
      );
      setTerminalLogs(prev => [
        ...prev,
        `[SYSTEM] Live milestone status transition -> PR #${updatedData.prNumber} is now: ${updatedData.status}`
      ]);
    });

    s.on("new_discussion_post", (newPost) => {
      setDiscussionPosts(prev => {
        if (prev.some(p => p._id === newPost._id || p.id === newPost.id)) return prev;
        return [newPost, ...prev];
      });
    });

    s.on("commit_push", (newCommit) => {
      setCommits(prev => {
        if (prev.some(c => c._id === newCommit._id || c.id === newCommit.id)) return prev;
        return [newCommit, ...prev];
      });
      setTerminalLogs(prev => [
        ...prev,
        `[GITHUB EVENT] New commit pushed on \`${newCommit.branch}\`: "${newCommit.message}" (+${newCommit.additions} -${newCommit.deletions})`
      ]);
    });

    return () => {
      s.emit("leave_room", `project_${project._id}`);
      s.disconnect();
    };
  }, [project]);

  // Fetch discussions and commits on mount
  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const discRes = await fetch(`${base}/api/projectcard/workspaces/${project._id}/discussions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const discData = await discRes.json();
        if (discRes.ok && discData.success && discData.data?.length > 0) {
          setDiscussionPosts(discData.data);
        }

        const commitsRes = await fetch(`${base}/api/projectcard/workspaces/${project._id}/commits`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const commitsData = await commitsRes.json();
        if (commitsRes.ok && commitsData.success && commitsData.data?.length > 0) {
          setCommits(commitsData.data);
        }
      } catch (err) {
        console.error("Error loading workspace data:", err);
      }
    };
    fetchWorkspaceData();
  }, [project._id, base, token]);

  const handleUpdateMilestone = async (milestoneId, status, feedback = "") => {
    try {
      const res = await fetch(`${base}/api/projectcard/milestones/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify({ milestoneId, status, feedback })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        toast.success(`Milestone updated successfully!`);
        // Sync milestones state local
        setMilestones(prev => 
          prev.map(m => m.id === milestoneId || m._id === milestoneId ? { ...m, status, feedback: status === "REJECTED" ? feedback : null } : m)
        );
      } else {
        toast.error(d.message || "Failed to update milestone status.");
      }
    } catch (err) {
      toast.error("Error updating milestone state.");
    }
  };

  const handleApprove = (milestoneId) => {
    if (window.confirm("Are you sure you want to approve this milestone and merge it?")) {
      handleUpdateMilestone(milestoneId, "MERGED");
    }
  };

  const handleReject = (milestoneId) => {
    const feedback = prompt("Enter feedback comments / requested fixes for the developer:");
    if (feedback !== null) {
      handleUpdateMilestone(milestoneId, "REJECTED", feedback);
    }
  };

  // Calculate milestone progress
  const completedMilestones = milestones.filter(m => m.status === "MERGED").length;
  const progressPercent = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  // Add milestone POST request
  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!milestoneForm.title || !milestoneForm.description) return;

    setLoadingMilestone(true);
    try {
      const res = await fetch(`${base}/api/projectcard/milestones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          projectStateId: project.state.id,
          title: milestoneForm.title,
          description: milestoneForm.description,
          prNumber: milestoneForm.prNumber ? Number(milestoneForm.prNumber) : null
        })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setMilestones(prev => [...prev, d.data]);
        setMilestoneForm({ title: "", description: "", prNumber: "" });
        setTerminalLogs(prev => [
          ...prev,
          `[SYSTEM] Added new milestone: '${d.data.title}' (PR #${d.data.prNumber || 'None'})`
        ]);
        toast.success("Milestone launched successfully!");
      } else {
        toast.error(d.message || "Failed to create milestone");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating milestone.");
    } finally {
      setLoadingMilestone(false);
    }
  };

  // Add Discussion Post via Backend API
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    try {
      const res = await fetch(`${base}/api/projectcard/workspaces/${project._id}/discussions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newPostText,
          attachments: stagedFiles
        })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        if (!socket) {
          setDiscussionPosts(prev => [d.data, ...prev]);
        }
        setNewPostText("");
        setStagedFiles([]);
        toast.success("Comment posted!");
      } else {
        toast.error(d.message || "Failed to post comment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to post comment.");
    }
  };

  // Attach mock files
  const handleAttachFile = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setStagedFiles(prev => [...prev, { name: file.name, size: (file.size / 1024).toFixed(1) + " KB" }]);
    }
  };

  // Preset AI triggers
  const handleAiCommand = (commandText) => {
    setAiLoading(true);
    setAiChat(prev => [...prev, { role: "user", content: commandText }]);

    setTimeout(() => {
      let reply = "";
      if (commandText.includes("Summarize")) {
        reply = `### Repository Summary for *${project.title}*\n\nThis workspace showcases the collaboration between **Acme Startup Labs** and **Test Student** to construct high-efficiency components.\n\n* **Required Stack**: ${project.requiredSkills?.join(", ") || "React, Node.js"}\n* **Active Branch**: \`main\`\n* **Sprint Completion**: \`${progressPercent}%\` with \`${completedMilestones}/${milestones.length}\` milestones merged.`;
      } else if (commandText.includes("Maintainer Comments")) {
        reply = `### Explain Maintainer Comments\n\nMaintainer **Abhishek Chauhan** requested:\n> *"Looks clean, ensure to test database update queries on student profiles."*\n\n**Action Items**:\n1. Verify mongoose Schema paths inside \`server/models/userModel.js\`.\n2. Ensure error state headers respond with correct status codes in \`userController.js\`.\n3. Run local integration tests on \`PUT /api/user/update\`.`;
      } else if (commandText.includes("Review code")) {
        reply = `### Code Review Report\n\nAnalyzed latest commits on branch \`main\`.\n\n* **Complexity Score**: \`92/100\`\n* **Checkpoints**:\n  * ✔ Code style matches formatting specs.\n  * ◐ **Caution**: Found async handler in \`userController.js\` lacking direct try-catch safety on middleware injection.\n  * ✔ No environment secrets exposed.`;
      } else if (commandText.includes("tests")) {
        reply = `### Generated Unit Tests\n\nHere is a test suite draft for user profile database operations:\n\n\`\`\`javascript\nimport request from "supertest";\nimport app from "../index.js";\n\ndescribe("PUT /api/user/update", () => {\n  it("should update and return resume, avatar and aspiration details", async () => {\n    const res = await request(app)\n      .put("/api/user/update")\n      .set("Authorization", "Bearer mock-token")\n      .send({\n        aspiration: "Frontend Developer",\n        resume: "https://drive.google.com/resume"\n      });\n    expect(res.status).toBe(200);\n    expect(res.body.user.aspiration).toBe("Frontend Developer");\n  });\n});\n\`\`\``;
      } else {
        reply = `I've analyzed the request. Based on the active project *${project.title}*, we need to compile and test local controller operations. Let me know if you would like me to draft an implementation plan!`;
      }

      setAiChat(prev => [...prev, { role: "assistant", content: reply }]);
      setAiLoading(false);
    }, 800);
  };

  const handleAiChatSubmit = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const text = aiPrompt;
    setAiPrompt("");
    handleAiCommand(text);
  };

  // Sidebar Layout Configurations
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "tasks", label: "Tasks & Milestones", icon: CheckSquare },
    { id: "repo", label: "Repository & Code", icon: Cpu },
    { id: "deployments", label: "Deployments", icon: Activity },
    { id: "discussion", label: "Discussions", icon: Users },
    { id: "ai", label: "AI Assistant", icon: Sparkles },
    { id: "analytics", label: "Analytics Space", icon: TrendingUp },
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col font-sans relative">
      
      {/* Glow Backdrops */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* TOP NAVIGATION */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
        
        {/* Workspace Title & Live dot */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-lg">
            <Rocket size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight font-outfit text-white">
                {project.title}
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <p className="text-[10px] text-zinc-550 leading-none">Real-Time Collaborative Workspace</p>
          </div>
        </div>

        {/* Workspace Metadata */}
        <div className="hidden xl:flex items-center gap-6 text-xs text-zinc-450 border-l border-r border-zinc-800 px-6 h-full font-mono">
          <div>
            <span className="text-zinc-500">Job:</span> <span className="text-zinc-300 font-bold">{project.targetRole}</span>
          </div>
          <div>
            <span className="text-zinc-500">Repo:</span> <span className="text-zinc-300 hover:text-blue-400 transition cursor-pointer">{project.repositoryUrl ? project.repositoryUrl.split('/').pop() : "repository"}</span>
          </div>
          <div>
            <span className="text-zinc-500">Branch:</span> <span className="text-zinc-300 font-bold">git checkout \{branchName}</span>
          </div>
        </div>

        {/* Right Nav Options (Days, Badges, stacked avatars) */}
        <div className="flex items-center gap-4">
          
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-600/15 text-blue-400 border border-blue-500/20 text-[10px] font-extrabold uppercase font-mono">
              {project.stipend}
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-450 border border-zinc-700 text-[10px] font-semibold font-mono">
              {daysRemaining} Days left
            </span>
          </div>

          <button className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition relative">
            <Bell size={14} />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-600 rounded-full" />
          </button>

          {/* User & Startup stacked avatar */}
          <div className="flex items-center pl-2 border-l border-zinc-800">
            <div className="flex -space-x-2">
              <div 
                className="w-7 h-7 rounded-full bg-blue-600 border border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white"
                title="Student Intern (Developer)"
              >
                S
              </div>
              <div 
                className="w-7 h-7 rounded-full bg-emerald-600 border border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
                title="Acme Startup Labs (Maintainer)"
              >
                {project.startupId?.avatar ? (
                  <img src={project.startupId.avatar} className="w-full h-full object-cover" alt="" />
                ) : (
                  "M"
                )}
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* CORE WORKSPACE WRAPPER */}
      <div className="flex-1 flex min-h-0 relative z-10">
        
        {/* LEFT WORKSPACE SIDEBAR */}
        <aside className="w-56 shrink-0 border-r border-zinc-800 bg-zinc-900/30 flex flex-col p-4 gap-2">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-550 mb-2 pl-3">Workspace Nodes</span>
          
          <nav className="flex flex-col gap-1">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveWorkspaceTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeWorkspaceTab === item.id
                    ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <item.icon size={14} className={activeWorkspaceTab === item.id ? "text-blue-500" : ""} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Repository Health Score */}
          <div className="mt-auto p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/40">
            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 mb-1">
              <span>REPO HEALTH</span>
              <span className="text-emerald-400">98%</span>
            </div>
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[98%]" />
            </div>
            <p className="text-[9px] text-zinc-550 mt-2 font-mono leading-none">CI/CD: Passed (14s)</p>
          </div>
        </aside>

        {/* CENTRAL DISPLAY PORTAL */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW PANEL */}
          {activeWorkspaceTab === "overview" && (
            <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
              
              {/* Sprint Progress Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sprint progress meter */}
                <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col justify-between min-h-[140px]">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-450">Internship Milestones Progress</span>
                      <span className="text-xs font-extrabold text-blue-500 font-mono">{progressPercent}% Achieved</span>
                    </div>
                    
                    <h3 className="text-lg font-bold font-outfit text-white">Current Milestone Sprint</h3>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      Complete active tasks, open associated GitHub PRs, and wait for the startup maintainer's review.
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-zinc-950 h-2.5 rounded-full border border-zinc-800 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-500">
                      <span>{completedMilestones} of {milestones.length} Milestones Completed</span>
                      <span>Target Delivery: {project.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Maintainer Info box */}
                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Maintainer Guidance</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                      "Make sure auth handlers reject invalid token headers. Once tested, link PR for approval."
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/80">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" className="w-6 h-6 rounded-full border border-zinc-700" />
                    <div className="text-left">
                      <p className="text-[10px] font-bold leading-none text-zinc-300">Abhishek Chauhan</p>
                      <p className="text-[9px] text-zinc-550 mt-0.5 leading-none">Principal Maintainer</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Main Content Splitting Area */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* 2-Column: Left Side overview items */}
                <div className="xl:col-span-2 space-y-6">
                  
                  {/* Linear-style Milestones Component */}
                  <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
                    <div className="flex justify-between items-center mb-5">
                      <h4 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                        <CheckSquare size={16} className="text-blue-500" />
                        Internship Milestone Roadmap
                      </h4>
                      <button 
                        onClick={() => setActiveWorkspaceTab("tasks")} 
                        className="text-blue-500 hover:text-blue-400 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        Launch Milestone <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {milestones.map((m, idx) => {
                        const conf = getStatusConfig(m.status);
                        return (
                          <div 
                            key={m.id || idx}
                            className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 transition flex flex-col justify-between min-h-[140px]"
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Milestone {idx + 1}</span>
                                <div className="flex items-center gap-1.5 font-mono">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${conf.bg}`}>
                                    {conf.label}
                                  </span>
                                  {userRole === "startup" && (m.status === "UNDER_REVIEW" || m.status === "PR_OPEN" || m.status === "PENDING") && (
                                    <div className="flex gap-1 shrink-0">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleApprove(m.id || m._id); }}
                                        className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                                        title="Approve Milestone"
                                      >
                                        <Check size={10} />
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleReject(m.id || m._id); }}
                                        className="p-1 border border-zinc-800 bg-zinc-900 hover:bg-red-950 hover:text-red-400 text-zinc-400 rounded transition-all"
                                        title="Request Fixes"
                                      >
                                        <X size={10} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <h5 className="text-xs font-extrabold text-white leading-tight">{m.title}</h5>
                              <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{m.description}</p>
                            </div>

                            {/* Linear-style mini checklists */}
                            <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✔ Database</span>
                                <span className="text-emerald-400">✔ API</span>
                                <span className="text-zinc-550">○ Tests</span>
                              </div>
                              {m.prNumber && (
                                <a 
                                  href={`https://github.com/fluxora/repo/pull/${m.prNumber}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-500 hover:underline flex items-center gap-0.5"
                                >
                                  PR #{m.prNumber}
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Open Pull Request list */}
                  <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
                    <h4 className="text-sm font-bold tracking-tight text-white mb-4 flex items-center gap-1.5">
                      <Cpu size={16} className="text-blue-500" />
                      Active Pull Requests & Code Checks
                    </h4>

                    <div className="space-y-3">
                      {pullRequests.map(pr => (
                        <div key={pr.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">PR #{pr.number}: {pr.title}</span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                                {pr.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-500">
                              Reviewer: <span className="text-zinc-300 font-semibold">{pr.reviewer}</span> • {pr.timestamp}
                            </p>
                            {pr.feedback && (
                              <p className="text-[10px] text-zinc-550 bg-zinc-900/60 p-2 rounded border border-zinc-850 mt-2 font-mono">
                                <span className="text-amber-500 font-bold">Feedback:</span> {pr.feedback}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                            <span className="text-zinc-550 font-bold">+{pr.filesChanged} Files</span>
                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[9px] font-bold">
                              ✔ CHECKS PASSED
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Latest GitHub Commits timeline */}
                  <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
                    <h4 className="text-sm font-bold tracking-tight text-white mb-4 flex items-center gap-1.5">
                      <Activity size={16} className="text-blue-500" />
                      Live Commit Timeline
                    </h4>

                    <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800 pl-7">
                      {commits.map(commit => (
                        <div key={commit.id || commit._id} className="relative text-left group">
                          {/* Timeline dot */}
                          <div className="absolute -left-[33px] top-1 p-0.5 rounded-full bg-zinc-950 border border-zinc-800 group-hover:border-blue-500 transition-colors">
                            <div className="w-1.5 h-1.5 bg-zinc-550 group-hover:bg-blue-500 rounded-full" />
                          </div>

                          <div className="p-3.5 rounded-xl border border-zinc-850 bg-zinc-950/40 group-hover:border-zinc-800 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-zinc-250 font-mono leading-tight">{commit.message}</p>
                              <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                <span className="font-semibold text-zinc-400">{commit.author}</span>
                                <span>•</span>
                                <span>branch: \{commit.branch}</span>
                                <span>•</span>
                                <span>{commit.timestamp}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-[9px] font-mono shrink-0">
                              <span className="text-green-500 font-bold">+{commit.additions}</span>
                              <span className="text-red-500 font-bold">-{commit.deletions}</span>
                              <span className="text-zinc-500 font-semibold">({commit.filesChanged} files)</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: statistics & webhook live box */}
                <div className="space-y-6">
                  
                  {/* Leaderboard / Contributor scores */}
                  <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                      <Flame className="text-orange-500 animate-pulse" size={14} />
                      Contributor Dashboard Statistics
                    </h4>

                    <div className="space-y-4 text-xs font-mono">
                      
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40">
                          <p className="text-[10px] text-zinc-500">COMMITS</p>
                          <p className="text-lg font-bold text-white mt-1">24</p>
                        </div>
                        <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40">
                          <p className="text-[10px] text-zinc-500">PULL REQUESTS</p>
                          <p className="text-lg font-bold text-white mt-1">4</p>
                        </div>
                        <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40">
                          <p className="text-[10px] text-zinc-500">QUALITY SCORE</p>
                          <p className="text-lg font-bold text-emerald-400 mt-1">98/100</p>
                        </div>
                        <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40">
                          <p className="text-[10px] text-zinc-500">VELOCITY</p>
                          <p className="text-lg font-bold text-blue-400 mt-1">92%</p>
                        </div>
                      </div>

                      {/* Code Coverage Summary */}
                      <div className="border-t border-zinc-800/80 pt-4 space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-zinc-500">TEST CODE COVERAGE</span>
                          <span className="text-zinc-300 font-bold">84.2%</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-1.5 border border-zinc-850 rounded-full overflow-hidden">
                          <div className="bg-blue-650 h-full w-[84%]" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] pt-1">
                        <span className="text-zinc-500">CONSISTENCY SCORE</span>
                        <span className="text-green-400 font-bold">HIGH</span>
                      </div>

                    </div>
                  </div>

                  {/* Webhook logs live terminal box */}
                  <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 font-mono text-[11px] flex flex-col h-[280px]">
                    <div className="flex items-center gap-2 mb-3 text-zinc-400 pb-2 border-b border-zinc-850">
                      <Terminal size={14} className="text-emerald-500" />
                      <span className="font-bold text-zinc-300">GITHUB WEBHOOK TERMINAL ENGINE</span>
                      <span className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 text-zinc-400 scrollbar-thin">
                      {terminalLogs.map((log, idx) => (
                        <div key={idx} className="leading-relaxed">
                          <span className="text-emerald-500">&gt;</span> {log}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Discussion entry */}
                  <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Quick Discussion</h4>
                    <button 
                      onClick={() => setActiveWorkspaceTab("discussion")}
                      className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      Open Integrated Discussions
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: TASKS & MILESTONES FORM */}
          {activeWorkspaceTab === "tasks" && (
            <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Milestone Stepper Checklists */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
                    <h3 className="text-lg font-bold font-outfit text-white mb-4">Milestone Roadmap Steppers</h3>
                    <p className="text-xs text-zinc-500 mb-6">Launch individual project sprints. Link PR numbers to auto-listen for state checks.</p>

                    <div className="space-y-4">
                      {milestones.map((m, idx) => {
                        const conf = getStatusConfig(m.status);
                        return (
                          <div key={m.id || idx} className="p-5 rounded-xl border border-zinc-850 bg-zinc-950/40 flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2 max-w-xl">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-extrabold text-white">{m.title}</h4>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${conf.bg} font-mono`}>
                                  {conf.label}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-500 leading-relaxed">{m.description}</p>
                              
                              <div className="flex gap-4 text-[10px] font-mono text-zinc-400 pt-2">
                                <label className="flex items-center gap-1.5">
                                  <input type="checkbox" checked={m.status === "MERGED" || m.status === "UNDER_REVIEW"} readOnly className="rounded border-zinc-800 bg-zinc-900 text-blue-600 focus:ring-0 w-3.5 h-3.5" />
                                  <span>Setup Database Schemas</span>
                                </label>
                                <label className="flex items-center gap-1.5">
                                  <input type="checkbox" checked={m.status === "MERGED"} readOnly className="rounded border-zinc-800 bg-zinc-900 text-blue-600 focus:ring-0 w-3.5 h-3.5" />
                                  <span>API Controllers & Middleware</span>
                                </label>
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-between shrink-0 text-right">
                              <span className="text-[10px] text-zinc-550 font-mono">Linked PR: #{m.prNumber || "None"}</span>
                              {userRole === "startup" && (m.status === "UNDER_REVIEW" || m.status === "PR_OPEN" || m.status === "PENDING") ? (
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => handleApprove(m.id || m._id)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                                    title="Approve Milestone"
                                  >
                                    <Check size={10} /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(m.id || m._id)}
                                    className="px-2.5 py-1 border border-zinc-800 bg-zinc-950 hover:bg-red-950 hover:text-red-400 text-zinc-400 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                                    title="Request Fixes"
                                  >
                                    <X size={10} /> Reject
                                  </button>
                                </div>
                              ) : (
                                m.status === "REJECTED" && m.feedback && (
                                  <span className="text-[10px] text-red-400 mt-2 font-mono">Required Fixes: {m.feedback}</span>
                                )
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* Add Milestone Form */}
                <div className={`p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col justify-between h-fit`}>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Add Project Milestone</h4>
                    
                    <form onSubmit={handleAddMilestone} className="space-y-4 text-xs">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-zinc-500 uppercase">Milestone Title</label>
                        <input 
                          value={milestoneForm.title}
                          onChange={e => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                          placeholder="e.g. Integrate user avatar uploads"
                          className={`p-2.5 rounded-lg border bg-zinc-950 border-zinc-800 text-white`}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-zinc-500 uppercase">Linked PR Number</label>
                        <input 
                          type="number"
                          value={milestoneForm.prNumber}
                          onChange={e => setMilestoneForm({ ...milestoneForm, prNumber: e.target.value })}
                          placeholder="e.g. 14"
                          className={`p-2.5 rounded-lg border bg-zinc-950 border-zinc-800 text-white`}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-zinc-500 uppercase">Milestone Description</label>
                        <textarea 
                          value={milestoneForm.description}
                          onChange={e => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                          placeholder="Provide details about delivery scope and endpoints..."
                          rows="3"
                          className={`p-2.5 rounded-lg border bg-zinc-950 border-zinc-800 text-white resize-none`}
                          required
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={loadingMilestone}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
                      >
                        {loadingMilestone ? "Launching..." : "Launch Milestone"}
                      </button>
                    </form>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: REPOSITORY & CODE */}
          {activeWorkspaceTab === "repo" && (
            <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-200 font-mono text-xs text-zinc-400">
              
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Repository Insights</h3>
                    <p className="text-[10px] text-zinc-500 mt-1">Branch properties and files map</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                    <span className="text-zinc-300">branch: \{branchName}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-zinc-850 bg-zinc-950/40 flex justify-between items-center">
                    <span>Repository Url</span>
                    <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{project.repositoryUrl}</a>
                  </div>
                  <div className="p-3.5 rounded-xl border border-zinc-850 bg-zinc-950/40 flex justify-between items-center">
                    <span>Active Branches</span>
                    <span>main, feature/auth, dev-dashboard</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-zinc-850 bg-zinc-950/40 flex justify-between items-center">
                    <span>Latest Commit Hash</span>
                    <span>4d8f1e69b22a0134f596b86e8893d9a1</span>
                  </div>
                </div>
              </div>

              {/* PR review card logs */}
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Review Board</h4>
                
                {pullRequests.map(pr => (
                  <div key={pr.id} className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/20 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-white">PR #{pr.number}: {pr.title}</span>
                        <p className="text-[10px] text-zinc-550 mt-1">Review status: {pr.status}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                        Checks Passed
                      </span>
                    </div>

                    <div className="border-t border-zinc-850 pt-3">
                      <p className="text-[10px] text-zinc-500">Review Comments:</p>
                      <p className="text-xs text-zinc-300 italic bg-zinc-900/40 p-3 rounded-lg border border-zinc-850/80 mt-1">
                        "{pr.feedback}"
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-1">
                      <span>Files changed: {pr.filesChanged}</span>
                      <span>Reviewer: {pr.reviewer}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: DEPLOYMENTS */}
          {activeWorkspaceTab === "deployments" && (
            <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
              
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold font-outfit text-white">Vercel & Pipeline Deployments</h3>
                    <p className="text-xs text-zinc-500">Latest pipeline logs and target production URLs</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/20 font-mono">
                    PRODUCTION LIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/40 space-y-3">
                    <p className="text-xs font-bold text-white font-mono">Deployment Link</p>
                    <a 
                      href="https://fluxora-deployment-production.vercel.app" 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs text-blue-500 hover:underline flex items-center gap-1 font-mono"
                    >
                      https://fluxora-deployment-production.vercel.app <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/40 space-y-2">
                    <p className="text-xs font-bold text-white font-mono">Deployment Metadata</p>
                    <div className="space-y-1 text-[10px] text-zinc-500 font-mono">
                      <p>Status: <span className="text-emerald-400 font-semibold">Active Success</span></p>
                      <p>Age: 12 minutes ago</p>
                      <p>Environment: Production</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: INTEGRATED DISCUSSION */}
          {activeWorkspaceTab === "discussion" && (
            <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
              
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-outfit text-white">Integrated Discussion Board</h3>
                  <p className="text-xs text-zinc-500 mt-1">Review feedback, attach mock screen uploads, and comment on code blocks.</p>
                </div>

                {/* Input box */}
                <form onSubmit={handleAddPost} className="space-y-3">
                  <div className="border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden focus-within:border-zinc-700 transition">
                    <textarea 
                      value={newPostText}
                      onChange={e => setNewPostText(e.target.value)}
                      placeholder="Write comment (supports markdown / code snippets)..."
                      rows="3"
                      className="w-full p-3.5 bg-transparent border-0 outline-none text-xs text-white placeholder:text-zinc-650 resize-none"
                    />

                    {/* Attachment preview */}
                    {stagedFiles.length > 0 && (
                      <div className="px-3 pb-2.5 flex flex-wrap gap-2">
                        {stagedFiles.map((f, i) => (
                          <span key={i} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-400 font-mono">
                            📎 {f.name} ({f.size})
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="h-10 bg-zinc-900/60 border-t border-zinc-850 px-3 flex items-center justify-between text-zinc-400">
                      <div className="flex items-center gap-3">
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current.click()}
                          className="hover:text-white transition" 
                          title="Attach Mock File"
                        >
                          <Paperclip size={14} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setNewPostText(prev => prev + "\n```javascript\n\n```")}
                          className="hover:text-white transition" 
                          title="Insert Code Snippet"
                        >
                          <Code size={14} />
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleAttachFile} 
                          className="hidden" 
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                      >
                        <Send size={10} /> Send comment
                      </button>
                    </div>
                  </div>
                </form>

                {/* Posts timeline */}
                <div className="space-y-4">
                  {discussionPosts.map(post => (
                    <div key={post.id || post._id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 flex gap-4 text-xs items-start">
                      
                      <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300">
                        {post.avatar ? (
                          <img src={post.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          post.author.charAt(0)
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{post.author}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-500 font-bold">{post.role}</span>
                          <span className="text-[10px] text-zinc-550 font-mono ml-auto">{post.timestamp}</span>
                        </div>

                        <p className="text-zinc-350 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                        {/* Attachments preview */}
                        {post.attachments && post.attachments.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-2">
                            {post.attachments.map((file, index) => (
                              <span key={index} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-400 font-mono">
                                📎 {file.name} ({file.size})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: AI ASSISTANT PANEL */}
          {activeWorkspaceTab === "ai" && (
            <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
              
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-6 flex flex-col h-[600px] justify-between">
                
                <div>
                  <h3 className="text-lg font-bold font-outfit text-white">Workspace AI Assistant</h3>
                  <p className="text-xs text-zinc-500 mt-1">Request repository summaries, explain comments, generate implementation plans or run code checks.</p>
                </div>

                {/* Preset shortcuts */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <button 
                    onClick={() => handleAiCommand("Summarize Repo")}
                    className="px-3 py-1.5 border border-zinc-800 bg-zinc-950/60 text-zinc-300 rounded-xl hover:border-zinc-700 transition"
                  >
                    Summarize Repo
                  </button>
                  <button 
                    onClick={() => handleAiCommand("Explain Maintainer Comments")}
                    className="px-3 py-1.5 border border-zinc-800 bg-zinc-950/60 text-zinc-300 rounded-xl hover:border-zinc-700 transition"
                  >
                    Explain Comments
                  </button>
                  <button 
                    onClick={() => handleAiCommand("Review code")}
                    className="px-3 py-1.5 border border-zinc-800 bg-zinc-950/60 text-zinc-300 rounded-xl hover:border-zinc-700 transition"
                  >
                    Review Code
                  </button>
                  <button 
                    onClick={() => handleAiCommand("Generate unit tests")}
                    className="px-3 py-1.5 border border-zinc-800 bg-zinc-950/60 text-zinc-300 rounded-xl hover:border-zinc-700 transition"
                  >
                    Generate Tests
                  </button>
                </div>

                {/* Chat Dialog box */}
                <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl border border-zinc-850 bg-zinc-950/60 text-xs">
                  {aiChat.map((chat, idx) => (
                    <div key={idx} className={`flex gap-3 items-start ${chat.role === "user" ? "justify-end text-right" : "text-left"}`}>
                      {chat.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full bg-blue-600/10 border border-blue-650/20 text-blue-500 flex items-center justify-center font-bold text-[9px] shrink-0">
                          AI
                        </div>
                      )}
                      <div className={`p-3.5 rounded-2xl max-w-xl leading-relaxed whitespace-pre-wrap ${
                        chat.role === "user" 
                          ? "bg-blue-600 text-white rounded-tr-none text-left" 
                          : "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none font-mono"
                      }`}>
                        {chat.content}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex gap-2 items-center text-zinc-500">
                      <span className="animate-pulse w-1.5 h-1.5 bg-zinc-550 rounded-full" />
                      <span className="animate-pulse w-1.5 h-1.5 bg-zinc-550 rounded-full" />
                      <span className="animate-pulse w-1.5 h-1.5 bg-zinc-550 rounded-full" />
                      <span>AI Reviewing codebase...</span>
                    </div>
                  )}
                </div>

                {/* Query Input */}
                <form onSubmit={handleAiChatSubmit} className="flex gap-2">
                  <input 
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Ask assistant to generate implementation plan or tests..."
                    className="flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-zinc-700 transition"
                  />
                  <button 
                    type="submit" 
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                  >
                    <Send size={14} />
                  </button>
                </form>

              </div>

            </div>
          )}

          {/* TAB 7: ANALYTICS SPACE (Heatmap) */}
          {activeWorkspaceTab === "analytics" && (
            <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
              
              {/* Scorecard grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-2">
                  <span className="text-[10px] text-zinc-550 uppercase tracking-wider font-bold">Contribution Score</span>
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-extrabold text-white">194</p>
                    <span className="text-emerald-400 text-xs font-mono font-bold">+18% this week</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-2">
                  <span className="text-[10px] text-zinc-550 uppercase tracking-wider font-bold">Commit Consistency</span>
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-extrabold text-white">4.8d/wk</p>
                    <span className="text-blue-400 text-xs font-mono font-bold">Streak: 4w</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-2">
                  <span className="text-[10px] text-zinc-550 uppercase tracking-wider font-bold">PR Velocity</span>
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-extrabold text-white">1.8 days</p>
                    <span className="text-emerald-400 text-xs font-mono font-bold">Fast Approval</span>
                  </div>
                </div>

              </div>

              {/* GitHub contribution style activity heatmap grid */}
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-350">Workspace Activity Heatmap</h4>
                  <p className="text-xs text-zinc-500 mt-1">Consistency grid representing push/commits frequency over sprint period</p>
                </div>

                <div className="flex gap-1.5 overflow-x-auto py-2">
                  {/* Grid layout of 7 columns, each representing days in week */}
                  <div className="grid grid-flow-col grid-rows-7 gap-1">
                    {/* Render a mock grid of 7x20 blocks */}
                    {Array.from({ length: 140 }).map((_, idx) => {
                      // Alternate intensity classes based on pseudo-random function
                      const intensities = [
                        "bg-zinc-900 border border-zinc-950",
                        "bg-emerald-950 border border-zinc-950",
                        "bg-emerald-900 border border-zinc-950",
                        "bg-emerald-700 border border-zinc-950",
                        "bg-emerald-500 border border-zinc-950"
                      ];
                      const intensity = intensities[Math.floor(Math.sin(idx * 45) * 2.5 + 2.5)];
                      return (
                        <div 
                          key={idx} 
                          className={`w-3.5 h-3.5 rounded-sm transition hover:scale-105 cursor-pointer ${intensity}`} 
                          title={`Contributions logged: ${Math.floor(Math.sin(idx) * 4 + 4)}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 justify-end text-[10px] font-mono text-zinc-550">
                  <span>Less</span>
                  <span className="w-3 h-3 bg-zinc-900 rounded-sm" />
                  <span className="w-3 h-3 bg-emerald-950 rounded-sm" />
                  <span className="w-3 h-3 bg-emerald-900 rounded-sm" />
                  <span className="w-3 h-3 bg-emerald-700 rounded-sm" />
                  <span className="w-3 h-3 bg-emerald-500 rounded-sm" />
                  <span>More</span>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
