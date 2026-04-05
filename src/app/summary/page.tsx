"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import StarBurst from "@/components/StarBurst";
import { getStarRating } from "@/lib/scoring";

export default function SummaryPage() {
  const router = useRouter();
  const { session, profile, updateStreak } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    updateStreak();
  }, [updateStreak]);

  if (!mounted) return null;

  const quizStars = getStarRating(session.quizScore, 10);
  const reviewStars = getStarRating(session.reviewScore, 5);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <StarBurst />

      <div className="bg-white/90 rounded-3xl p-8 shadow-xl max-w-md w-full animate-bounce-in">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🏆</div>
          <h1 className="text-3xl font-black text-purple-700">Great Job Today!</h1>
          {profile && (
            <p className="text-gray-600 mt-1">{profile.name}, you&apos;re a superstar!</p>
          )}
        </div>

        {/* Results */}
        <div className="flex flex-col gap-3">
          {/* Quiz */}
          <div className="flex items-center gap-3 bg-sky-50 rounded-2xl p-4">
            <span className="text-3xl">🧠</span>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Quiz</p>
              <p className="text-sm text-gray-600">{session.quizScore}/10 correct</p>
            </div>
            <div className="text-xl">{"⭐".repeat(quizStars)}</div>
          </div>

          {/* Words */}
          <div className="flex items-center gap-3 bg-green-50 rounded-2xl p-4">
            <span className="text-3xl">📚</span>
            <div className="flex-1">
              <p className="font-bold text-gray-800">New Words</p>
              <p className="text-sm text-gray-600">10 words learned!</p>
            </div>
            <div className="text-xl">✅</div>
          </div>

          {/* Game */}
          <div className="flex items-center gap-3 bg-amber-50 rounded-2xl p-4">
            <span className="text-3xl">🃏</span>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Memory Game</p>
              <p className="text-sm text-gray-600">
                {session.gameMoves} moves in{" "}
                {Math.floor(session.gameTimeSeconds / 60)}:
                {(session.gameTimeSeconds % 60).toString().padStart(2, "0")}
              </p>
            </div>
            <div className="text-xl">🎮</div>
          </div>

          {/* Video */}
          <div className="flex items-center gap-3 bg-pink-50 rounded-2xl p-4">
            <span className="text-3xl">🎬</span>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Video</p>
              <p className="text-sm text-gray-600">Watched!</p>
            </div>
            <div className="text-xl">✅</div>
          </div>

          {/* Review */}
          <div className="flex items-center gap-3 bg-purple-50 rounded-2xl p-4">
            <span className="text-3xl">💡</span>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Brain Challenge</p>
              <p className="text-sm text-gray-600">{session.reviewScore}/5 correct</p>
            </div>
            <div className="text-xl">{"⭐".repeat(reviewStars)}</div>
          </div>
        </div>

        {/* Streak */}
        {profile && profile.currentStreak > 0 && (
          <div className="mt-6 text-center bg-orange-50 rounded-2xl p-4">
            <p className="text-4xl mb-1">🔥</p>
            <p className="text-2xl font-black text-orange-600">{profile.currentStreak} Day Streak!</p>
            <p className="text-sm text-gray-600">Keep it up tomorrow!</p>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-2xl py-4 hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95 shadow-lg"
        >
          Back to Home 🏠
        </button>
      </div>
    </div>
  );
}
