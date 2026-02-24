"use client";

import { motion } from "framer-motion";

const SPRING = { type: "spring", stiffness: 280, damping: 28 } as const;

const values = [
  {
    title: "Empowerment through AI",
    description: "We use cutting-edge AI to give you clarity and confidence in your pet's daily care needs, acting as your smart companion between vet visits.",
    image: "/images/value_main.png",
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Proactive Wellness",
    description: "Catching tiny health changes early through smart daily logging is the best medicine for a long, happy life.",
    image: "/images/value_wellness.png",
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Data Trust & Privacy",
    description: "Your daily walk routes and pet's health logs are yours alone. We secure your data with industry-leading privacy standards.",
    image: "/images/dog1.jpg",
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Joyful Tracking",
    description: "Keeping your dog healthy shouldn't feel like a chore. We believe in gamified, rewarding care that makes every walk and meal a win.",
    image: "/images/dog3.jpg",
    className: "md:col-span-2 lg:col-span-2",
  }
];

export default function Values() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "#FDF8F3" }}>
      {/* Decorative paw prints / shapes */}
      <div className="absolute top-10 left-10 opacity-10 rotate-12 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500">
          <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-14v4h-2V6h2zm0 6v6h-2v-6h2z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-2 px-4 rounded-full mb-6 font-semibold"
            style={{
              background: "rgba(13,148,136,0.1)",
              color: "#0F766E",
              fontSize: "0.875rem"
            }}
          >
            Our Core Values
          </motion.div>
          <h2
            className="font-bold mb-6"
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#1a1a2e",
              letterSpacing: "-0.025em"
            }}
          >
            Built for the love of dogs.<br />Designed for peace of mind.
          </h2>
          <p
            className="max-w-2xl mx-auto leading-relaxed"
            style={{ fontSize: "1.125rem", color: "#64748b" }}
          >
            We're on a mission to extend the health and happiness of every pet by making expert-level care accessible, habit-forming, and fun.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[320px]">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: index * 0.15 }}
              whileHover={{ y: -6, scale: 0.98 }}
              className={`relative rounded-3xl overflow-hidden group ${value.className || ''}`}
              style={{
                boxShadow: "0 10px 40px rgba(0,0,0,0.06), 0 2px 10px rgba(0,0,0,0.04)"
              }}
            >
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={value.image}
                  alt={value.title}
                  className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 object-cover"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-500 opacity-100"
                  style={{
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 100%)"
                  }}
                />
              </div>

              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 w-full md:w-[85%]">
                <div className="mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span
                    className="inline-block px-4 py-1.5 rounded-full font-bold text-sm tracking-wide shadow-sm"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(8px)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.3)"
                    }}
                  >
                    {value.title}
                  </span>
                </div>

                <p
                  className="text-white font-medium leading-relaxed text-[1.05rem] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75"
                >
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
