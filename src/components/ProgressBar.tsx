"use client";

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            i < current
              ? "bg-green-400 scale-100"
              : i === current
              ? "bg-purple-500 scale-125 animate-pulse"
              : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
