import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Bell, Sparkles } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

// Dashboard Components
import DashboardSidebar from "./components/DashboardSidebar";
import StatOverview from "./components/StatOverview";
import ApplicationsTable from "./components/ApplicationsTable";
import ActiveWorkspaces from "./components/ActiveWorkspaces";

export default function StartupDashboard() {
  const navigate = useNavigate();
  const { backendUrl, userData, isLoggedIn, setIsLoggedIn, setUserData } = useContext(AppContext);
  const base = backendUrl || "http://localhost:5002";
  const token = localStorage.getItem("token");

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");

  // Data States
  const [applications, setApplications] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
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
  }, [userData, isLoggedIn]);

  const fetchDashboardData = async () => {
    if (!token && !isLoggedIn) return;
    setLoading(true);
    try {
      // 1. Fetch startup candidate applications
      const appRes = await fetch(`${base}/api/applications/startup/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      const appData = await appRes.json();
      if (appRes.ok && appData.success) {
        setApplications(appData.data || []);
      }

      // 2. Fetch startup active workspaces
      const workRes = await fetch(`${base}/api/projectcard/startup/workspaces`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      const workData = await workRes.json();
      if (workRes.ok && workData.success) {
        setWorkspaces(workData.data || []);
      }

      // 3. Fetch all project cards to get counts of active jobs owned by the startup
      const allRes = await fetch(`${base}/api/projectcard/all`);
      const allData = await allRes.json();
      if (allRes.ok && allData.success) {
        const owned = (allData.data || []).filter(
          proj => proj.startupId?._id === userData?._id || proj.startupId === userData?._id
        );
        setProjectsCount(owned.length);
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

  const handleAcceptApplication = async (applicationId) => {
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
        toast.success("Candidate application approved successfully!");
        fetchDashboardData();
      } else {
        toast.error(d.message || "Failed to approve application.");
      }
    } catch (error) {
      toast.error("Error approving candidate.");
    }
  };

  const handleRejectApplication = async (applicationId) => {
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
        toast.info("Candidate application rejected.");
        fetchDashboardData();
      } else {
        toast.error(d.message || "Failed to reject application.");
      }
    } catch (error) {
      toast.error("Error rejecting candidate.");
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

  const pendingCount = applications.filter(a => a.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex relative z-10 font-inter">
      {/* Side blurred glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Sidebar Panel */}
      <DashboardSidebar
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
            <p className="text-[10px] text-zinc-500">Configure recruitment channels and monitor live webhooks</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-300 relative">
              <Bell size={18} />
              {pendingCount > 0 && (
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

        {/* Dynamic Inner views */}
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Stat cards grid */}
              <StatOverview
                activeJobsCount={projectsCount}
                pendingReviewsCount={pendingCount}
                activeWorkspacesCount={workspaces.length}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Scoreboard table */}
                <div className="lg:col-span-2">
                  <ApplicationsTable
                    applications={applications.slice(0, 5)}
                    onAccept={handleAcceptApplication}
                    onReject={handleRejectApplication}
                  />
                </div>

                {/* Chat message overview card or prompt */}
                <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-2xl flex flex-col justify-between min-h-[280px]">
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block mb-1">Matching Insights</span>
                    <h4 className="text-base font-bold text-zinc-150 font-outfit mt-1">Platform Recommendations</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                      Our automated technical recruiting engine matches student repositories against job requirements. Use the Scoreboard to review detailed candidate assessments.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 mt-4 text-[11px] leading-relaxed text-zinc-500">
                    💡 <span className="font-semibold text-zinc-400">Pro-Tip:</span> Accept candidates to immediately provision live GitHub webhook tracking terminals.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "scoreboard" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <ApplicationsTable
                applications={applications}
                onAccept={handleAcceptApplication}
                onReject={handleRejectApplication}
              />
            </div>
          )}

          {activeTab === "workspaces" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <ActiveWorkspaces workspaces={workspaces} />
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
