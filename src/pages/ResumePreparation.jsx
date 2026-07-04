import React, { useState, useContext } from "react";
import { FileText, Award, Edit, CheckCircle2, AlertTriangle, Sparkles, Download, UploadCloud, RefreshCw, X, ChevronRight } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import FileUpload from "../components/fileUpload";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const templates = [
  {
    name: "Modern Professional",
    description: "Clean, contemporary design with subtle accents. Perfect for tech and corporate roles.",
    features: ["Two-column layout", "Skills highlight section", "Professional typography"],
    url: "https://www.canva.com/templates/EAGQUnFrIZI-science-and-engineering-resume-in-white-black-simple-style/"
  },
  {
    name: "Creative Portfolio",
    description: "Bold design with visual elements. Ideal for creative and design positions.",
    features: ["Visual skill indicators", "Portfolio section", "Custom color scheme"],
    url: "https://www.canva.com/templates/EAGQUqfv6KQ-science-and-engineering-resume-in-green-black-simple-style/"
  },
  {
    name: "Executive Classic",
    description: "Sophisticated layout for senior positions. Emphasizes leadership and achievements.",
    features: ["Leadership section", "Strategic achievements", "Professional summary focus"],
    url: "https://www.canva.com/templates/EAGIzZzlHCg-blue-and-gray-simple-professional-cv-resume/",
    filename: "Executive-Classic-Resume.docx"
  },
  {
    name: "Tech Specialist",
    description: "Optimized for technical roles. Highlights technical skills and projects.",
    features: ["Technical skills matrix", "Project showcase", "Certification section"],
    url: "https://www.canva.com/templates/EAFzSzKZZsg-modern-minimalist-cv-resume/"
  },
  {
    name: "Entry Level",
    description: "Perfect for recent graduates and career changers. Emphasizes education and potential.",
    features: ["Education focus", "Relevant coursework", "Transferable skills"],
    url: "https://www.canva.com/templates/EAGIvMa6hAE-green-elegant-professional-resume/"
  },
  {
    name: "Minimalist",
    description: "Simple and elegant design. Focuses on content and readability.",
    features: ["Clean layout", "Essential sections", "Easy to customize"],
    url: "https://www.canva.com/templates/EAGYYHQskgA-green-and-white-modern-graphic-designer-resume/"
  }
];

