"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

interface Pet {
  id: string;
  name: string;
  breed: string | null;
  weightLbs: number | null;
  ageYears: number | null;
  photoUrl: string | null;
  currentStreak: number;
}

interface Stats {
  owner: { id: string; email: string; name: string | null; xpBalance: number };
  totalPets: number;
  petStats: Array<{ id: string; name: string; currentStreak: number; recentActivities: number }>;
  activityByDay: Array<{ date: string; count: number; walks: number; meals: number }>;
}

export default function Dashboard() {
  const { owner, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !owner) {
      router.push("/");
      return;
    }

    if (owner) {
      fetchData();
    }
  }, [owner, authLoading, router]);

  const fetchData = async () => {
    try {
      const [petsRes, statsRes] = await Promise.all([
        fetch("/api/pets", { headers: { "x-owner-id": owner!.id } }),
        fetch("/api/owner/stats", { headers: { "x-owner-id": owner!.id } }),
      ]);

      const petsData = await petsRes.json();
      const statsData = await statsRes.json();

      setPets(petsData.pets || []);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4a9068] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: "#4a5568" }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!owner) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F3" }}>
      {/* Header */}
      <header className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
          >
            <h1 className="text-4xl font-bold mb-3 tracking-tight" style={{ color: "#1a1a2e", fontFamily: "var(--font-serif)" }}>
              Welcome back, {owner.name?.split(" ")[0] || "there"}! 🐾
            </h1>
            <p className="text-lg" style={{ color: "#4a5568" }}>Track your furry friend's health and happiness</p>
          </motion.div>

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

      {/* Stats Cards */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.1 }}
              className="p-6 rounded-2xl"
              style={{ backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}
            >
              <div className="text-3xl font-bold" style={{ color: "#4a9068" }}>{owner.xpBalance}</div>
              <div className="text-sm" style={{ color: "#4a5568" }}>XP Points</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.15 }}
              className="p-6 rounded-2xl"
              style={{ backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}
            >
              <div className="text-3xl font-bold" style={{ color: "#4a9068" }}>{pets.length}</div>
              <div className="text-sm" style={{ color: "#4a5568" }}>Pets</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.2 }}
              className="p-6 rounded-2xl"
              style={{ backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}
            >
              <div className="text-3xl font-bold" style={{ color: "#4a9068" }}>
                {stats?.petStats.reduce((acc, p) => acc + p.currentStreak, 0) || 0}
              </div>
              <div className="text-sm" style={{ color: "#4a5568" }}>Day Streak</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.25 }}
              className="p-6 rounded-2xl"
              style={{ backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}
            >
              <div className="text-3xl font-bold" style={{ color: "#4a9068" }}>
                {stats?.activityByDay.reduce((acc, d) => acc + d.count, 0) || 0}
              </div>
              <div className="text-sm" style={{ color: "#4a5568" }}>Activities (7d)</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pets Section */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: "#1a1a2e" }}>Your Pets</h2>
            <Link
              href="/dashboard/add-pet"
              className="px-4 py-2 rounded-full text-white font-semibold text-sm"
              style={{ backgroundColor: "#4a9068" }}
            >
              + Add Pet
            </Link>
          </div>

          {pets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center rounded-3xl"
              style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
            >
              <div className="text-6xl mb-4">🐕</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#1a1a2e" }}>
                No pets yet!
              </h3>
              <p className="mb-4" style={{ color: "#4a5568" }}>
                Add your first furry friend to start tracking their health
              </p>
              <Link
                href="/dashboard/add-pet"
                className="inline-block px-6 py-3 rounded-full text-white font-semibold"
                style={{ backgroundColor: "#4a9068" }}
              >
                Add Your First Pet
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet, index) => (
                <PetCard key={pet.id} pet={pet} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Activity Chart */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-6" style={{ color: "#1a1a2e" }}>Weekly Activity</h2>
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}
          >
            <div className="flex items-end justify-between h-40 gap-2">
              {stats?.activityByDay.map((day, i) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(day.count * 20, 10)}px` }}
                    transition={{ ...SPRING, delay: i * 0.05 }}
                    className="w-full rounded-t-lg"
                    style={{ backgroundColor: day.count > 0 ? "#4a9068" : "#e2e8f0" }}
                  />
                  <span className="text-xs mt-2" style={{ color: "#4a5568" }}>
                    {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PetCard({ pet, index }: { pet: Pet; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl"
      style={{ backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: "#f0fdf4" }}
        >
          🐕
        </div>
        <div>
          <h3 className="font-bold" style={{ color: "#1a1a2e" }}>{pet.name}</h3>
          <p className="text-sm" style={{ color: "#4a5568" }}>{pet.breed || "Unknown breed"}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div>
          <div className="text-lg font-bold" style={{ color: "#4a9068" }}>{pet.currentStreak}</div>
          <div className="text-xs" style={{ color: "#4a5568" }}>Streak</div>
        </div>
        <div>
          <div className="text-lg font-bold" style={{ color: "#4a9068" }}>{pet.weightLbs || "-"}</div>
          <div className="text-xs" style={{ color: "#4a5568" }}>lbs</div>
        </div>
        <div>
          <div className="text-lg font-bold" style={{ color: "#4a9068" }}>{pet.ageYears || "-"}</div>
          <div className="text-xs" style={{ color: "#4a5568" }}>yrs</div>
        </div>
      </div>

      <Link
        href={`/dashboard/pet/${pet.id}`}
        className="block w-full py-2 rounded-xl text-center text-sm font-semibold"
        style={{ backgroundColor: "#4a9068", color: "#fff" }}
      >
        View Dashboard
      </Link>
    </motion.div>
  );
}
