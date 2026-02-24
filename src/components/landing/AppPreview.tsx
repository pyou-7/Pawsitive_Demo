"use client";

import { motion } from "framer-motion";

const SPRING = { type: "spring", stiffness: 280, damping: 28 } as const;

export default function AppPreview() {
    return (
        <section className="py-24 bg-white relative overflow-hidden" id="app-preview">
            {/* Decorative Background Element */}
            <div
                className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none"
                style={{
                    background: "radial-gradient(circle at 80% 20%, rgba(13,148,136,0.08) 0%, transparent 60%)"
                }}
            />

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
                            background: "rgba(249,115,22,0.1)",
                            color: "#c25e13",
                            fontSize: "0.875rem"
                        }}
                    >
                        Inside the App
                    </motion.div>
                    <h2
                        className="font-bold mb-6"
                        style={{
                            fontFamily: "var(--font-serif, serif)",
                            fontSize: "clamp(2rem, 5vw, 3rem)",
                            color: "#1a1a2e",
                            letterSpacing: "-0.02em"
                        }}
                    >
                        Everything your dog needs.<br />All in one place.
                    </h2>
                    <p
                        className="max-w-2xl mx-auto leading-relaxed"
                        style={{ fontSize: "1.125rem", color: "#64748b" }}
                    >
                        From AI breed detection to daily streak tracking, Pawsitive makes managing your pet's health fun and effortless.
                    </p>
                </motion.div>

                {/* Bento Grid layout for App Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Feature 1: AI Breed Profile - Spans 2 cols on Desktop */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ ...SPRING, delay: 0.1 }}
                        className="lg:col-span-2 rounded-[2rem] overflow-hidden relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-slate-100 group"
                        style={{ backgroundColor: "#F8FAFC" }}
                    >
                        <div className="flex-1 w-full relative z-10">
                            <div
                                className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)", color: "white" }}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "var(--font-serif, serif)" }}>
                                AI Breed Detection
                            </h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Just snap a quick photo. Our AI instantly recognizes your dog's breed and builds a personalized daily care plan based on their specific genetic needs, age, and weight.
                            </p>
                            <ul className="space-y-3">
                                {['Custom diet targets', 'Breed-specific exercise goals', 'Genetic health warnings'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                        <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Mock UI Element */}
                        <div className="w-full md:w-[280px] h-[320px] rounded-[2rem] bg-white shadow-2xl overflow-hidden border-4 border-slate-50 relative group-hover:-translate-y-2 transition-transform duration-500">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-100">
                                <img src="/images/golden_retriever_scan.png" alt="Scanning dog" className="w-full h-full object-cover" />
                                {/* Scanner line animation overlay */}
                                <motion.div
                                    animate={{ y: ["0%", "200%", "0%"] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute top-0 left-0 w-full h-[2px] bg-teal-400 shadow-[0_0_8px_2px_rgba(45,212,191,0.5)]"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-1/2 p-5 flex flex-col justify-center">
                                <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Scan Complete</div>
                                <div className="font-bold text-xl text-slate-800 mb-4">Golden Retriever</div>
                                <div className="w-full h-2 bg-slate-100 rounded-full mb-2 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: "98%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-teal-500 rounded-full" />
                                </div>
                                <div className="text-xs text-slate-500 mb-4 flex justify-between">
                                    <span>Confidence</span>
                                    <span className="font-semibold text-slate-700">98.4%</span>
                                </div>
                                <button className="w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold">Generate Care Plan</button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 2: GPS Walk Tracking */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ ...SPRING, delay: 0.2 }}
                        className="rounded-[2rem] p-8 md:p-10 flex flex-col shadow-sm border border-slate-100 group overflow-hidden relative"
                        style={{ backgroundColor: "#FDF8F3" }}
                    >
                        <div
                            className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center relative z-10"
                            style={{ background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)", color: "white" }}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10" style={{ fontFamily: "var(--font-serif, serif)" }}>
                            GPS Walk Logging
                        </h3>
                        <p className="text-slate-600 leading-relaxed mb-8 relative z-10">
                            Automatically track your routes, distance, and active minutes. Watch your daily rings close and build healthy exercise streaks.
                        </p>

                        <div className="mt-auto relative w-full aspect-square max-h-[220px] mx-auto group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-x-4 inset-y-0 rounded-t-3xl bg-white shadow-xl border-x-4 border-t-4 border-slate-50 overflow-hidden flex flex-col p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">🐕</div>
                                    <div>
                                        <div className="text-xs text-slate-500 font-medium">Morning Walk</div>
                                        <div className="text-sm font-bold text-slate-800">1.2 miles</div>
                                    </div>
                                    <div className="ml-auto text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">+50 XP</div>
                                </div>
                                {/* Mock Map Map */}
                                <div className="flex-1 w-full bg-slate-100 rounded-xl relative overflow-hidden">
                                    <svg className="absolute inset-0 w-full h-full text-blue-200" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <path d="M-10,50 Q20,20 50,50 T110,50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                        <circle cx="50" cy="50" r="4" fill="#3B82F6" className="animate-pulse" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 3: Daily Health Log */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ ...SPRING, delay: 0.3 }}
                        className="rounded-[2rem] p-8 md:p-10 flex flex-col shadow-sm border border-slate-100 group"
                        style={{ backgroundColor: "#F4EEE8" }}
                    >
                        <div
                            className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)", color: "white" }}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "var(--font-serif, serif)" }}>
                            Smart Poop & Diet Logs
                        </h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Track meals, symptoms, and poop quality. Catch health issues early before they become expensive vet bills.
                        </p>
                        <div className="mt-auto space-y-3">
                            {[
                                { icon: "🥩", label: "Morning Meal", time: "8:00 AM", status: "Given" },
                                { icon: "💩", label: "Poop Check", time: "8:30 AM", status: "Healthy" },
                                { icon: "💊", label: "Heartworm Med", time: "Pending", status: "Due Today" },
                            ].map((log, i) => (
                                <div key={i} className="bg-white p-3 rounded-xl flex items-center gap-3 shadow-sm border border-white group-hover:border-slate-200 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg">{log.icon}</div>
                                    <div className="flex-1 flex flex-col">
                                        <span className="text-sm font-bold text-slate-800">{log.label}</span>
                                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{log.time}</span>
                                    </div>
                                    <div className={`text-xs font-semibold px-2 py-1 rounded-lg ${log.status === 'Healthy' || log.status === 'Given' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                        {log.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Feature 4: Rewards & Streaks - Spans 2 cols on Desktop */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ ...SPRING, delay: 0.4 }}
                        className="lg:col-span-2 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative group"
                        style={{ backgroundColor: "#F0F9FF" }}
                    >
                        {/* Background Confetti */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#3B82F6 2px, transparent 2px)", backgroundSize: "24px 24px" }} />

                        <div className="w-full md:w-1/2 relative space-y-6 z-10">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ background: "linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)", color: "white" }}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: "var(--font-serif, serif)" }}>
                                    Gamified Daily Streaks
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    Every healthy choice earns XP. Complete daily care rings, hit your walk streaks, and unlock exclusive badges and pet-store coupons in your digital wallet.
                                </p>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 flex justify-center relative z-10">
                            {/* Mock Gamification UI */}
                            <div className="w-full max-w-[320px] bg-white rounded-3xl p-6 shadow-xl border-2 border-blue-50 relative group-hover:scale-105 transition-transform duration-500">
                                <div className="text-center mb-6">
                                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Current Streak</div>
                                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 mb-2">14 Days</div>
                                    <div className="text-sm text-slate-600 font-medium">✨ You're on fire! Keep it up!</div>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${i < 4 ? 'bg-orange-100 text-orange-600' : i === 4 ? 'bg-orange-500 text-white shadow-md shadow-orange-200 ring-2 ring-orange-500 ring-offset-2' : 'bg-slate-100 text-slate-400'}`}>
                                                {i < 4 ? '✓' : i === 4 ? '🔥' : ''}
                                            </div>
                                            <span className="text-xs font-semibold text-slate-400">{day}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                                    <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center text-3xl shadow-inner">🏆</div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase">Next Reward</div>
                                        <div className="font-bold text-slate-800">10% Off Chewy</div>
                                        <div className="w-full h-1.5 bg-slate-200 mt-2 rounded-full overflow-hidden">
                                            <div className="w-[80%] h-full bg-yellow-400 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
