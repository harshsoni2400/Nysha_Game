"use client";

interface Props {
  expression?: "happy" | "thinking" | "celebrating";
  message?: string;
}

export default function Mascot({ expression = "happy", message }: Props) {
  const faces: Record<string, string> = {
    happy: "😊",
    thinking: "🤔",
    celebrating: "🎉",
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-5xl animate-bounce-slow">{faces[expression]}</div>
      {message && (
        <div className="bg-white/90 rounded-2xl rounded-bl-none px-4 py-3 shadow-md max-w-xs">
          <p className="text-base text-gray-700 font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}
