"use client";

interface Props {
  streak: number;
}

export default function StreakCounter({ streak }: Props) {
  if (streak <= 0) return null;

  return (
    <div className="flex items-center gap-1 bg-orange-100 px-3 py-1.5 rounded-full shadow-sm">
      <span className="text-xl">🔥</span>
      <span className="text-lg font-bold text-orange-600">{streak}</span>
      <span className="text-xs text-orange-500">
        {streak === 1 ? "day" : "days"}
      </span>
    </div>
  );
}
