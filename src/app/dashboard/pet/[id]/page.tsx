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
  const { owner, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const petId = params.id as string;
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingActivity, setLoggingActivity] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);

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

  const logActivity = async (activityType: string, value: number, notes: string) => {
    if (!owner) return;
    setLoggingActivity(true);
    try {
      const res = await fetch("/api/activity-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-owner-id": owner.id,
        },
        body: JSON.stringify({ petId, activityType, value, notes }),
      });
      
      if (res.ok) {
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
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm mb-6"
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
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
              style={{ backgroundColor: "#f0fdf4" }}
            >
              🐕
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1" style={{ color: "#1a1a2e", fontFamily: "var(--font-serif)" }}>
                {pet.name}
              </h1>
              <p style={{ color: "#4a5568" }}>
                {pet.breed || "Unknown breed"} • {pet.ageYears ? `${pet.ageYears} years` : ""} {pet.weightLbs ? `• ${pet.weightLbs} lbs` : ""}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: "#4a9068", color: "#fff" }}>
                  🔥 {pet.currentStreak} day streak
                </span>
              </div>
            </div>
          </motion.div>
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
              onClick={() => logActivity("WALK", 30, "Morning walk")}
              loading={loggingActivity}
            />
            <ActivityButton
              emoji="🍖"
              label="Log Meal"
              color="#d97b3d"
              onClick={() => logActivity("MEAL", 1, "Dinner")}
              loading={loggingActivity}
            />
            <ActivityButton
              emoji="🩺"
              label="Check Health"
              color="#5a9a7a"
              onClick={() => logActivity("SYMPTOM_CHECK", 1, "Daily check")}
              loading={loggingActivity}
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

          {pet.carePlans[0] ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className="p-6 rounded-2xl"
              style={{ backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}
            >
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <div className="text-3xl font-bold" style={{ color: "#4a9068" }}>{pet.carePlans[0].targetExerciseMins}</div>
                  <div className="text-sm" style={{ color: "#4a5568" }}>Target Exercise (mins)</div>
                </div>
                <div>
                  <div className="text-3xl font-bold" style={{ color: "#d97b3d" }}>{pet.carePlans[0].targetCalories}</div>
                  <div className="text-sm" style={{ color: "#4a5568" }}>Target Calories</div>
                </div>
              </div>
              {pet.carePlans[0].aiInsightText && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: "#f0fdf4" }}>
                  <div className="text-sm font-semibold mb-1" style={{ color: "#4a9068" }}>💡 AI Insight</div>
                  <p className="text-sm" style={{ color: "#4a5568" }}>{pet.carePlans[0].aiInsightText}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="p-8 text-center rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
              <div className="text-4xl mb-2">🤖</div>
              <p style={{ color: "#4a5568" }}>No care plan yet. Generate one with AI!</p>
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
                  className="p-4 rounded-xl flex items-center gap-4"
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ 
                      backgroundColor: log.activityType === "WALK" ? "#f0fdf4" : 
                                     log.activityType === "MEAL" ? "#fff7ed" : "#f0f9ff" 
                    }}
                  >
                    {log.activityType === "WALK" ? "🚶" : log.activityType === "MEAL" ? "🍖" : "🩺"}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold" style={{ color: "#1a1a2e" }}>
                      {log.activityType === "WALK" ? `${log.value} min walk` : 
                       log.activityType === "MEAL" ? `${log.value} meal(s)` : 
                       "Health check"}
                    </div>
                    {log.notes && (
                      <div className="text-sm" style={{ color: "#4a5568" }}>{log.notes}</div>
                    )}
                  </div>
                  <div className="text-sm" style={{ color: "#9ca3af" }}>
                    {new Date(log.loggedAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
              <div className="text-4xl mb-2">📝</div>
              <p style={{ color: "#4a5568" }}>No activities logged yet. Start tracking!</p>
            </div>
          )}
        </div>
      </section>
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
