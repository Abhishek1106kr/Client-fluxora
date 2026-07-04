import React, { useState, useContext } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Rocket, MapPin, Globe, Shield, Users } from "lucide-react";
import InputField from "../components/ui/InputField";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import axios from "axios";
import { AppContext } from "../context/AppContext";

//default show
const LOGO_GRADIENTS = [
  { label: "Emerald (Default)", value: "from-emerald-500 to-teal-600" },
  { label: "Neon Purple", value: "from-purple-500 to-indigo-600" },
  { label: "Sunset Amber", value: "from-amber-500 to-orange-600" },
  { label: "Crimson Rose", value: "from-rose-500 to-pink-600" },
  { label: "Ocean Cyan", value: "from-cyan-500 to-blue-600" },
];

const INDUSTRIES = [
  { label: "AI & Machine Learning", value: "AI/ML" },
  { label: "Software as a Service", value: "SaaS" },
  { label: "Financial Technology", value: "FinTech" },
  { label: "Health Technology", value: "HealthTech" },
  { label: "Web3 & Blockchain", value: "Web3" },
  { label: "Educational Technology", value: "EdTech" },
];

const COMPANY_SIZES = [
  { label: "1 - 10 employees (Early Stage)", value: "1-10" },
  { label: "11 - 50 employees (Growth Stage)", value: "11-50" },
  { label: "51 - 200 employees (Scale-up)", value: "51-200" },
  { label: "200+ employees (Established)", value: "200+" },
];

const FUNDING_STAGES = [
  { label: "Bootstrapped", value: "Bootstrapped" },
  { label: "Pre-Seed", value: "Pre-Seed" },
  { label: "Seed", value: "Seed" },
  { label: "Series A", value: "Series A" },
  { label: "Series B & Beyond", value: "Series B+" },
];

const COLLABORATION_MODELS = [
  { label: "Internships & Scoped Projects", value: "Internships" },
  { label: "Hackathons & Challenges", value: "Hackathons" },
  { label: "Open Source Partnerships", value: "Open Source" },
  { label: "Full-Time Hiring Opportunities", value: "Full-Time" },
];

