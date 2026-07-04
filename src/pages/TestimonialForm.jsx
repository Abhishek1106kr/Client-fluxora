import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, Sparkles, ArrowLeft } from "lucide-react";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";

const API_URL = "http://localhost:5002/api/testimonials";

export default function TestimonialForm() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    avatar: "",
    content: "",
    rating: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to submit testimonial");
      navigate("/mainpage");
    } catch (err) {
      setError("Could not submit testimonial. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ratingOptions = [
    { value: 5, label: "5 Stars - Outstanding" },
    { value: 4, label: "4 Stars - Great" },
    { value: 3, label: "3 Stars - Good" },
    { value: 2, label: "2 Stars - Mediocre" },
    { value: 1, label: "1 Star - Poor" }
  ];

  return (
    <div className="max-w-xl mx-auto py-4">
      <Card className="bg-zinc-900 border-zinc-800 p-6 md:p-8 shadow-2xl relative">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-3.5 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 mb-3.5">
            <Heart size={24} className="fill-current" />
          </div>
          <h2 className="text-xl font-bold font-outfit text-zinc-50">Share Your Experience</h2>
          <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1.5 justify-center">
            <Sparkles size={11} className="text-emerald-400" />
            Your feedback builds Fluxora's community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <InputField
            label="Name"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            required
          />

          <InputField
            label="Role / Title"
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Frontend Intern @ Google"
            required
          />

          <InputField
            label="Avatar Image URL"
            id="avatar"
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/photo-..."
            required
          />

          <Textarea
            label="Testimonial / Review"
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Fluxora helped me find an amazing internship at Vercel. The process was direct and transparent..."
            required
            rows={4}
          />

          <Select
            label="Rating Stars"
            id="rating"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            options={ratingOptions}
          />

          {error && (
            <div className="p-3 text-xs font-semibold text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-4 pt-4 border-t border-zinc-800/40">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => navigate(-1)}
              icon={ArrowLeft}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-[2]"
              loading={loading}
            >
              Submit Testimonial
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
