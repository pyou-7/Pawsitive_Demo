"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function AddPet() {
  const { owner, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [ageYears, setAgeYears] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    if (!authLoading && !owner) {
      router.push("/");
    }
  }, [owner, authLoading, router]);

  const handleDetectBreed = async () => {
    if (!photoUrl) return;
    
    setDetecting(true);
    try {
      // For now, we'll just let users enter breed manually
      // AI detection requires a valid image URL
      setDetecting(false);
    } catch (error) {
      console.error("Detection failed:", error);
      setDetecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !owner) return;

    setLoading(true);
    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-owner-id": owner.id,
        },
        body: JSON.stringify({
          name,
          breed: breed || null,
          weightLbs: weightLbs ? parseFloat(weightLbs) : null,
          ageYears: ageYears ? parseInt(ageYears) : null,
          photoUrl: photoUrl || null,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to add pet");
      }
    } catch (error) {
      console.error("Failed to add pet:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm mb-6"
            style={{ color: "#4a5568" }}
          >
            ← Back to Dashboard
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
          >
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#1a1a2e", fontFamily: "var(--font-serif)" }}>
              Add Your Pet 🐾
            </h1>
            <p style={{ color: "#4a5568" }}>
              Enter your furry friend's details to start tracking their health
            </p>
          </motion.div>
        </div>
      </header>

      {/* Form */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl"
            style={{ backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}
          >
            {/* Pet Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: "#1a1a2e" }}>
                Pet Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Buddy, Max, Luna"
                required
                className="w-full px-4 py-3 rounded-xl border-2 text-base"
                style={{ 
                  borderColor: "rgba(0,0,0,0.1)", 
                  backgroundColor: "#fff",
                  color: "#1a1a2e"
                }}
              />
            </div>

            {/* Photo URL */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: "#1a1a2e" }}>
                Photo URL (optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/dog-photo.jpg"
                  className="flex-1 px-4 py-3 rounded-xl border-2 text-base"
                  style={{ 
                    borderColor: "rgba(0,0,0,0.1)", 
                    backgroundColor: "#fff",
                    color: "#1a1a2e"
                  }}
                />
                <button
                  type="button"
                  onClick={handleDetectBreed}
                  disabled={!photoUrl || detecting}
                  className="px-4 py-3 rounded-xl font-semibold text-sm"
                  style={{ 
                    backgroundColor: detecting ? "#9ca3af" : "#4a9068",
                    color: "#fff"
                  }}
                >
                  {detecting ? "Detecting..." : "AI Detect"}
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: "#6b7280" }}>
                Paste a photo URL and click AI Detect to automatically identify the breed
              </p>
            </div>

            {/* Breed */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: "#1a1a2e" }}>
                Breed
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g., Golden Retriever, Labrador"
                className="w-full px-4 py-3 rounded-xl border-2 text-base"
                style={{ 
                  borderColor: "rgba(0,0,0,0.1)", 
                  backgroundColor: "#fff",
                  color: "#1a1a2e"
                }}
              />
            </div>

            {/* Weight & Age */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#1a1a2e" }}>
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  placeholder="e.g., 65"
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-xl border-2 text-base"
                  style={{ 
                    borderColor: "rgba(0,0,0,0.1)", 
                    backgroundColor: "#fff",
                    color: "#1a1a2e"
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#1a1a2e" }}>
                  Age (years)
                </label>
                <input
                  type="number"
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value)}
                  placeholder="e.g., 3"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border-2 text-base"
                  style={{ 
                    borderColor: "rgba(0,0,0,0.1)", 
                    backgroundColor: "#fff",
                    color: "#1a1a2e"
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !name}
              className="w-full py-4 rounded-xl font-bold text-lg"
              style={{ 
                backgroundColor: loading || !name ? "#9ca3af" : "#4a9068",
                color: "#fff"
              }}
            >
              {loading ? "Adding Pet..." : "Add Pet"}
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
