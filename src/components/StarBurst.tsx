"use client";

export default function StarBurst() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-star-burst"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1 + Math.random()}s`,
          }}
        >
          {["⭐", "🌟", "✨", "💫"][i % 4]}
        </div>
      ))}
    </div>
  );
}