export default function StartupOnboarding({ onCancel, onSuccess }) {
  const { backendUrl } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    location: "San Francisco, CA",
    website: "https://",
    logoBg: "from-emerald-500 to-teal-600",
    mission: "",
    founders: "",
    industry: "AI/ML",
    size: "1-10",
    stage: "Seed",
    techStackRaw: "",
    rolesNeeded: "",
    collaboration: "Internships",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (currentStep) => {
    const stepErrors = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) stepErrors.name = "Company name is required";
      if (!formData.tagline.trim()) stepErrors.tagline = "Elevator pitch is required";
      if (!formData.location.trim()) stepErrors.location = "Location is required";
      if (!formData.website.startsWith("http")) stepErrors.website = "Must enter a valid URL";
    } else if (currentStep === 2) {
      if (!formData.mission.trim()) stepErrors.mission = "Mission statement is required";
      if (!formData.founders.trim()) stepErrors.founders = "Founder details are required";
    } else if (currentStep === 3) {
      if (!formData.techStackRaw.trim()) stepErrors.techStackRaw = "Tech stack is required";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setSubmitting(true);

    try {
      const locParts = formData.location.split(",").map((p) => p.trim());
      const city = locParts[0] || "San Francisco";
      const state = locParts[1] || "CA";
      const country = locParts[2] || "United States";

      const industryMap = {
        "AI/ML": "technology",
        "SaaS": "technology",
        "FinTech": "fintech",
        "HealthTech": "healthcare",
        "Web3": "other",
        "EdTech": "edtech"
      };
      const category = industryMap[formData.industry] || "other";

      const payload = {
        StartUpName: formData.name,
        legalName: formData.name,
        WebSiteUrl: formData.website,
        Category: category,
        onLineDescription: formData.tagline,
        fullDescription: formData.mission,
        employeeCountRange: formData.size,
        inCorporationDate: new Date(),
        logoURL: formData.logoBg,
        country,
        state,
        city,
        address: formData.location,
        fundingRound: {
          stage: formData.stage.toLowerCase(),
          totalRaise: 0,
          targetRaised: 1000000
        },
        socialLinks: {
          linkedin: "",
          twitter: "",
          github: ""
        }
      };

      const res = await axios.post(`${backendUrl}/api/startup/register`, payload, {
        withCredentials: true
      });

      if (res.data.success) {
        setSubmitting(false);
        setSuccess(true);
        setTimeout(() => {
          onSuccess(formData.name);
        }, 2000);
      } else {
        toast.error(res.data.message || "Failed to register startup.");
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Error registering startup:", err);
      toast.error(
        err.response?.data?.message || "Registration failed. Please make sure you are logged in as a startup user."
      );
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 animate-bounce">
          <CheckCircle size={36} />
        </div>
        <h3 className="text-2xl font-bold font-outfit text-zinc-50">Onboarding Successful!</h3>
        <p className="text-zinc-400 text-sm max-w-sm mt-2">
          Welcome to Fluxora, <span className="text-emerald-400 font-semibold">{formData.name}</span>. Redirecting you to the directory listing...
        </p>
      </div>
    );
  }

  return (
    <div className="text-left">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 px-2">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center flex-1 last:flex-initial">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
              step === num
                ? "bg-emerald-600/10 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/20"
                : step > num
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500"
            }`}>
              {num}
            </div>
            {num < 3 && (
              <div className={`h-0.5 flex-1 mx-4 rounded ${
                step > num ? "bg-emerald-600" : "bg-zinc-800"
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h4 className="text-base font-bold font-outfit text-zinc-50 flex items-center gap-2">
                <Rocket size={18} className="text-emerald-500" />
                Company Overview
              </h4>
              <p className="text-xs text-zinc-500 mt-1">Let's start with basic details about your startup.</p>
            </div>

            <InputField
              label="Company Name"
              id="name"
              placeholder="e.g. Apex AI"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
            />

            <InputField
              label="Elevator Pitch / Tagline"
              id="tagline"
              placeholder="A short one-sentence hook summarizing what you do"
              value={formData.tagline}
              onChange={(e) => handleInputChange("tagline", e.target.value)}
              error={errors.tagline}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="HQ Location"
                id="location"
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                error={errors.location}
                icon={MapPin}
                required
              />

              <InputField
                label="Website Link"
                id="website"
                placeholder="https://apex.ai"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                error={errors.website}
                icon={Globe}
                required
              />
            </div>

            <Select
              label="Logo Color Palette"
              id="logoBg"
              value={formData.logoBg}
              onChange={(e) => handleInputChange("logoBg", e.target.value)}
              options={LOGO_GRADIENTS}
              helperText="Choose a gradient colors style that fits your brand logo symbol."
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h4 className="text-base font-bold font-outfit text-zinc-50 flex items-center gap-2">
                <Shield size={18} className="text-emerald-500" />
                Company Profile
              </h4>
              <p className="text-xs text-zinc-500 mt-1">Describe your mission and operational stage.</p>
            </div>

            <Textarea
              label="Company Mission & Vision"
              id="mission"
              placeholder="What problem are you solving? What is your roadmap?"
              value={formData.mission}
              onChange={(e) => handleInputChange("mission", e.target.value)}
              error={errors.mission}
              required
            />

            <InputField
              label="Founders & Team Roles"
              id="founders"
              placeholder="e.g. John Doe (CEO, Ex-Stripe), Sarah Smith (CTO, MIT AI Lab)"
              value={formData.founders}
              onChange={(e) => handleInputChange("founders", e.target.value)}
              error={errors.founders}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Industry"
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                options={INDUSTRIES}
              />

              <Select
                label="Team Headcount"
                id="size"
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                options={COMPANY_SIZES}
              />

              <Select
                label="Funding Stage"
                id="stage"
                value={formData.stage}
                onChange={(e) => handleInputChange("stage", e.target.value)}
                options={FUNDING_STAGES}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h4 className="text-base font-bold font-outfit text-zinc-50 flex items-center gap-2">
                <Users size={18} className="text-emerald-500" />
                Developer Alignment
              </h4>
              <p className="text-xs text-zinc-500 mt-1">Define your stack and what you seek in student developers.</p>
            </div>

            <InputField
              label="Core Tech Stack (Comma Separated)"
              id="techStackRaw"
              placeholder="e.g. React, Node.js, Python, TensorFlow, PostgreSQL"
              value={formData.techStackRaw}
              onChange={(e) => handleInputChange("techStackRaw", e.target.value)}
              error={errors.techStackRaw}
              helperText="Enter key tools, languages, and frameworks separated by commas."
              required
            />

            <Textarea
              label="What profiles / projects do you need help with?"
              id="rolesNeeded"
              placeholder="e.g. We need help setting up our ML model serving endpoint, building a beautiful React dashboard, or running devops scripts."
              value={formData.rolesNeeded}
              onChange={(e) => handleInputChange("rolesNeeded", e.target.value)}
              rows={3}
            />

            <Select
              label="Preferred Collaboration Model"
              id="collaboration"
              value={formData.collaboration}
              onChange={(e) => handleInputChange("collaboration", e.target.value)}
              options={COLLABORATION_MODELS}
            />
          </div>
        )}

        {/* Form Actions Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800/60 pt-5 mt-6">
          <Button
            variant="ghost"
            onClick={step === 1 ? onCancel : handleBack}
            icon={step === 1 ? null : ChevronLeft}
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          {step < 3 ? (
            <Button variant="primary" onClick={handleNext} icon={ChevronRight}>
              Next Step
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              icon={Rocket}
            >
              Complete Registration
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
