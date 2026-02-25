"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function Navbar() {
  const { owner, loading, signInWithGithub, signOut, enableDemoMode } = useAuth();
  const router = useRouter();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={SPRING}
            className="flex items-center gap-3"
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center relative"
              style={{ backgroundColor: "#4a9068" }}
            >
              <svg className="w-6 h-6 text-[#2A5C41] transform -rotate-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 7.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM12 11c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm-6.5-1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm13 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
            </div>
            <span
              className="font-extrabold text-[1.35rem]"
              style={{
                fontFamily: "var(--font-nunito, nunito, sans-serif)",
                color: "#1a1a2e",
                letterSpacing: "-0.02em"
              }}
            >
              Pawsitive
            </span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            {["Features", "How It Works", "Testimonials"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="relative font-bold text-[0.85rem] transition-colors hover:text-[#4a9068]"
                style={{ color: "#64748b" }}
              >
                <span className="relative z-10">{item}</span>
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 -bottom-1.5 w-full h-0.5 rounded-full"
                  style={{ background: "#4a9068", opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={SPRING}
                />
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={SPRING}
            className="flex items-center gap-4"
          >
            {loading ? (
              <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : owner ? (
              // Logged in state
              <div className="flex items-center gap-4">
                <span
                  className="font-medium text-sm"
                  style={{ color: "#4a5568" }}
                >
                  Hi, {owner.name?.split(" ")[0] || "there"}! 🐾
                </span>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={SPRING}
                  onClick={signOut}
                  className="font-semibold text-white rounded-full"
                  style={{
                    backgroundColor: "#4a9068",
                    padding: "0.6rem 1.4rem",
                    fontSize: "0.85rem",
                    border: "none"
                  }}
                >
                  Sign Out
                </motion.button>
              </div>
            ) : (
              // Logged out state
              <>
                <button
                  onClick={async () => { await enableDemoMode(); router.push('/dashboard'); }}
                  className="text-[0.7rem] font-medium transition-colors hover:text-[#4a9068] mr-2"
                  style={{ color: "#9ca3af" }}
                >
                  Judge Demo
                </button>
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={SPRING}
                  onClick={signInWithGithub}
                  className="font-bold text-[0.85rem] transition-colors hover:text-[#4a9068]"
                  style={{ color: "#64748b" }}
                >
                  Log In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={SPRING}
                  onClick={signInWithGithub}
                  className="font-bold text-white rounded-full"
                  style={{
                    backgroundColor: "#4a9068",
                    padding: "0.6rem 1.4rem",
                    fontSize: "0.85rem",
                    border: "none"
                  }}
                >
                  Get Started
                </motion.button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
