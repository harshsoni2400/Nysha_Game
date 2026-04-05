"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import VideoPlayer from "@/components/VideoPlayer";
import { selectDailyVideo, getTodayDate } from "@/lib/contentSelector";
import { useSound } from "@/hooks/useSound";
import { Video } from "@/types";

import videosData from "@/data/videos.json";

export default function VideoPage() {
  const router = useRouter();
  const { completeVideo } = useSession();
  const { play } = useSound();
  const [video, setVideo] = useState<Video | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const today = getTodayDate();
    const selected = selectDailyVideo(videosData as Video[], today);
    setVideo(selected);
  }, []);

  const handleWatched = () => {
    play("complete");
    completeVideo();
    router.push("/");
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
        <button
          onClick={() => router.push("/")}
          className="text-purple-500 font-semibold hover:text-purple-700"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-purple-700">🎬 Video Time</h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <VideoPlayer video={video} />

        <button
          onClick={handleWatched}
          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-2xl py-4 px-8 hover:from-green-500 hover:to-emerald-600 transition-all active:scale-95 shadow-lg mt-4"
        >
          I Watched It! ✅
        </button>
      </div>
    </div>
  );
}
