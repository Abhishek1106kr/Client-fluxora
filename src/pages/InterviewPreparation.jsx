import React from "react";
import { BookOpen, Code, Users, Calendar, HelpCircle, Sparkles, Star, Lightbulb, Play } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const InterviewPreparation = () => {
  return (
    <div className="flex flex-col gap-10">
      {/* Header Banner */}
      <div className="pb-6 border-b border-zinc-900 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-400 font-medium mb-3">
          <Sparkles size={12} />
          <span>Ace the hiring pipeline <a href=""></a></span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-50 font-outfit">
          Interview Preparation Tips
        </h1>
        <p className="text-zinc-400 mt-2 text-sm">
          Prepare effectively for technical, behavioral, and general interviews. Shape your strategy and build confidence.
        </p>
      </div>

      {/* Grid of Tip Sections */}
      <div className="flex flex-col gap-12">
        {/* Section 1: General Interview Tips */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-500">
              <Users size={16} />
            </div>
            <h2 className="text-xl font-bold font-outfit text-zinc-100">General Interview Strategy</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-5 bg-zinc-900 border-zinc-800 flex flex-col justify-between h-full">
              <div>
                <h3 className="font-bold text-sm font-outfit text-zinc-150 mb-3">Research the Company</h3>
                <ul className="text-xs text-zinc-400 list-disc pl-4 space-y-2 leading-relaxed">
                  <li>Understand their mission, core values, and core products.</li>
                  <li>Research recent press releases, acquisitions, and news.</li>
                  <li>Look into their culture, diversity efforts, and engineering blogs.</li>
                  <li>Identify their primary competitors and market position.</li>
                </ul>
              </div>
            </Card>

            <Card className="p-5 bg-zinc-900 border-zinc-800 flex flex-col justify-between h-full">
              <div>
                <h3 className="font-bold text-sm font-outfit text-zinc-150 mb-3">Practice Core Questions</h3>
                <ul className="text-xs text-zinc-400 list-disc pl-4 space-y-2 leading-relaxed">
                  <li>Prepare your elevator pitch for "Tell me about yourself".</li>
                  <li>Identify your specific reasons for "Why this company?".</li>
                  <li>Identify 2-3 key strengths and genuine growth areas (weaknesses).</li>
                  <li>Be ready to walk through any point on your CV in detail.</li>
                </ul>
              </div>
            </Card>

            <Card className="p-5 bg-zinc-900 border-zinc-800 flex flex-col justify-between h-full">
              <div>
                <h3 className="font-bold text-sm font-outfit text-zinc-150 mb-3">Prepare Questions to Ask</h3>
                <ul className="text-xs text-zinc-400 list-disc pl-4 space-y-2 leading-relaxed">
                  <li>Ask about day-to-day work, team dynamics, and expectations.</li>
                  <li>Inquire about the technical roadmap, engineering challenges, and stack.</li>
                  <li>Ask about growth opportunities and the mentorship process.</li>
                  <li>Understand next steps in their hiring timeline.</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* Section 2: Technical Interview Tips */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-500">
              <Code size={16} />
            </div>
            <h2 className="text-xl font-bold font-outfit text-zinc-100">Technical Preparation</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-5 bg-zinc-900 border-zinc-800 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm font-outfit text-zinc-150 mb-3 flex items-center gap-2">
                  <Star size={14} className="text-emerald-500" />
                  Algorithm & Stack Fundamentals
                </h3>
                <ul className="text-xs text-zinc-400 list-disc pl-4 space-y-2 leading-relaxed">
                  <li>Brush up on essential structures (Arrays, Trees, HashMaps, Graphs).</li>
                  <li>Master space/time complexity analysis (Big O notation).</li>
                  <li>Explain your code out loud while practicing on whiteboards or LeetCode.</li>
                  <li>Consider edge cases, inputs validation, and structural optimizations.</li>
                </ul>
              </div>
            </Card>

            <Card className="p-5 bg-zinc-900 border-zinc-800 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm font-outfit text-zinc-150 mb-3 flex items-center gap-2">
                  <BookOpen size={14} className="text-emerald-500" />
                  Systems Design & Project Walkthroughs
                </h3>
                <ul className="text-xs text-zinc-400 list-disc pl-4 space-y-2 leading-relaxed">
                  <li>Understand load balancers, caching strategies, databases, and microservices.</li>
                  <li>Learn trade-offs between SQL and NoSQL, Latency and Throughput.</li>
                  <li>Be prepared to explain past projects: architecture, stack, and challenges.</li>
                  <li>Focus heavily on your individual contribution and lessons learned.</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* Section 3: Behavioral Strategy (STAR) */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-500">
              <HelpCircle size={16} />
            </div>
            <h2 className="text-xl font-bold font-outfit text-zinc-100">Behavioral Frameworks</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-5 bg-zinc-900 border-zinc-800 md:col-span-2">
              <h3 className="font-bold text-sm font-outfit text-zinc-150 mb-3 flex items-center gap-2">
                <Lightbulb size={14} className="text-emerald-500" />
                The STAR Technique
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Structure all your situational stories using this highly organized methodology:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-850">
                  <span className="font-bold text-emerald-400 block mb-0.5">Situation</span>
                  <span className="text-zinc-500">Describe the context, setup, or specific problem you were facing.</span>
                </div>
                <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-850">
                  <span className="font-bold text-emerald-400 block mb-0.5">Task</span>
                  <span className="text-zinc-500">Explain the goals, requirements, or what needed to be resolved.</span>
                </div>
                <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-850">
                  <span className="font-bold text-emerald-400 block mb-0.5">Action</span>
                  <span className="text-zinc-500">Walk through the steps, solutions, and technologies you personally chose.</span>
                </div>
                <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-850">
                  <span className="font-bold text-emerald-400 block mb-0.5">Result</span>
                  <span className="text-zinc-500">Describe the outcome, quantifiable metrics, and what you learned.</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-zinc-900 border-zinc-800">
              <h3 className="font-bold text-sm font-outfit text-zinc-150 mb-3">Soft Skills to Highlight</h3>
              <ul className="text-xs text-zinc-400 list-disc pl-4 space-y-2 leading-relaxed">
                <li>Collaborative spirit (working across multidisciplinary teams).</li>
                <li>Clear verbal communication and active listening.</li>
                <li>Resilience in problem solving and critical feedback loops.</li>
                <li>Authenticity and self-awareness of your boundaries.</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Section 4: Extra Resources & Mock Interviews */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-500">
              <Play size={16} />
            </div>
            <h2 className="text-xl font-bold font-outfit text-zinc-100">Learning Materials & Tools</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="p-4 bg-zinc-900 border-zinc-800 text-center">
              <span className="font-bold text-xs text-zinc-300 block mb-1">LeetCode & HackerRank</span>
              <p className="text-[11px] text-zinc-500 leading-relaxed">Solve coding tracks in your favorite languages.</p>
            </Card>
            <Card className="p-4 bg-zinc-900 border-zinc-800 text-center">
              <span className="font-bold text-xs text-zinc-300 block mb-1">Mock Interviews</span>
              <p className="text-[11px] text-zinc-500 leading-relaxed">Roleplay with peers, career tutors, or tools.</p>
            </Card>
            <Card className="p-4 bg-zinc-900 border-zinc-800 text-center">
              <span className="font-bold text-xs text-zinc-300 block mb-1">Glassdoor Guides</span>
              <p className="text-[11px] text-zinc-500 leading-relaxed">Look up company-specific timelines and templates.</p>
            </Card>
            <Card className="p-4 bg-zinc-900 border-zinc-800 text-center">
              <span className="font-bold text-xs text-zinc-300 block mb-1">Tech Blogs</span>
              <p className="text-[11px] text-zinc-500 leading-relaxed">Read engineering articles from Netflix, Stripe, etc.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPreparation;