import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import ActiveWorkSpace from "../components/ActiveWorkSpace";
import { Check, X, Terminal, ArrowLeft, Cpu } from "lucide-react";
import { toast } from "react-toastify";

export default function ActiveWorkspaces({ workspaces, backendUrl, token, refreshData }) {
  const base = backendUrl || "http://localhost:5002";
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [socket, setSocket] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState([]);

  const selectedWs = workspaces.find(w => w._id === selectedWorkspaceId);

  useEffect(() => {
    if (!selectedWs) return;

    // Load milestones from workspace state
    setMilestones(selectedWs.state?.milestones || []);
    setTerminalLogs([
      `[SYSTEM] Webhook engine online. Listening for '${selectedWs.title}' pull requests...`,
      `[SYSTEM] Local endpoint: ${base}/api/webhook/github`
    ]);

    // Connect socket and join project room
    const s = io(base, { transports: ["websocket"] });
    setSocket(s);

    s.emit("join_room", `project_${selectedWs._id}`);

    s.on("status_update", (data) => {
      setTerminalLogs(prev => [
        ...prev,
        `[GITHUB WEBHOOK] PR #${data.prNumber} transitions to: ${data.status} at ${new Date().toLocaleTimeString()}`
      ]);
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
        `[SYSTEM] Stepper synchronization completed -> PR #${updatedData.prNumber} is: ${updatedData.status}`
      ]);
    });

    return () => {
      s.emit("leave_room", `project_${selectedWs._id}`);
      s.disconnect();
    };
  }, [selectedWs]);

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
          prev.map(m => m.id === milestoneId ? { ...m, status, feedback: status === "REJECTED" ? feedback : null } : m)
        );
        if (refreshData) refreshData();
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

  if (selectedWs) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <button
          onClick={() => setSelectedWorkspaceId(null)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors py-1.5 px-3 border border-zinc-800 bg-zinc-900/40 rounded-xl font-semibold"
        >
          <ArrowLeft size={14} /> Back to Workspaces
        </button>
        <ActiveWorkSpace
          project={selectedWs}
          token={token}
          backendUrl={base}
          userRole="startup"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-bold font-outfit text-zinc-50">Active Developer Workspaces</h3>
        <p className="text-xs text-zinc-550 mt-1">Review active collaborations and live milestone steppers linked via GitHub webhooks.</p>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-2xl bg-zinc-955">
          <Cpu size={24} className="mx-auto mb-2 text-zinc-700" />
          No active developer collaborations found. Approve a candidate from the Talent Pipeline to launch a workspace.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workspaces.map((work) => {
            const status = work.state?.lifecycleStatus || "ACTIVE_WORK";
            return (
              <Card
                key={work._id}
                onClick={() => setSelectedWorkspaceId(work._id)}
                className="p-6 bg-zinc-900 border-zinc-800 flex flex-col justify-between min-h-[200px] cursor-pointer hover:border-emerald-500/60 transition-all hover:scale-[1.01] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                
                <div className="pl-2 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-zinc-150 text-base font-outfit">{work.title}</h4>
                      <p className="text-[11px] font-mono text-zinc-500 mt-1 block max-w-[250px] truncate">{work.repositoryUrl}</p>
                    </div>
                    <span className="text-[9px] px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold uppercase tracking-wider">
                      {status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{work.description}</p>
                </div>

                <div className="pl-2 flex items-center justify-between mt-4 pt-4 border-t border-zinc-850/60 text-[10px] text-zinc-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Listening for Webhook events</span>
                  </div>
                  <span className="font-semibold text-emerald-400 hover:underline">Open Workspace &gt;</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
