"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { selectDailyVideo, getTodayDate } from "@/lib/contentSelector";
import { Video } from "@/types";

import videosData from "@/data/videos.json";

export default function VideoPage() {
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const today = getTodayDate();
    const selected = selectDailyVideo(videosData as Video[], today);
    setVideo(selected);
  }, []);

  const watchAnother = () => {
    // Pick a random different video
    const randomIndex = Math.floor(Math.random() * videosData.length);
    setVideo(videosData[randomIndex] as Video);
  };

  if (!mounted || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-600 animate-pulse">Loading video...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.push("/")} className="text-purple-500 font-semibold hover:text-purple-700">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-purple-700">🎬 Video Time</h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <VideoPlayer video={video} />

        <div className="flex gap-3">
          <button
            onClick={watchAnother}
            className="bg-gradient-to-r from-pink-400 to-pink-500 text-white text-lg font-bold rounded-2xl py-3 px-6 hover:from-pink-500 hover:to-pink-600 transition-all active:scale-95 shadow-lg"
          >
            Another Video 🔄
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-2xl py-3 px-6 hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95 shadow-lg"
          >
            Home 🏠
          </button>
        </div>
      </div>
    </div>
  );
}
