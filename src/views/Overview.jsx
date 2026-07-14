import React from "react";
import Card from "../components/ui/Card";
import { Briefcase, FileText, CheckCircle, Lightbulb, BarChart } from "lucide-react";

export default function Overview({ projectsCount, pendingCount, workspacesCount, startupName }) {
  const stats = [
    {
      name: "Total Postings",
      value: projectsCount || 0,
      desc: "MongoDB Job cards created",
      icon: Briefcase,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20"
    },
    {
      name: "Talent Pipeline",
      value: pendingCount || 0,
      desc: "Candidates awaiting evaluation",
      icon: FileText,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20"
    },
    {
      name: "Active Collaborations",
      value: workspacesCount || 0,
      desc: "Live project workspaces",
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-bold font-outfit text-zinc-50">Welcome back, {startupName || "Partner"}</h3>
        <p className="text-xs text-zinc-500 mt-1">Here is a quick snapshot of your recruitment funnel and developer workspaces.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 bg-zinc-900 border-zinc-800/80 hover:border-zinc-700/80 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider block">{stat.name}</span>
                <h3 className="text-3xl font-extrabold text-zinc-100 font-outfit mt-2">{stat.value}</h3>
                <p className="text-xs text-zinc-400 mt-1">{stat.desc}</p>
              </div>
              <div className={`p-3 rounded-xl border ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6 bg-zinc-900 border-zinc-800">
          <div className="flex items-center gap-2 mb-6">
            <BarChart size={18} className="text-emerald-550" />
            <h4 className="font-bold text-zinc-150 text-sm font-outfit">Recruitment Funnel Progress</h4>
          </div>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs text-zinc-400 font-medium mb-2">
                <span>Active Job Postings Matching Platform Metrics</span>
                <span>{projectsCount > 0 ? "100%" : "0%"}</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-850">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: projectsCount > 0 ? "100%" : "0%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-400 font-medium mb-2">
                <span>AI Assessment Screening Passing Rate</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-850">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: "78%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-400 font-medium mb-2">
                <span>Developer Workspace Provisioning Rate</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-850">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: "92%" }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-zinc-900 border-zinc-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Lightbulb size={18} />
              <h4 className="font-bold text-zinc-150 text-sm font-outfit">Matching Tips</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              When creating job listings, add clear and detailed requirements. Our automatic screening reviews developer profiles using the Gemini model to compile an alignment index.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 text-[11px] text-zinc-500 mt-4 leading-relaxed">
            💡 Accept qualified candidates to automatically start active collaboration workspaces and monitor webhook terminal outputs.
          </div>
        </Card>
      </div>
    </div>
  );
}
