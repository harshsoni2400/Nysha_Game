"use client";

import { useState, useEffect, useCallback } from "react";
import MemoryCard from "./MemoryCard";
import { useSound } from "@/hooks/useSound";

const ALL_EMOJIS = ["🐱", "🐶", "🌞", "🌙", "🌳", "🌸", "🐟", "🦋", "🍎", "🚀", "⭐", "🎈", "🐢", "🦄", "🌈", "🎵"];

interface CardData {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Props {
  onComplete: (moves: number, timeSeconds: number) => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function MemoryBoard({ onComplete }: Props) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [firstFlipped, setFirstFlipped] = useState<number | null>(null);
  const [secondFlipped, setSecondFlipped] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [startTime] = useState(Date.now());
  const [isLocked, setIsLocked] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    const selected = shuffleArray(ALL_EMOJIS).slice(0, 8);
    const pairs = shuffleArray([...selected, ...selected]);
    setCards(
      pairs.map((emoji, i) => ({
        id: i,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
    );
  }, []);

  const handleClick = useCallback(
    (index: number) => {
      if (isLocked) return;
      if (cards[index].isFlipped || cards[index].isMatched) return;

      play("flip");

      const newCards = [...cards];
      newCards[index] = { ...newCards[index], isFlipped: true };
      setCards(newCards);

      if (firstFlipped === null) {
        setFirstFlipped(index);
      } else {
        setSecondFlipped(index);
        setIsLocked(true);
        setMoves((m) => m + 1);

        if (newCards[firstFlipped].emoji === newCards[index].emoji) {
          // Match!
          setTimeout(() => {
            play("match");
            setCards((prev) => {
              const updated = [...prev];
              updated[firstFlipped] = { ...updated[firstFlipped], isMatched: true, isFlipped: false };
              updated[index] = { ...updated[index], isMatched: true, isFlipped: false };
              return updated;
            });
            setMatches((m) => {
              const newMatches = m + 1;
              if (newMatches === 8) {
                setTimeout(() => {
                  play("cheer");
                  const timeSeconds = Math.round((Date.now() - startTime) / 1000);
                  onComplete(moves + 1, timeSeconds);
                }, 500);
              }
              return newMatches;
            });
            setFirstFlipped(null);
            setSecondFlipped(null);
            setIsLocked(false);
          }, 500);
        } else {
          // No match
          setTimeout(() => {
            setCards((prev) => {
              const updated = [...prev];
              updated[firstFlipped] = { ...updated[firstFlipped], isFlipped: false };
              updated[index] = { ...updated[index], isFlipped: false };
              return updated;
            });
            setFirstFlipped(null);
            setSecondFlipped(null);
            setIsLocked(false);
          }, 1000);
        }
      }
    },
    [cards, firstFlipped, isLocked, moves, onComplete, play, startTime]
  );

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Stats */}
      <div className="flex justify-between mb-4 px-2">
        <div className="bg-white/80 rounded-xl px-4 py-2 shadow">
          <span className="text-sm text-gray-500">Moves</span>
          <p className="text-xl font-bold text-purple-600">{moves}</p>
        </div>
        <div className="bg-white/80 rounded-xl px-4 py-2 shadow">
          <span className="text-sm text-gray-500">Matches</span>
          <p className="text-xl font-bold text-green-600">{matches}/8</p>
        </div>
        <div className="bg-white/80 rounded-xl px-4 py-2 shadow">
          <span className="text-sm text-gray-500">Time</span>
          <p className="text-xl font-bold text-sky-600">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, i) => (
          <MemoryCard
            key={card.id}
            emoji={card.emoji}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
    </div>
  );
}
