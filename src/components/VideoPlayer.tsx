"use client";

import { Video } from "@/types";

interface Props {
  video: Video;
}

export default function VideoPlayer({ video }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative w-full pb-[56.25%] rounded-2xl overflow-hidden shadow-xl bg-black">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-xl font-bold text-gray-800">{video.title}</h3>
        <p className="text-gray-600 mt-1">{video.description}</p>
        <p className="text-sm text-purple-500 mt-1">📺 {video.channel}</p>
      </div>
    </div>
  );
}
