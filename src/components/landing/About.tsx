"use client";

import { motion } from "framer-motion";

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function About() {
  return (
    <section className="py-24 overflow-hidden" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Left Side - Pet Images */}
          <motion.div
            initial={{ opacity: 0, x: -56 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="lg:col-span-5 relative"
          >
            <div className="relative w-full h-[500px]">
              {/* Main large image */}
              <motion.div
                initial={{ scale: 1.05 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, duration: 1.2 }}
                className="absolute top-0 left-0 w-4/5 h-4/5 rounded-3xl overflow-hidden"
                style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}
              >
                <img
                  src="/images/about_dachshund.png"
                  alt="Happy dog owner hugging Dachshund"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Small overlapping image */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: 0.2, duration: 1 }}
                className="absolute bottom-0 right-0 w-2/5 h-2/5 rounded-3xl overflow-hidden"
                style={{
                  boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
                  border: "4px solid #fff"
                }}
              >
                <img
                  src="/images/about_french_bulldog.png"
                  alt="Cute French Bulldog running"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: 0.35 }}
                className="absolute -bottom-4 -right-4 z-30"
                style={{
                  padding: "0.875rem 1.5rem",
                  borderRadius: "1.25rem",
                  background: "linear-gradient(135deg, #4a9068 0%, #3d7a5a 100%)",
                  boxShadow: "0 8px 24px rgba(74,144,104,0.4), 0 2px 8px rgba(74,144,104,0.25)"
                }}
              >
                <div
                  className="font-bold text-white"
                  style={{ fontSize: "1.375rem", letterSpacing: "-0.02em" }}
                >
                  10K+
                </div>
                <div
                  className="text-white/85"
                  style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                >
                  Happy Pets
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 56 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="lg:col-span-7"
          >
            <h2
              className="font-bold mb-6"
              style={{
                fontFamily: "var(--font-nunito, nunito, sans-serif)",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                color: "#1a1a2e",
                letterSpacing: "-0.02em"
              }}
            >
              Every Pet Deserves the Best Care
            </h2>
            <p
              className="mb-6 leading-relaxed"
              style={{
                fontSize: "1.0625rem",
                color: "#4a5568",
                lineHeight: 1.75
              }}
            >
              At Pawsitive, we believe that technology and love can come together to give your pet the best life possible.
              Our AI-powered platform helps you understand your pet's unique needs and provides personalized care plans
              that keep them healthy and happy.
            </p>
            <p
              className="mb-10 leading-relaxed"
              style={{
                fontSize: "1.0625rem",
                color: "#4a5568",
                lineHeight: 1.75
              }}
            >
              Join thousands of pet parents who trust Pawsitive to help them raise healthier, happier furry companions.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "AI", label: "Powered" },
                { value: "24/7", label: "Tracking" },
                { value: "100%", label: "Personalized" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING, delay: 0.1 * i }}
                  className="text-center"
                >
                  <div
                    className="font-bold mb-1"
                    style={{
                      fontSize: "1.5rem",
                      color: "#4a9068",
                      letterSpacing: "-0.02em"
                    }}
                  >
                    {item.value}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#718096", fontWeight: 500 }}>
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
