"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import StreakCounter from "@/components/StreakCounter";
import Mascot from "@/components/Mascot";

const ACTIVITIES = [
  { id: "quiz", title: "Quiz Time", icon: "🧠", time: "2 min", color: "from-sky-200 to-sky-100 border-sky-300" },
  { id: "words", title: "New Words", icon: "📚", time: "2 min", color: "from-green-200 to-green-100 border-green-300" },
  { id: "game", title: "Memory Game", icon: "🃏", time: "3 min", color: "from-amber-200 to-amber-100 border-amber-300" },
  { id: "video", title: "Video Time", icon: "🎬", time: "2 min", color: "from-pink-200 to-pink-100 border-pink-300" },
  { id: "funfacts", title: "Fun Facts", icon: "🌍", time: "2 min", color: "from-teal-200 to-teal-100 border-teal-300" },
  { id: "review", title: "Brain Challenge", icon: "💡", time: "2 min", color: "from-purple-200 to-purple-100 border-purple-300" },
];

export default function Dashboard() {
  const router = useRouter();
  const { profile, setProfile } = useSession();
  const [nameInput, setNameInput] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!profile) {
      setShowNameModal(true);
    }
  }, [profile]);

  const handleSetName = () => {
    if (!nameInput.trim()) return;
    setProfile({
      name: nameInput.trim(),
      createdAt: new Date().toISOString(),
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: "",
      totalSessions: 0,
    });
    setShowNameModal(false);
  };

  if (!mounted) return null;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto">
      {/* Name modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-bounce-in">
            <div className="text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold text-purple-700 mb-2">Welcome to BrainSpark!</h2>
              <p className="text-gray-600 mb-6">What&apos;s your name?</p>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetName()}
                placeholder="Type your name..."
                className="w-full text-center text-2xl font-bold text-purple-700 border-2 border-purple-200 rounded-2xl p-4 mb-4 focus:outline-none focus:border-purple-500"
                autoFocus
              />
              <button
                onClick={handleSetName}
                disabled={!nameInput.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-2xl py-4 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all active:scale-95 shadow-lg"
              >
                Let&apos;s Go! 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Mascot
            expression="happy"
            message={`${greeting()}, ${profile?.name || "friend"}! Pick any activity!`}
          />
        </div>
        <StreakCounter streak={profile?.currentStreak || 0} />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-black text-purple-800 mb-2">Pick an Activity</h1>
      <p className="text-gray-600 mb-6">Play anything you like, as many times as you want!</p>

      {/* Activity cards */}
      <div className="flex flex-col gap-4">
        {ACTIVITIES.map((activity) => (
          <button
            key={activity.id}
            onClick={() => router.push(`/${activity.id}`)}
            className={`bg-gradient-to-r ${activity.color} border-2 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{activity.icon}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.time}</p>
              </div>
              <span className="text-2xl">▶️</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
