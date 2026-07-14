import React from "react";
import Card from "../../components/ui/Card";
import { ExternalLink, Cpu } from "lucide-react";

export default function ActiveWorkspaces({ workspaces }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="pl-1">
        <h4 className="font-bold text-zinc-150 text-base font-outfit">Active Developer Workspaces</h4>
        <p className="text-xs text-zinc-550 mt-1">Live repositories linked via GitHub webhook terminals</p>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-2xl bg-zinc-950/20">
          <Cpu size={24} className="mx-auto mb-2 text-zinc-700" />
          No active developer collaboration workspaces configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workspaces.map((work) => {
            const status = work.state?.lifecycleStatus || "ACTIVE_WORK";
            return (
              <Card key={work._id} className="p-5 bg-zinc-900 border-zinc-800 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                
                <div className="pl-2 flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-zinc-150 text-sm font-outfit">{work.title}</h4>
                    <span className="text-[10px] font-mono text-zinc-500 mt-1 block max-w-[250px] truncate">{work.repositoryUrl}</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold uppercase tracking-wider">
                    {status}
                  </span>
                </div>

                <div className="pl-2 flex items-center justify-between mt-2 pt-3 border-t border-zinc-800/40 text-[10px] text-zinc-550 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Listening for Webhook events</span>
                  </div>

                  <a
                    href={work.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    Terminal <ExternalLink size={12} />
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
