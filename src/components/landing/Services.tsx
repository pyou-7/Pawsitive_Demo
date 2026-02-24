"use client";

import { motion } from "framer-motion";

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

const features = [
  {
    icon: (
      <svg viewBox="0 0 64 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="65" rx="12" fill="url(#grad1)" />
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="64" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5a9a7a"/>
            <stop offset="1" stopColor="#3d7a5a"/>
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="12" stroke="white" strokeWidth="3" fill="none" />
        <path d="M32 28V32L36 36" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    title: "AI Breed Profile",
    description: "Instant AI-powered breed detection and personalized care recommendations based on your dog's unique needs."
  },
  {
    icon: (
      <svg viewBox="0 0 61 62" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="61" height="62" rx="12" fill="url(#grad2)" />
        <defs>
          <linearGradient id="grad2" x1="0" y1="0" x2="61" y2="62" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e8a86e"/>
            <stop offset="1" stopColor="#d97b3d"/>
          </linearGradient>
        </defs>
        <path d="M20 30H41V45C41 47.7614 38.7614 50 36 50H25C22.2386 50 20 47.7614 20 45V30Z" fill="white" />
        <rect x="26" y="22" width="9" height="12" rx="2" fill="#d97b3d" />
        <path d="M30 22V18M30 22C30 22 27 18 24 22M30 22C30 22 33 18 36 22" stroke="#d97b3d" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Daily Health Log",
    description: "Track meals, water intake, poop quality, and symptoms. Get AI insights into your pet's health trends."
  },
  {
    icon: (
      <svg viewBox="0 0 63 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="63" height="64" rx="12" fill="url(#grad3)" />
        <defs>
          <linearGradient id="grad3" x1="0" y1="0" x2="63" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5a9a7a"/>
            <stop offset="1" stopColor="#3d7a5a"/>
          </linearGradient>
        </defs>
        <path d="M20 40L28 32L36 40L44 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 44H48" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    title: "Activity Tracking",
    description: "Monitor walks, playtime, and exercise. Set daily goals and track progress with intuitive charts."
  },
  {
    icon: (
      <svg viewBox="0 0 60 61" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="61" rx="12" fill="url(#grad4)" />
        <defs>
          <linearGradient id="grad4" x1="0" y1="0" x2="60" y2="61" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e8a86e"/>
            <stop offset="1" stopColor="#d97b3d"/>
          </linearGradient>
        </defs>
        <path d="M30 15V35M30 15C33.3137 15 36 17.6863 36 21M30 15C26.6863 15 24 17.6863 24 21" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 45H40" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M25 35V45M35 35V45" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    title: "Streaks & XP System",
    description: "Stay motivated with gamified rewards. Earn XP for daily check-ins and maintain streaks for consistency."
  },
  {
    icon: (
      <svg viewBox="0 0 66 67" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="66" height="67" rx="12" fill="url(#grad5)" />
        <defs>
          <linearGradient id="grad5" x1="0" y1="0" x2="66" y2="67" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5a9a7a"/>
            <stop offset="1" stopColor="#3d7a5a"/>
          </linearGradient>
        </defs>
        <path d="M22 25H44V45C44 47.7614 41.7614 50 39 50H27C24.2386 50 22 47.7614 22 45V25Z" fill="white" />
        <rect x="28" y="18" width="10" height="10" rx="2" fill="#3d7a5a" />
        <path d="M33 18V15M33 15C33 15 30 12 27 15M33 15C33 15 36 12 39 15" stroke="#3d7a5a" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Care Plans",
    description: "Personalized AI-generated diet and exercise plans tailored to your dog's age, breed, and health conditions."
  },
  {
    icon: (
      <svg viewBox="0 0 64 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="65" rx="12" fill="url(#grad6)" />
        <defs>
          <linearGradient id="grad6" x1="0" y1="0" x2="64" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e8a86e"/>
            <stop offset="1" stopColor="#d97b3d"/>
          </linearGradient>
        </defs>
        <path d="M20 35C20 35 25 25 32 25C39 25 44 35 44 35" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M32 45V55" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M27 55H37" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    title: "Vet Reminders",
    description: "Never miss a vaccination or check-up. Smart reminders based on your pet's health history."
  }
];

export default function Services() {
  return (
    <section 
      id="features"
      className="py-24"
      style={{ backgroundColor: "#EAE4DC" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
          className="text-center mb-16"
        >
          <h2 
            className="font-bold mb-4"
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "#1a1a2e",
              letterSpacing: "-0.02em"
            }}
          >
            Our Pet Care Solutions
          </h2>
          <p 
            className="max-w-2xl mx-auto leading-relaxed"
            style={{ fontSize: "1.0625rem", color: "#4a5568" }}
          >
            Everything you need to keep your furry friend happy, healthy, and thriving.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: index * 0.08 }}
              whileHover={{ y: -6, transition: SPRING }}
              className="p-8 rounded-2xl flex gap-6"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03)"
              }}
            >
              <div className="w-12 h-12 flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 
                  className="font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-serif, serif)",
                    fontSize: "1.125rem",
                    color: "#1a1a2e"
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: "#5a6577", lineHeight: 1.65, fontSize: "0.9375rem" }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
