export const INITIAL_STARTUPS = [
  {
    id: "apex-ai",
    name: "Apex AI",
    tagline: "Autonomous AI developer agents for production software engineering.",
    industry: "AI/ML",
    stage: "Seed",
    size: "1-10",
    location: "San Francisco, CA",
    website: "https://apex.ai",
    logoBg: "from-emerald-500 to-teal-600",
    mission: "To accelerate human software engineering by building state-of-the-art AI agents that can seamlessly integrate into git workflows, resolve complex PRs, and run test suites autonomously.",
    founders: "Devansh Verma (Ex-OpenAI), Abhishek Chauhan (Ex-DeepMind)",
    techStack: ["React", "Node.js", "Python", "Docker", "PyTorch", "Kubernetes"],
    rolesNeeded: "We are looking for full-stack and machine learning interns to help design the agent playground UI and train custom code-generation model parameters.",
    collaboration: "Internships",
    activeProjects: [
      { id: "proj-1", title: "Build visual trace viewer for agent decisions", status: "open", reward: "$3,000 stipend" },
      { id: "proj-2", title: "Optimize latency of code chunking pipeline", status: "in_progress", reward: "$2,500 stipend" }
    ]
  },
  {
    id: "quantflow",
    name: "QuantFlow",
    tagline: "High-frequency analytics and algorithmic trading infrastructure.",
    industry: "FinTech",
    stage: "Series A",
    size: "11-50",
    location: "New York, NY",
    website: "https://quantflow.io",
    logoBg: "from-purple-500 to-indigo-600",
    mission: "To democratize high-speed quantitative data pipelines by offering cloud-native, low-latency streaming infrastructure for hedge funds and retail researchers.",
    founders: "Sarah Miller (Ex-Jane Street), David Chen (PhD in Finance, Columbia)",
    techStack: ["C++", "Rust", "Python", "AWS", "Kafka", "React"],
    rolesNeeded: "Seeking systems engineering candidates who love C++ or Rust to build low-latency WebSocket APIs and help port analytics modules.",
    collaboration: "Hackathons",
    activeProjects: [
      { id: "proj-3", title: "Create WebAssembly chart compiler", status: "open", reward: "$4,000 stipend" }
    ]
  },
  {
    id: "medvibe",
    name: "MedVibe",
    tagline: "Non-invasive real-time metabolic tracking wearables.",
    industry: "HealthTech",
    stage: "Bootstrapped",
    size: "1-10",
    location: "Boston, MA",
    website: "https://medvibe.com",
    logoBg: "from-rose-500 to-pink-600",
    mission: "We build biosensors that analyze sweat biomarkers to provide metabolic insight, helping users manage health conditions without fingerpricks.",
    founders: "Dr. Amanda Ross (MD, Harvard Med), Marcus Lin (Ex-Apple Health)",
    techStack: ["React Native", "TypeScript", "Python", "Bluetooth LE", "C", "AWS"],
    rolesNeeded: "React Native developer to build smooth animations, chart displays, and integrate BLE connection hooks in our mobile beta app.",
    collaboration: "Internships",
    activeProjects: [
      { id: "proj-4", title: "Integrate Bluetooth LE background sync", status: "open", reward: "Equity + Internship offer" }
    ]
  }
];

export function getStartups() {
  const stored = localStorage.getItem("launchpad_startups");
  if (!stored) {
    localStorage.setItem("launchpad_startups", JSON.stringify(INITIAL_STARTUPS));
    return INITIAL_STARTUPS;
  }
  return JSON.parse(stored);
}

export function addStartup(startup) {
  const startups = getStartups();
  const updated = [startup, ...startups];
  localStorage.setItem("launchpad_startups", JSON.stringify(updated));
  return updated;
}
