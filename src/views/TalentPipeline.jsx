import React, { useState } from "react";
import Card from "../components/ui/Card";
import { Check, X, ShieldAlert, CheckCircle2, ChevronRight, Briefcase, FileCode } from "lucide-react";

export default function TalentPipeline({ 
  jobApplications, 
  projectApplications, 
  onAcceptJob, 
  onRejectJob, 
  onAcceptProject, 
  onRejectProject 
}) {
  // Subtab State: "jobs" or "projects"
  const [subTab, setSubTab] = useState("jobs");
  const [selectedAppId, setSelectedAppId] = useState(null);

  // Active Applications set
  const activeApps = subTab === "jobs" ? (jobApplications || []) : (projectApplications || []);
  const onAccept = subTab === "jobs" ? onAcceptJob : onAcceptProject;
  const onReject = subTab === "jobs" ? onRejectJob : onRejectProject;

  const selectedApp = activeApps.find(a => a.id === selectedAppId);

  // Reset selected app when sub-tab changes
  const handleTabChange = (tab) => {
    setSubTab(tab);
    setSelectedAppId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-outfit text-zinc-50">Talent Pipeline</h3>
          <p className="text-xs text-zinc-550 mt-1">Review candidates ranked automatically by Gemini AI profile alignment scoring.</p>
        </div>

        {/* Sub-tab selection selectors */}
        <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
          <button
            onClick={() => handleTabChange("jobs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              subTab === "jobs"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Briefcase size={14} />
            Jobs ({jobApplications?.length || 0})
          </button>
          <button
            onClick={() => handleTabChange("projects")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              subTab === "projects"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileCode size={14} />
            Projects ({projectApplications?.length || 0})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left pane: ranked candidate list */}
        <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 p-6 overflow-x-auto flex flex-col gap-4">
          <h4 className="font-bold text-zinc-150 text-sm font-outfit mb-2">
            {subTab === "jobs" ? "Job Application Candidates" : "Project Assessment Candidates"}
          </h4>

          {activeApps.length === 0 ? (
            <div className="text-center py-20 text-zinc-550 text-xs border border-dashed border-zinc-850 rounded-2xl bg-zinc-950/20">
              No developer applications received under this section yet.
            </div>
          ) : (
            <div className="space-y-3">
              {activeApps.map((app) => {
                const score = app.aiScore || 0;
                const isSelected = app.id === selectedAppId;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected 
                        ? "bg-zinc-850 border-emerald-600/60 shadow-lg shadow-emerald-500/5" 
                        : "bg-zinc-950/40 border-zinc-800/80 hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={app.student?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                        className="w-9 h-9 rounded-full border border-zinc-850"
                        alt=""
                      />
                      <div>
                        <div className="font-bold text-zinc-200 text-xs">{app.student?.name || "Student Developer"}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{app.jobTitle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        score >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        score >= 50 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {score}% Match
                      </span>
                      
                      <div className="flex gap-2 items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          app.status === "ACCEPTED" || app.status === "accepted" ? "text-emerald-400" : 
                          app.status === "REJECTED" || app.status === "rejected" ? "text-red-400" : "text-zinc-550"
                        }`}>
                          {app.status}
                        </span>
                        <ChevronRight size={14} className="text-zinc-650" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Right pane: selected candidate details, AI alignment report */}
        <div className="space-y-4">
          <h4 className="font-bold text-zinc-150 text-sm pl-1 font-outfit">Detailed AI Assessment Report</h4>

          {!selectedApp ? (
            <Card className="p-6 bg-zinc-900 border-zinc-800 text-center py-20 text-zinc-505 text-xs border-dashed border-zinc-850 rounded-2xl bg-zinc-950/20">
              Select a candidate from the left list to review their strengths, gaps, and AI feedback.
            </Card>
          ) : (
            <Card className="p-6 bg-zinc-900 border-zinc-800 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
              
              <div className="flex justify-between items-start pl-2">
                <div>
                  <h4 className="font-bold text-zinc-100 text-base font-outfit">{selectedApp.student?.name}</h4>
                  <p className="text-[10px] text-zinc-500 mt-1">{selectedApp.student?.email}</p>
                </div>
                
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  (selectedApp.aiScore || 0) >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  (selectedApp.aiScore || 0) >= 50 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {(selectedApp.aiScore || 0)}% Score
                </span>
              </div>

              {/* Skills listed */}
              <div className="pl-2 space-y-2">
                <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 block">Candidate Tech Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedApp.student?.skills || []).map(s => (
                    <span key={s} className="px-2 py-0.5 bg-zinc-950 text-[10px] text-zinc-400 border border-zinc-850 rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Strengths */}
              <div className="pl-2 space-y-2 border-t border-zinc-800/40 pt-4">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span className="text-[9px] uppercase font-bold tracking-wider">Technical Strengths</span>
                </div>
                <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside pl-1">
                  {(selectedApp.aiFeedback?.strengths || []).map((str, idx) => (
                    <li key={idx} className="leading-relaxed">{str}</li>
                  ))}
                  {(selectedApp.aiFeedback?.strengths || []).length === 0 && (
                    <li className="list-none text-zinc-500 text-[11px]">No matching strengths analyzed.</li>
                  )}
                </ul>
              </div>

              {/* AI Gaps */}
              <div className="pl-2 space-y-2 border-t border-zinc-800/40 pt-4">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <ShieldAlert size={14} />
                  <span className="text-[9px] uppercase font-bold tracking-wider">Critical Knowledge Gaps</span>
                </div>
                <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside pl-1">
                  {(selectedApp.aiFeedback?.gaps || []).map((gap, idx) => (
                    <li key={idx} className="leading-relaxed">{gap}</li>
                  ))}
                  {(selectedApp.aiFeedback?.gaps || []).length === 0 && (
                    <li className="list-none text-zinc-500 text-[11px]">No matching gaps identified.</li>
                  )}
                </ul>
              </div>

              {/* Action Buttons if Pending */}
              {(selectedApp.status === "PENDING" || selectedApp.status === "pending") && (
                <div className="pl-2 flex gap-3 border-t border-zinc-800/40 pt-4">
                  <button
                    onClick={() => onAccept(selectedApp.id)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    Approve Candidate
                  </button>
                  <button
                    onClick={() => onReject(selectedApp.id)}
                    className="flex-1 py-2 border border-zinc-805 bg-zinc-950 hover:bg-red-950 hover:text-red-400 text-zinc-405 font-bold text-xs transition-all flex items-center justify-center gap-1"
                  >
                    Decline
                  </button>
                </div>
              )}
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
