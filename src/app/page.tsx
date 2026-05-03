"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import StreakCounter from "@/components/StreakCounter";
import Mascot from "@/components/Mascot";

const ACTIVITIES = [
  { id: "quiz", title: "Quiz Time", icon: "🧠", color: "from-sky-300 to-sky-100", border: "border-sky-400" },
  { id: "words", title: "New Words", icon: "📚", color: "from-green-300 to-green-100", border: "border-green-400" },
  { id: "game", title: "Memory Game", icon: "🃏", color: "from-amber-300 to-amber-100", border: "border-amber-400" },
  { id: "unblock", title: "Unblock Me", icon: "🧩", color: "from-red-300 to-red-100", border: "border-red-400" },
  { id: "maze", title: "Maze Puzzle", icon: "🗺️", color: "from-violet-300 to-violet-100", border: "border-violet-400" },
  { id: "explorer", title: "World Explorer", icon: "🌎", color: "from-orange-300 to-orange-100", border: "border-orange-400" },
  { id: "funfacts", title: "Fun Facts", icon: "🌍", color: "from-teal-300 to-teal-100", border: "border-teal-400" },
  { id: "review", title: "Brain Challenge", icon: "💡", color: "from-purple-300 to-purple-100", border: "border-purple-400" },
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
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
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
        <Mascot
          expression="happy"
          message={`${greeting()}, ${profile?.name || "friend"}!`}
        />
        <StreakCounter streak={profile?.currentStreak || 0} />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-black text-purple-800 mb-1">Pick an Activity</h1>
      <p className="text-gray-600 mb-6">Play anything you like!</p>

      {/* Square grid */}
      <div className="grid grid-cols-2 gap-4">
        {ACTIVITIES.map((activity) => (
          <button
            key={activity.id}
            onClick={() => router.push(`/${activity.id}`)}
            className={`bg-gradient-to-br ${activity.color} ${activity.border} border-2 rounded-3xl p-4 aspect-square flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:shadow-xl hover:scale-[1.04] active:scale-[0.96] shadow-md`}
          >
            <span className="text-6xl">{activity.icon}</span>
            <span className="text-lg font-bold text-gray-800 leading-tight text-center">{activity.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
