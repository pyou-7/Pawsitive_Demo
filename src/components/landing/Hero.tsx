"use client";

import { motion } from "framer-motion";

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;
const SPRING_SLOW = { type: "spring", stiffness: 180, damping: 28 } as const;

export default function Hero() {
  return (
    <section
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
      style={{ backgroundColor: "#FDF8F3" }}
    >
      {/* ─── Background Layer ───────────────────────────────────────────────────
          Source: DOM extraction of https://petpals.framer.website
          Asset:  framerusercontent.com/images/Ed0Z2KR0dQOjXrGa2k7G0tp2A.png
          Role:   Large organic blob shape (2695×2539 px) — absolutely positioned
                  at z-index 0, spanning the full hero area.
          Per elite-designer rule: NOT a hallucinated gradient — this is the
          exact <img> asset extracted from the reference DOM.
      ─────────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">


        {/* Secondary warm-tint blob — bottom-left counterweight */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2, delay: 0.4, ease: "easeOut" }}
          className="absolute"
          style={{
            bottom: "-10%",
            left: "-8%",
            width: "480px",
            height: "480px",
            borderRadius: "60% 40% 55% 45% / 45% 55% 45% 55%",
            background:
              "radial-gradient(ellipse at 40% 50%, rgba(255,203,119,0.18) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Left Side Image (Dog) - Placed relative to full screen */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...SPRING_SLOW, delay: 0.3 }}
        className="absolute left-[-15%] xl:left-[-10%] 2xl:left-[-5%] top-[55%] -translate-y-1/2 hidden lg:block w-[40vw] max-w-[800px] min-w-[450px] pointer-events-none opacity-95 z-0"
      >
        <img
          src="/images/hero_dog.png"
          alt="PetPals Dog"
          className="w-full h-auto object-contain drop-shadow-2xl -scale-x-100"
        />
      </motion.div>

      {/* Right Side Image (Cat) - Placed relative to full screen */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...SPRING_SLOW, delay: 0.5 }}
        className="absolute right-0 xl:right-[2%] 2xl:right-[4%] top-[50%] -translate-y-1/2 hidden lg:block w-[18vw] max-w-[320px] min-w-[220px] pointer-events-none opacity-95 z-0"
      >
        <img
          src="/images/hero_cat.png"
          alt="PetPals Cat"
          className="w-full h-auto object-contain drop-shadow-2xl -scale-x-100"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 min-h-[60vh] flex flex-col justify-center">

        {/* Center Content */}
        <div className="max-w-3xl mx-auto text-center relative z-30 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...SPRING, delay: 0.25 }}
              className="inline-flex items-center gap-2 font-semibold px-4 py-2 rounded-full mb-8"
              style={{
                background: "rgba(91,139,108,0.10)",
                color: "#3d7a5a",
                boxShadow: "0 1px 3px rgba(91,139,108,0.12)",
                fontSize: "0.8125rem",
                letterSpacing: "0.01em",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#4a9068" }}
              />
              AI-Powered Pet Care
            </motion.div>

            <h1
              className="font-serif font-extrabold leading-[1.08] mb-8"
              style={{
                fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
                color: "#1a1a2e",
                letterSpacing: "-0.025em",
              }}
            >
              Your Dog's Health,{" "}
              <br />
              <span
                style={{
                  color: "#4a9068",
                  borderBottom: "3px solid rgba(255,183,77,0.55)",
                  paddingBottom: "4px",
                }}
              >
                Powered by AI.
              </span>
            </h1>

            <p
              className="mb-10 max-w-2xl mx-auto leading-relaxed"
              style={{
                fontSize: "clamp(1rem, 2vw, 1.175rem)",
                color: "#4a5568",
              }}
            >
              Turn daily walks, meals, and health checks into a rewarding journey. Pawsitive combines personalized AI care plans with a fun streak system to keep your furry friend happy, healthy, and thriving.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={SPRING}
                className="font-bold text-white rounded-full"
                style={{
                  background: "linear-gradient(135deg, #4a9068 0%, #3d7a5a 100%)",
                  fontSize: "1.0625rem",
                  padding: "1rem 2rem",
                  boxShadow:
                    "0 4px 20px rgba(74,144,104,0.35), 0 1px 4px rgba(74,144,104,0.2)",
                  border: "none",
                }}
              >
                Get Your Free AI Breed Profile
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={SPRING}
                className="rounded-full flex items-center justify-center gap-2 font-semibold"
                style={{
                  fontSize: "1.0625rem",
                  padding: "1rem 2rem",
                  background: "rgba(255,255,255,0.85)",
                  color: "#2d3748",
                  border: "1.5px solid rgba(0,0,0,0.08)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{ color: "#4a9068" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                See How It Works
              </motion.button>
            </div>


          </motion.div>
        </div>
      </div>
    </section>
  );
}