const ResumePreparation = () => {
  const { backendUrl } = useContext(AppContext);
  const [resumeFile, setResumeFile] = useState(null);
  const [targetJob, setTargetJob] = useState("");
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [jdMode, setJdMode] = useState("url"); // 'url' or 'text'
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleProcessResume = async () => {
    if (!resumeFile) {
      toast.error("Please upload and link a resume document first.");
      return;
    }
    if (!targetJob.trim()) {
      toast.error("Please enter a target job title.");
      return;
    }

    setLoading(true);
    setLoadingStage("Parsing resume PDF...");

    try {
      if (jdMode === "url" && jobDescriptionUrl.trim()) {
        setLoadingStage("Scraping job posting...");
      } else {
        setLoadingStage("Analyzing document semantics...");
      }

      const response = await axios.post(`${backendUrl}/api/resume/optimize`, {
        resumeUrl: resumeFile,
        targetJob,
        jobDescriptionText: jdMode === "text" ? jobDescriptionText : "",
        jobDescriptionUrl: jdMode === "url" ? jobDescriptionUrl : "",
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setAnalysisResult(response.data.data);
        toast.success("AI Analysis generated successfully!");
      } else {
        toast.error(response.data.message || "Failed to generate analysis");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred during resume analysis");
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setResumeFile(null);
    setTargetJob("");
    setJobDescriptionUrl("");
    setJobDescriptionText("");
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header Banner */}
      <div className="mt-4 grid grid-cols-1 items-end gap-6 border-b border-zinc-800 pb-6 md:grid-cols-4 md:gap-x-8">
        <div className="md:col-span-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-400 font-medium mb-3">
            <Sparkles size={12} />
            <span>Land the first callback</span>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-50 font-outfit">
            AI Resume Analyzer & Optimization
          </h1>
          
          <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
            Upload your resume, specify your target job, and get deep, actionable AI insights, ATS matching scores, critical gaps, and visual progress metrics.
          </p>
        </div>

        <div className="flex md:justify-end">
          {analysisResult && (
            <button 
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-zinc-300 hover:text-white transition-all bg-zinc-800 hover:bg-zinc-700 active:scale-95"
            >
              <RefreshCw size={14} className="animate-pulse" />
              <span>Analyze Another</span>
            </button>
          )}
        </div>
      </div>

      {/* Main AI Tool Section */}
      {!analysisResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Upload Resume */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col h-full">
              <h3 className="text-sm font-bold text-zinc-200 mb-3 uppercase tracking-wider font-outfit flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0052CC] text-white text-xs">1</span>
                Upload Resume (PDF)
              </h3>
              
              {!resumeFile ? (
                <div className="flex-grow flex flex-col justify-center">
                  <FileUpload onUploadSuccess={(url) => {
                    setResumeFile(url);
                    toast.success("Resume uploaded and parsed successfully!");
                  }} />
                </div>
              ) : (
                <div className="flex-grow flex flex-col justify-between border-2 border-dashed border-emerald-900/40 rounded-2xl p-5 bg-emerald-950/5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400">
                      <FileText size={24} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-zinc-150 truncate">
                        {resumeFile.split('/').pop()}
                      </p>
                      <span className="text-xs text-emerald-400 font-medium">Staged for analysis</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setResumeFile(null)}
                    className="mt-6 w-full py-2 border border-zinc-800 hover:border-red-500/20 hover:bg-red-950/10 text-zinc-400 hover:text-red-400 rounded-lg text-xs font-semibold transition-all"
                  >
                    Remove and Re-upload
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Job details & Analyze Action */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-5">
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-outfit flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0052CC] text-white text-xs">2</span>
                Target Job Requirements
              </h3>

              {/* Target Job Title Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-450 uppercase tracking-wide">Target Job Title</label>
                <input 
                  type="text" 
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer" 
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors"
                />
              </div>

              {/* Job Description Mode Select Tabs */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-450 uppercase tracking-wide">Job Description Source (Optional)</label>
                  <div className="flex bg-zinc-950 border border-zinc-800 p-0.5 rounded-lg text-xs">
                    <button
                      onClick={() => setJdMode("url")}
                      className={`px-3 py-1 rounded-md font-semibold transition-all ${jdMode === "url" ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Job Post URL
                    </button>
                    <button
                      onClick={() => setJdMode("text")}
                      className={`px-3 py-1 rounded-md font-semibold transition-all ${jdMode === "text" ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Paste Text
                    </button>
                  </div>
                </div>

                {jdMode === "url" ? (
                  <input 
                    type="url"
                    value={jobDescriptionUrl}
                    onChange={(e) => setJobDescriptionUrl(e.target.value)}
                    placeholder="https://example.com/job-listing-url" 
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors"
                  />
                ) : (
                  <textarea 
                    value={jobDescriptionText}
                    onChange={(e) => setJobDescriptionText(e.target.value)}
                    placeholder="Paste the target job description details here to match specific keywords..." 
                    rows={4}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors resize-none font-sans"
                  />
                )}
              </div>

              {/* Action Button & Loader */}
              <div className="mt-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 border border-zinc-850 rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-3"></div>
                    <span className="text-xs font-semibold text-emerald-400 animate-pulse uppercase tracking-widest">{loadingStage}</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleProcessResume}
                    disabled={!resumeFile || !targetJob}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center text-sm font-bold tracking-wide rounded-xl py-3.5 shadow-lg active:scale-[0.98]"
                    icon={Sparkles}
                  >
                    {!resumeFile ? "Upload Resume to Analyze" : !targetJob ? "Specify Target Job to Analyze" : "Start AI Match Analysis"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SPECTACULAR AI RESULTS DASHBOARD */
        <div className="flex flex-col gap-8 animate-in fade-in duration-355">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Overall Circular Score Metric */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-955 border-zinc-800/80 h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.05),transparent_60%)] pointer-events-none" />
                
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-450 mb-6">
                  Overall ATS Compatibility
                </h3>

                <div className="relative flex items-center justify-center w-40 h-40 mb-6">
                  {/* Radial score circle */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="text-zinc-800"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className={`transition-all duration-1000 ${
                        analysisResult.overallScore >= 80 ? 'text-emerald-500' :
                        analysisResult.overallScore >= 60 ? 'text-amber-500' : 'text-red-500'
                      }`}
                      strokeWidth="8"
                      strokeDasharray={314}
                      strokeDashoffset={314 - (314 * analysisResult.overallScore) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  
                  {/* Absolute Center Content */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-extrabold font-outfit text-zinc-50">
                      {analysisResult.overallScore}%
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 mt-1 rounded-full ${
                      analysisResult.overallScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      analysisResult.overallScore >= 60 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {analysisResult.overallScore >= 80 ? 'Strong Match' :
                       analysisResult.overallScore >= 60 ? 'Fair Match' : 'Weak Match'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-455 max-w-xs leading-relaxed">
                  Based on semantic indexing, keyword saturation, professional progression, and quantified performance indicators.
                </p>
              </Card>
            </div>

            {/* Right: Score Breakdown Progress Indicators */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-zinc-900/60 border-zinc-800 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-450 mb-6">
                    Dimension Evaluation Breakdown
                  </h3>
                  
                  <div className="flex flex-col gap-6">
                    {/* Skills Match */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-zinc-200">Core Technical Skills Match</span>
                        <span className="font-bold text-zinc-100">{analysisResult.breakdown?.skillsMatch ?? 0}%</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                        <div 
                          className="bg-[#0052CC] h-full rounded-full transition-all duration-1000"
                          style={{ width: `${analysisResult.breakdown?.skillsMatch ?? 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Experience Depth */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-zinc-200">Professional Experience Depth</span>
                        <span className="font-bold text-zinc-100">{analysisResult.breakdown?.experienceDepth ?? 0}%</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${analysisResult.breakdown?.experienceDepth ?? 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Impact Metrics */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-zinc-200">Impact & Quantified Metrics</span>
                        <span className="font-bold text-zinc-100">{analysisResult.breakdown?.impactMetrics ?? 0}%</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                        <div 
                          className="bg-purple-505 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${analysisResult.breakdown?.impactMetrics ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3 text-xs bg-zinc-955 border border-zinc-850 p-4 rounded-xl items-start">
                  <Sparkles size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-zinc-400 leading-relaxed font-sans">
                    <span className="text-zinc-200 font-bold">Pro-tip:</span> To push your score past 90%, prioritize adding precise tooling models, and quantify at least three impact vectors in your professional experience bullet points.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Actionable Gaps & Fixes Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Critical Gaps */}
            <Card className="p-6 bg-zinc-900/60 border-zinc-800/80 hover:border-red-900/20">
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-800/60 pb-3">
                <div className="p-2 rounded-lg bg-red-650/10 border border-red-500/20 text-red-400">
                  <AlertTriangle size={16} />
                </div>
                <h3 className="text-sm font-bold font-outfit text-zinc-100 uppercase tracking-wider">
                  Critical Resume Gaps
                </h3>
              </div>
              
              <ul className="flex flex-col gap-3">
                {analysisResult.criticalGaps?.map((gap, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-zinc-400 leading-relaxed items-start">
                    <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
                {(!analysisResult.criticalGaps || analysisResult.criticalGaps.length === 0) && (
                  <li className="text-xs text-zinc-500 italic">No major technical or domain gaps identified!</li>
                )}
              </ul>
            </Card>

            {/* Actionable Fixes */}
            <Card className="p-6 bg-zinc-900/60 border-zinc-800/80 hover:border-emerald-900/20">
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-800/60 pb-3">
                <div className="p-2 rounded-lg bg-emerald-650/10 border border-emerald-500/20 text-emerald-400">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-sm font-bold font-outfit text-zinc-100 uppercase tracking-wider">
                  AI-Recommended Fixes
                </h3>
              </div>
              
              <ul className="flex flex-col gap-3">
                {analysisResult.actionableFixes?.map((fix, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-zinc-450 leading-relaxed items-start font-sans">
                    <span className="text-emerald-450 font-semibold shrink-0 mt-0.5">✓</span>
                    <span>{fix}</span>
                  </li>
                ))}
                {(!analysisResult.actionableFixes || analysisResult.actionableFixes.length === 0) && (
                  <li className="text-xs text-zinc-500 italic">Resume aligns perfectly. No optimizations recommended.</li>
                )}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="flex flex-col gap-12 pt-4">
      {/* 1. Essential Resume Sections */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-500">
            <FileText size={16} />
          </div>
          <h2 className="text-xl font-bold font-outfit text-zinc-100">Essential Sections</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5 bg-zinc-900 border-zinc-800 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-300 mb-3">Contact Information</h3>
              <ul className="text-xs text-zinc-450 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Full name (prominent)</li>
                <li>Professional email</li>
                <li>Phone number</li>
                <li>LinkedIn profile link</li>
                <li>Portfolio URL</li>
                <li>City, State location</li>
              </ul>
            </div>
          </Card>

          <Card className="p-5 bg-zinc-900 border-zinc-800 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-300 mb-3">Professional Summary</h3>
              <ul className="text-xs text-zinc-450 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>2-3 compelling sentences</li>
                <li>Tailored keywords</li>
                <li>Key career milestones</li>
                <li>Your core strengths</li>
                <li>Value you bring</li>
              </ul>
            </div>
          </Card>

          <Card className="p-5 bg-zinc-900 border-zinc-800 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-300 mb-3">Work Experience</h3>
              <ul className="text-xs text-zinc-450 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Reverse chronology</li>
                <li>Action verb descriptions</li>
                <li>Quantifiable results</li>
                <li>Specific tool usage</li>
                <li>Individual contributions</li>
              </ul>
            </div>
          </Card>

          <Card className="p-5 bg-zinc-900 border-zinc-800 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-300 mb-3">Education & Skills</h3>
              <ul className="text-xs text-zinc-450 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Degrees & majors</li>
                <li>College names & dates</li>
                <li>GPA (if &gt; 3.0)</li>
                <li>Technical skill list</li>
                <li>Certificates & links</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* 2. Resume Writing Tips & ATS Optimization */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-500">
            <CheckCircle2 size={16} />
          </div>
          <h2 className="text-xl font-bold font-outfit text-zinc-100">Resume Writing Tips</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-5 bg-zinc-900 border-zinc-800 h-full">
            <h3 className="font-bold text-sm font-outfit text-zinc-150 mb-3">Format & Sizing</h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Keep layout structure flat and simple.</li>
              <li>Limit length to 1 page (max 2 pages for senior roles).</li>
              <li>Maintain consistent margins and grid alignment.</li>
              <li>Leave enough white space for readability.</li>
            </ul>
          </Card>

          <Card className="p-5 bg-zinc-900 border-zinc-800 h-full">
            <h3 className="font-bold text-sm font-outfit text-zinc-150 mb-3">Language & Metrics</h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Start achievements with active verbs.</li>
              <li>Quantify impact (e.g. "increased speed by 25%").</li>
              <li>Ditch passive boilerplate phrases.</li>
              <li>Double proofread for typos or syntax errors.</li>
            </ul>
          </Card>

          <Card className="p-5 bg-zinc-900 border-zinc-800 h-full">
            <h3 className="font-bold text-sm font-outfit text-zinc-150 mb-3">ATS Matching</h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Align vocabulary directly to the job description.</li>
              <li>Avoid complex tables, columns, or graphic charts.</li>
              <li>Use standard headers (e.g. "Work Experience").</li>
              <li>Always export and submit as a text-parseable PDF.</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* 3. Common Mistakes to Avoid */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-lg bg-red-600/10 border border-red-500/20 text-red-500">
            <AlertTriangle size={16} />
          </div>
          <h2 className="text-xl font-bold font-outfit text-zinc-100">Mistakes to Avoid</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-5 bg-zinc-900 border-zinc-800">
            <h3 className="font-bold text-sm font-outfit text-red-400 mb-3">Boilerplate Content</h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Spelling mistakes, grammar issues, or outdated links.</li>
              <li>Massive chunks of text without bullet points.</li>
              <li>Listing job duties instead of positive outcomes.</li>
              <li>Unprofessional email handles or missing country codes.</li>
            </ul>
          </Card>

          <Card className="p-5 bg-zinc-900 border-zinc-800">
            <h3 className="font-bold text-sm font-outfit text-red-400 mb-3">Over-Designed Layouts</h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Tacky fonts, colored page backgrounds, or shapes.</li>
              <li>Inserting personal pictures or headshots (standard ATS rejection).</li>
              <li>Vague visual skill percentage bars (e.g. "Python: 80%").</li>
              <li>Non-standard section naming templates.</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* 4. Professional Templates */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-500">
            <Award size={16} />
          </div>
          <h2 className="text-xl font-bold font-outfit text-zinc-100">Professional Templates</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl, idx) => (
            <Card
              key={idx}
              hoverable
              className="p-6 bg-zinc-900 border-zinc-800 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-sm font-outfit text-zinc-150 mb-2">{tpl.name}</h3>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{tpl.description}</p>
                <ul className="text-xs text-zinc-400 space-y-1.5 list-disc pl-4 mb-6 leading-relaxed">
                  {tpl.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
              <a
                href={tpl.url}
                download={tpl.filename}
                className="block text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="sm" className="w-full" icon={Download}>
                  Get Template
                </Button>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
)};

export default ResumePreparation;
