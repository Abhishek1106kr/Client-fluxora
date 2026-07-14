import React from "react";
import Card from "../../components/ui/Card";
import { Briefcase, FileText, CheckCircle } from "lucide-react";

export default function StatOverview({ activeJobsCount, pendingReviewsCount, activeWorkspacesCount }) {
  const stats = [
    {
      name: "Active Jobs",
      value: activeJobsCount || 0,
      desc: "Live job openings posted",
      icon: Briefcase,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20"
    },
    {
      name: "Pending Reviews",
      value: pendingReviewsCount || 0,
      desc: "Awaiting AI scorecard check",
      icon: FileText,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20"
    },
    {
      name: "Active Workspaces",
      value: activeWorkspacesCount || 0,
      desc: "Collaborators pushing code",
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <Card key={idx} className={`p-6 bg-zinc-900 border-zinc-800/80 hover:border-zinc-700/80 transition-all`}>
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
  );
}
