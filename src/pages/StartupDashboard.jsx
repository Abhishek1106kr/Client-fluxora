import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Bell } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

// Views & Components
import StartupSidebar from "../components/StartupSidebar";
import Overview from "../views/Overview";
import ManagePostings from "../views/ManagePostings";
import ManageProjectPostings from "../views/ManageProjectPostings";
import TalentPipeline from "../views/TalentPipeline";
import ActiveWorkspaces from "../views/ActiveWorkspaces";

export default function StartupDashboard() {
  const navigate = useNavigate();
  const { backendUrl, userData, isLoggedIn, setIsLoggedIn, setUserData } = useContext(AppContext);
  const base = backendUrl || "http://localhost:5002";
  const token = localStorage.getItem("token");

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");

  // Data States
  const [applications, setApplications] = useState([]);
  const [projectApplications, setProjectApplications] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [workspacesCount, setWorkspacesCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Authenticate user
  useEffect(() => {
    if (!isLoggedIn && !token) {
      navigate("/startupLogin");
      return;
    }
    if (userData && userData.role !== "startup") {
      navigate("/mainpage");
      return;
    }
  }, [userData, isLoggedIn, token]);

  const fetchDashboardData = async () => {
    if (!token && !isLoggedIn) return;
    setLoading(true);
    try {
      // 1. Fetch startup job applications
      const appRes = await fetch(`${base}/api/applications/startup/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      const appData = await appRes.json();
      if (appRes.ok && appData.success) {
        setApplications(appData.data || []);
      }

      // 2. Fetch startup project applications
      const projAppRes = await fetch(`${base}/api/projectcard/startup/applications`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      const projAppData = await projAppRes.json();
      if (projAppRes.ok && projAppData.success) {
        setProjectApplications(projAppData.data || []);
      }

      // 3. Fetch startup active workspaces
      const workRes = await fetch(`${base}/api/projectcard/startup/workspaces`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      const workData = await workRes.json();
      if (workRes.ok && workData.success) {
        if (!workData.data || workData.data.length === 0) {
          const demoWorkspace = {
            _id: "demo-workspace-123",
            title: "AI-Powered Technical Resume Reviewer",
            description: "Implement an interactive, AI-driven platform that automatically parses developer resumes, scores them against target jobs, and offers tailored suggestions using the Gemini API.",
            stipend: "$2000 / Month",
            duration: "10 Weeks",
            repositoryUrl: "https://github.com/fluxora/ai-resume-optimizer",
            state: {
              id: "demo-state-123",
              lifecycleStatus: "ACTIVE_WORK",
              currentMilestone: 1,
              milestones: [
                {
                  id: "m1",
                  title: "Backend API Setup",
                  description: "Initialize Express, connect mongoose database models, and write mock endpoints.",
                  status: "MERGED",
                  prNumber: 1
                },
                {
                  id: "m2",
                  title: "Gemini Integration",
                  description: "Integrate Google Gen AI SDK and construct evaluation system prompts.",
                  status: "UNDER_REVIEW",
                  prNumber: 2
                },
                {
                  id: "m3",
                  title: "Resume File Parser",
                  description: "Write resume text extraction service from pdf and docx files.",
                  status: "PENDING",
                  prNumber: null
                }
              ]
            },
            startupId: {
              companyName: "Acme Startup Labs",
              avatar: "https://randomuser.me/api/portraits/lego/2.jpg"
            }
          };
          setWorkspaces([demoWorkspace]);
          setWorkspacesCount(1);
        } else {
          setWorkspaces(workData.data);
          setWorkspacesCount(workData.data.length);
        }
      }

      // 4. Fetch jobs from DB to count posted jobs
      const jobsRes = await fetch(`${base}/api/jobs/startup/mine`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      const jobsData = await jobsRes.json();
      if (jobsRes.ok && jobsData.success) {
        setJobsCount((jobsData.data || []).length);
      }

      // 5. Fetch projects from DB to count posted projects
      const projsRes = await fetch(`${base}/api/projectcard/startup/mine`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      const projsData = await projsRes.json();
      if (projsRes.ok && projsData.success) {
        setProjectsCount((projsData.data || []).length);
      }

    } catch (error) {
      console.error("Error loading startup dashboard details:", error);
      toast.error("Could not fetch dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchDashboardData();
    }
  }, [userData]);

  const handleAcceptJobApplication = async (applicationId) => {
    try {
      const res = await fetch(`${base}/api/applications/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify({ applicationId, status: "ACCEPTED" })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        toast.success("Job candidate approved successfully!");
        fetchDashboardData();
      } else {
        toast.error(d.message || "Failed to approve candidate.");
      }
    } catch (error) {
      toast.error("Error approving job candidate.");
    }
  };

  const handleRejectJobApplication = async (applicationId) => {
    try {
      const res = await fetch(`${base}/api/applications/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify({ applicationId, status: "REJECTED" })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        toast.info("Job candidate declined.");
        fetchDashboardData();
      } else {
        toast.error(d.message || "Failed to decline candidate.");
      }
    } catch (error) {
      toast.error("Error declining candidate.");
    }
  };

  const handleAcceptProjectApplication = async (applicationId) => {
    try {
      const res = await fetch(`${base}/api/projectcard/application/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify({ applicationId, status: "accepted" })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        toast.success("Project candidate approved successfully!");
        fetchDashboardData();
      } else {
        toast.error(d.message || "Failed to approve project application.");
      }
    } catch (error) {
      toast.error("Error approving project application.");
    }
  };

  const handleRejectProjectApplication = async (applicationId) => {
    try {
      const res = await fetch(`${base}/api/projectcard/application/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify({ applicationId, status: "rejected" })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        toast.info("Project candidate declined.");
        fetchDashboardData();
      } else {
        toast.error(d.message || "Failed to decline project application.");
      }
    } catch (error) {
      toast.error("Error declining project application.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUserData(null);
    toast.success("Logged out successfully");
    navigate("/startupLogin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  const pendingJobsCount = applications.filter(a => a.status === "PENDING").length;
  const pendingProjsCount = projectApplications.filter(a => a.status === "PENDING").length;
  const totalPending = pendingJobsCount + pendingProjsCount;

  return (
    <div className="min-h-screen bg-zinc-955 text-zinc-100 flex relative z-10 font-inter">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Sidebar Panel */}
      <StartupSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        startupName={userData?.companyName || userData?.name}
        startupEmail={userData?.email}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        
        {/* Header bar */}
        <header className="h-[72px] border-b border-zinc-800/80 flex items-center justify-between px-8 bg-zinc-950/60 backdrop-blur-md sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-bold font-outfit text-zinc-50">Startup Partner Space</h2>
            <p className="text-[10px] text-zinc-500">Configure postings and review candidate pipelines</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-300 relative">
              <Bell size={18} />
              {totalPending > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800">
              <div className="w-9 h-9 rounded-full bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                {(userData?.companyName || userData?.name || "S").charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold leading-none text-zinc-200">{userData?.companyName || userData?.name}</p>
                <p className="text-[9px] text-zinc-500 mt-1 leading-none">Representative Account</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Views */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === "overview" && (
            <Overview
              projectsCount={jobsCount + projectsCount}
              pendingCount={totalPending}
              workspacesCount={workspacesCount}
              startupName={userData?.companyName || userData?.name}
            />
          )}

          {activeTab === "postings" && (
            <ManagePostings
              backendUrl={base}
              token={token}
            />
          )}

          {activeTab === "projects" && (
            <ManageProjectPostings
              backendUrl={base}
              token={token}
            />
          )}

          {activeTab === "workspaces" && (
            <ActiveWorkspaces
              workspaces={workspaces}
              backendUrl={base}
              token={token}
              refreshData={fetchDashboardData}
            />
          )}

          {activeTab === "pipeline" && (
            <TalentPipeline
              jobApplications={applications}
              projectApplications={projectApplications}
              onAcceptJob={handleAcceptJobApplication}
              onRejectJob={handleRejectJobApplication}
              onAcceptProject={handleAcceptProjectApplication}
              onRejectProject={handleRejectProjectApplication}
            />
          )}
        </main>

      </div>
    </div>
  );
}
