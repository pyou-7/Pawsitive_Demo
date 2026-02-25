"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useParams } from "next/navigation";

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

interface Pet {
  id: string;
  name: string;
  breed: string | null;
  weightLbs: number | null;
  ageYears: number | null;
  photoUrl: string | null;
  currentStreak: number;
  activityLogs: Array<{
    id: string;
    activityType: string;
    value: number;
    notes: string | null;
    loggedAt: string;
  }>;
  carePlans: Array<{
    id: string;
    date: string;
    targetExerciseMins: number;
    targetCalories: number;
    aiInsightText: string | null;
    status: string;
  }>;
}

export default function PetDetail() {
  const { owner, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const petId = params.id as string;

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingActivity, setLoggingActivity] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Activity Logging Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [activeLogType, setActiveLogType] = useState<"WALK" | "MEAL" | "SYMPTOM_CHECK" | null>(null);
  const [logValue, setLogValue] = useState("");
  const [logNotes, setLogNotes] = useState("");

  useEffect(() => {
    if (!authLoading && !owner) {
      router.push("/");
      return;
    }

    if (owner && petId) {
      fetchPet();
    }
  }, [owner, authLoading, petId, router]);

  const fetchPet = async () => {
    try {
      const res = await fetch(`/api/pets/${petId}`, {
        headers: { "x-owner-id": owner!.id },
      });
      const data = await res.json();
      setPet(data.pet);
    } catch (error) {
      console.error("Failed to fetch pet:", error);
    } finally {
      setLoading(false);
    }
  };

  const openLogModal = (type: "WALK" | "MEAL" | "SYMPTOM_CHECK") => {
    setActiveLogType(type);
    setLogValue("");
    setLogNotes("");
    setIsLogModalOpen(true);
  };

  const submitActivityLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner || !activeLogType || !logValue) return;

    setLoggingActivity(true);
    try {
      const res = await fetch("/api/activity-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-owner-id": owner.id,
        },
        body: JSON.stringify({
          petId,
          activityType: activeLogType,
          value: parseFloat(logValue),
          notes: logNotes
        }),
      });

      if (res.ok) {
        setIsLogModalOpen(false);
        fetchPet();
      }
    } catch (error) {
      console.error("Failed to log activity:", error);
    } finally {
      setLoggingActivity(false);
    }
  };

  const generateCarePlan = async () => {
    if (!owner) return;
    setGeneratingPlan(true);
    try {
      const res = await fetch("/api/care-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-owner-id": owner.id,
        },
        body: JSON.stringify({ petId }),
      });

      if (res.ok) {
        fetchPet();
      }
    } catch (error) {
      console.error("Failed to generate care plan:", error);
    } finally {
      setGeneratingPlan(false);
    }
  };

  if (authLoading || loading || !pet) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="w-16 h-16 border-4 border-[#4a9068] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F3" }}>
      {/* Header */}
      <header className="pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto flex items-start justify-between">
          <div>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-sm mb-6 transition-colors hover:text-[#4a9068]"
              style={{ color: "#4a5568" }}
            >
              ← Back to Dashboard
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className="flex items-center gap-6"
            >
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-sm"
                style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.04)" }}
              >
                {/* Fallback emoji if no photoUrl */}
                {pet.photoUrl ? (
                  <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover rounded-3xl" />
                ) : (
                  "🐕"
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-1 tracking-tight" style={{ color: "#1a1a2e", fontFamily: "var(--font-serif)" }}>
                  {pet.name}
                </h1>
                <p className="text-lg" style={{ color: "#4a5568" }}>
                  {pet.breed || "Unknown breed"} • {pet.ageYears ? `${pet.ageYears} years` : ""} {pet.weightLbs ? `• ${pet.weightLbs} lbs` : ""}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm" style={{ backgroundColor: "#4a9068", color: "#fff" }}>
                    🔥 {pet.currentStreak} day streak
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className="px-5 py-2.5 rounded-full font-semibold text-sm shadow-sm transition-colors border"
            style={{
              backgroundColor: "#fff",
              color: "#e53e3e",
              borderColor: "#fed7d7"
            }}
          >
            Log Out
          </motion.button>
        </div>
      </header>

      {/* Quick Actions */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <ActivityButton
              emoji="🚶"
              label="Log Walk"
              color="#4a9068"
              onClick={() => openLogModal("WALK")}
              loading={false}
            />
            <ActivityButton
              emoji="🍖"
              label="Log Meal"
              color="#d97b3d"
              onClick={() => openLogModal("MEAL")}
              loading={false}
            />
            <ActivityButton
              emoji="🩺"
              label="Check Health"
              color="#5a9a7a"
              onClick={() => openLogModal("SYMPTOM_CHECK")}
              loading={false}
            />
          </div>
        </div>
      </section>

      {/* Care Plan */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: "#1a1a2e" }}>Today's Care Plan</h2>
            <button
              onClick={generateCarePlan}
              disabled={generatingPlan}
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: generatingPlan ? "#9ca3af" : "#4a9068", color: "#fff" }}
            >
              {generatingPlan ? "Generating..." : "✨ Generate AI Plan"}
            </button>
          </div>

          {generatingPlan ? (
            <div className="p-8 rounded-3xl border border-[#4a9068]/20 flex flex-col items-center justify-center min-h-[250px] space-y-4" style={{ backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}>
              <div className="w-12 h-12 border-4 border-[#4a9068]/30 border-t-[#4a9068] rounded-full animate-spin"></div>
              <p className="text-[#4a9068] font-medium animate-pulse">Gemini 2.0 is analyzing activity logs...</p>
            </div>
          ) : pet.carePlans[0] ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className="p-8 rounded-3xl shadow-sm border border-black/5 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,253,244,0.95))", backdropFilter: "blur(12px)" }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4a9068]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="grid grid-cols-2 gap-8 mb-8 relative z-10">
                <div className="bg-white/60 p-5 rounded-2xl border border-[#4a9068]/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🏃</span>
                    <div className="text-sm font-bold text-[#4a5568]">Target Exercise</div>
                  </div>
                  <div className="text-4xl font-extrabold tracking-tight" style={{ color: "#4a9068" }}>
                    {pet.carePlans[0].targetExerciseMins} <span className="text-lg font-medium text-[#4a5568]/60 tracking-normal">mins</span>
                  </div>
                </div>

                <div className="bg-white/60 p-5 rounded-2xl border border-[#d97b3d]/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🍲</span>
                    <div className="text-sm font-bold text-[#4a5568]">Target Calories</div>
                  </div>
                  <div className="text-4xl font-extrabold tracking-tight" style={{ color: "#d97b3d" }}>
                    {pet.carePlans[0].targetCalories} <span className="text-lg font-medium text-[#4a5568]/60 tracking-normal">kcal</span>
                  </div>
                </div>
              </div>

              {pet.carePlans[0].aiInsightText && (
                <div className="p-5 rounded-2xl relative z-10" style={{ backgroundColor: "#f0fdf4", border: "1px solid rgba(74,144,104,0.15)" }}>
                  <div className="flex items-start gap-3">
                    <div className="text-xl mt-0.5">💡</div>
                    <div>
                      <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: "#2A5C41" }}>Gemini Insight</div>
                      <p className="text-[1.05rem] leading-relaxed" style={{ color: "#2d3748" }}>{pet.carePlans[0].aiInsightText}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="p-12 text-center rounded-3xl border border-black/5" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">No Care Plan Yet</h3>
              <p style={{ color: "#4a5568" }}>Click Generate AI Plan to get today's personalized recommendations based on recent activity.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1a1a2e" }}>Recent Activity</h2>

          {pet.activityLogs.length > 0 ? (
            <div className="space-y-3">
              {pet.activityLogs.slice(0, 10).map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...SPRING, delay: i * 0.05 }}
                  className="p-5 rounded-2xl flex items-center gap-5 border border-black/5 shadow-sm hover:shadow-md transition-shadow"
                  style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                    style={{
                      backgroundColor: log.activityType === "WALK" ? "#f0fdf4" :
                        log.activityType === "MEAL" ? "#fff7ed" : "#f0f9ff"
                    }}
                  >
                    {log.activityType === "WALK" ? "🚶" : log.activityType === "MEAL" ? "🍖" : "🩺"}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg" style={{ color: "#1a1a2e" }}>
                      {log.activityType === "WALK" ? `${log.value} min walk` :
                        log.activityType === "MEAL" ? `${log.value} cup(s)` :
                          `Health score: ${log.value}/10`}
                    </div>
                    {log.notes && (
                      <div className="text-sm font-medium mt-0.5" style={{ color: "#4a5568" }}>{log.notes}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: "#4a5568" }}>
                      {new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs font-medium mt-0.5" style={{ color: "#9ca3af" }}>
                      {new Date(log.loggedAt).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center rounded-3xl border border-black/5" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">No Activities Logged</h3>
              <p style={{ color: "#4a5568" }}>Your pet's activity history will appear here. Start tracking above!</p>
            </div>
          )}
        </div>
      </section>

      {/* Activity Log Modal */}
      {isLogModalOpen && activeLogType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsLogModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#1a1a2e]" style={{ fontFamily: "var(--font-serif)" }}>
                {activeLogType === "WALK" ? "Log Walk 🚶" : activeLogType === "MEAL" ? "Log Meal 🍖" : "Health Check 🩺"}
              </h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitActivityLog} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {activeLogType === "WALK" ? "Duration (minutes)" : activeLogType === "MEAL" ? "Amount (cups/portions)" : "Health Score (1-10)"}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  value={logValue}
                  onChange={(e) => setLogValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a9068]"
                  placeholder={activeLogType === "WALK" ? "e.g. 30" : activeLogType === "MEAL" ? "e.g. 1.5" : "e.g. 10"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a9068] resize-none h-24"
                  placeholder={activeLogType === "WALK" ? "Where did you go?" : activeLogType === "MEAL" ? "What did they eat?" : "Any concerns?"}
                />
              </div>

              <button
                type="submit"
                disabled={loggingActivity || !logValue}
                className="w-full py-4 text-white font-bold rounded-xl transition-all shadow-md"
                style={{
                  backgroundColor: loggingActivity || !logValue ? "#9ca3af" : "#4a9068",
                }}
              >
                {loggingActivity ? "Saving..." : "Save Activity"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ActivityButton({ emoji, label, color, onClick, loading }: {
  emoji: string;
  label: string;
  color: string;
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING}
      onClick={onClick}
      disabled={loading}
      className="p-4 rounded-2xl flex flex-col items-center gap-2"
      style={{ backgroundColor: `${color}15`, border: `2px solid ${color}30` }}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-sm font-semibold" style={{ color }}>{label}</span>
    </motion.button>
  );
}
