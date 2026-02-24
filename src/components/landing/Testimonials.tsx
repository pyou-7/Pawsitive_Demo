"use client";

import { motion } from "framer-motion";

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

const testimonials = [
  {
    name: "Sarah L.",
    text: "Pawsitive exceeded my expectations. Their pet sitting service was truly exceptional. Thanks to their dedicated care and attention.",
    initials: "SL",
    color: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)"
  },
  {
    name: "Michael R.",
    text: "Can't praise Pawsitive's grooming team enough. They transformed my dog into a furry superstar and made my pup feel truly pampered.",
    initials: "MR",
    color: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)"
  },
  {
    name: "Jennifer M.",
    text: "Pawsitive's veterinarians are absolute gems. They provided top-notch medical care and showed immense compassion for my aging dog.",
    initials: "JM",
    color: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)"
  }
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-28"
      style={{ backgroundColor: "#F4EEE8" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* Left Column: Title & Quote Icon */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="lg:col-span-5 lg:sticky top-24"
          >
            <h2
              className="font-extrabold leading-tight mb-8"
              style={{
                fontFamily: "var(--font-serif, serif)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "#2d2620",
                letterSpacing: "-0.03em"
              }}
            >
              Real Stories<br />from Pawsitive<br />Families
            </h2>
            <div
              className="leading-none -mt-6"
              style={{
                fontSize: "7rem",
                color: "#a48d80",
                opacity: 0.4,
                fontFamily: "Georgia, serif"
              }}
            >
              "
            </div>
          </motion.div>

          {/* Right Column: Cards */}
          <div className="lg:col-span-7 space-y-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: index * 0.12 }}
                whileHover={{ y: -2 }}
                className="p-8 md:p-10 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center md:justify-between"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03)"
                }}
              >
                <div className="flex-1">
                  <p
                    className="mb-6 leading-relaxed"
                    style={{
                      color: "#6b5f56",
                      fontSize: "1rem"
                    }}
                  >
                    {testimonial.text}
                  </p>
                  <div
                    className="font-extrabold"
                    style={{
                      fontFamily: "var(--font-serif, serif)",
                      color: "#2d2620",
                      fontSize: "1.0625rem"
                    }}
                  >
                    {testimonial.name}
                  </div>
                </div>

                <div
                  className="flex-shrink-0 shadow-sm flex items-center justify-center text-white font-bold"
                  style={{
                    width: "4.5rem",
                    height: "4.5rem",
                    borderRadius: "50%",
                    background: testimonial.color,
                    border: "2px solid rgba(0,0,0,0.06)",
                    fontSize: "1.5rem",
                    letterSpacing: "1px"
                  }}
                >
                  {testimonial.initials}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
