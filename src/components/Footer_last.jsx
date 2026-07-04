import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter, Rocket,Github,Home,ArrowRight } from "lucide-react";

const Footer_last = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <Link to="/mainpage" className="flex items-center gap-2">
              <div className="flex items-center justify-center p-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20">
                <Rocket size={18} className="text-emerald-500" />
              </div>
              <span className="font-outfit font-bold text-lg tracking-tight text-zinc-50">
                Flux<span className="text-emerald-500">ora</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Your bridge to exciting opportunities, skills enhancement, and career growth.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="/mainpage" className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
                <Home size={17} />
              </a>
              <a href="https://www.github.com/Abhishek1106kr/fluxora" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
                <Github size={16} />
              </a>
              <a href="https://www.instagram.com/abhishekkr_akr/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
                <Instagram size={16} />
              </a>
              <a href="https://www.linkedin.com/in/abhi-chauhan-685b0130a/" className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-zinc-300 uppercase mb-4">Platform</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link to="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/job" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  Jobs & Projects
                </Link>
              </li>
              <li>
                <Link to="/interviewPreparation" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link to="/resumePreparation" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  Resume Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-zinc-300 uppercase mb-4">Company</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://abhishek1106kr.github.io/port/" target="_blank" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  Devloper Portfolio
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-zinc-300 uppercase mb-4">Legal</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <Link to="/Development-Book" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  Development Book
                </Link>
              </li>

            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 mt-10 md:mt-16 pt-6 flex items-center justify-between text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Fluxora. All rights reserved.</p>
          <p> Crafted by <Link to="https://abhishek1106kr.github.io/port/" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            Fluxora Team
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer_last;