import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "./ui/Card";
import Button from "./ui/Button";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5002/api/testimonials")
      .then((res) => res.json())
      .then(setTestimonials)
      .catch(() => setTestimonials([]));
  }, []);

  const minSwipeDistance = 50;

  const handlePrev = () => setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const handleNext = () => setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    else if (distance < -minSwipeDistance) handlePrev();
  };

  return (
    <section id="testimonials" className="py-20 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl font-extrabold text-zinc-50 mt-1 font-outfit">
            What Our Community Says
          </h2>
          <p className="mt-4 text-zinc-400 text-sm">
            Hear from fellow students and project owners who have launched their careers and projects on Fluxora.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="primary" size="md" onClick={() => navigate("/add-testimonial")}>
              Add Testimonial
            </Button>
          </div>
        </div>

        {testimonials.length > 0 && (
          <div
            className="relative max-w-3xl mx-auto px-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial._id || testimonial.id} className="w-full flex-shrink-0 px-2">
                    <Card className="relative bg-zinc-900 border-zinc-800 p-8 md:p-12 overflow-visible">
                      {/* Quote Icon Background */}
                      <Quote className="absolute right-8 top-8 w-24 h-24 text-zinc-850 pointer-events-none -z-0" />

                      <div className="relative z-10 flex flex-col items-start">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < testimonial.rating
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-zinc-700"
                              }
                            />
                          ))}
                        </div>

                        {/* Content */}
                        <blockquote className="text-zinc-200 text-lg md:text-xl font-normal leading-relaxed italic mb-8">
                          "{testimonial.content}"
                        </blockquote>

                        {/* Author Info */}
                        <div className="flex items-center gap-4">
                          <img
                            src={testimonial.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800 shadow-md"
                          />
                          <div>
                            <div className="font-bold text-zinc-100 font-outfit">{testimonial.name}</div>
                            <div className="text-zinc-500 text-xs font-medium">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-[-16px] md:left-[-32px] top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all shadow-xl"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-[-16px] md:right-[-32px] top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all shadow-xl"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index ? "w-6 bg-emerald-500" : "w-1.5 bg-zinc-850 hover:bg-zinc-800"
                  }`}
                  aria-label={`Go to testimonial slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
