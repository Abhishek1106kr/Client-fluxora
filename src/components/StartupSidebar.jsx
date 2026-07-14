import React from "react";
import { Award, LogOut, Briefcase, Rocket, Layers, Cpu } from "lucide-react";

export default function StartupSidebar({ activeTab, setActiveTab, onLogout, startupName, startupEmail }) {
  const navItems = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "postings", label: "Job Postings", icon: Briefcase },
    { id: "projects", label: "Project Postings", icon: Rocket },
    { id: "workspaces", label: "Active Workspaces", icon: Cpu },
    { id: "pipeline", label: "Talent Pipeline", icon: Award }
  ];

  return (
    <aside className="w-[280px] shrink-0 border-r border-zinc-800 bg-zinc-900/60 flex flex-col justify-between p-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-500/10">
            <Rocket size={20} />
          </div>
          <span className="font-extrabold text-lg tracking-tight font-outfit text-zinc-50">
            Fluxora Partner
          </span>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/10"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Startup Partner</p>
          <p className="text-xs font-semibold text-zinc-250 truncate mt-1">{startupName || "Acme Ventures"}</p>
          <p className="text-[10px] text-zinc-550 truncate">{startupEmail || "founders@acme.com"}</p>
        </div>

        <button 
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
