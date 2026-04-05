"use client";

interface Props {
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export default function MemoryCard({ emoji, isFlipped, isMatched, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={isFlipped || isMatched}
      className="perspective-500 w-full aspect-square"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-3d ${
          isFlipped || isMatched ? "rotate-y-180" : ""
        }`}
      >
        {/* Back (default, face-down) */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl flex items-center justify-center text-3xl font-bold shadow-md border-2 transition-all ${
            isMatched
              ? "border-green-400 bg-green-100"
              : "border-purple-300 bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 active:scale-95 cursor-pointer"
          }`}
        >
          {!isMatched && <span className="text-white text-4xl">?</span>}
        </div>

        {/* Front (face-up) */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl flex items-center justify-center shadow-md border-2 transition-all ${
            isMatched
              ? "border-green-400 bg-green-50 ring-4 ring-green-200"
              : "border-sky-300 bg-white"
          }`}
        >
          <span className="text-5xl">{emoji}</span>
        </div>
      </div>
    </button>
  );
}
