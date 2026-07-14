import React from "react";
import Card from "../../components/ui/Card";
import { Check, X } from "lucide-react";

export default function ApplicationsTable({ applications, onAccept, onReject }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-bold text-zinc-50 text-base font-outfit">Ranked Candidate AI Scoreboard</h4>
          <p className="text-xs text-zinc-500 mt-1">Students ranked automatically by Gemini profile alignment scores</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-xl bg-zinc-950/20">
          No student profiles submitted for evaluation yet.
        </div>
      ) : (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3 pr-4 pl-2">Candidate</th>
              <th className="pb-3 pr-4">Applied Role</th>
              <th className="pb-3 pr-4 text-center">AI Match Score</th>
              <th className="pb-3 pr-4">Profile Stack</th>
              <th className="pb-3 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {applications.map((app) => {
              const score = app.aiScore || 0;
              return (
                <tr key={app.id} className="hover:bg-zinc-950/30 transition-colors">
                  <td className="py-4 pr-4 pl-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.student?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                        className="w-8 h-8 rounded-full border border-zinc-800"
                        alt=""
                      />
                      <div>
                        <div className="font-bold text-zinc-200 text-xs">{app.student?.name || "Student Developer"}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{app.student?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-medium text-zinc-300">{app.jobTitle}</td>
                  <td className="py-4 pr-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      score >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      score >= 50 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {score}%
                    </span>
                  </td>
                  <td className="py-4 pr-4 max-w-[200px] truncate">
                    <div className="flex gap-1 overflow-hidden">
                      {(app.student?.skills || []).slice(0, 3).map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-zinc-950 text-[10px] text-zinc-400 border border-zinc-850 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 text-right pr-2">
                    {app.status === "PENDING" ? (
                      <div className="inline-flex gap-1.5">
                        <button
                          onClick={() => onAccept(app.id)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => onReject(app.id)}
                          className="p-1.5 bg-zinc-800 hover:bg-red-950 hover:text-red-400 text-zinc-400 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className={`text-[10px] font-bold ${
                        app.status === "ACCEPTED" ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {app.status}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Card>
  );
}
