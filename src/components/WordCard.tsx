"use client";

import { Word } from "@/types";

interface Props {
  word: Word;
  wordNumber: number;
  totalWords: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function WordCard({ word, wordNumber, totalWords, onNext, onPrev }: Props) {
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Progress */}
      <p className="text-purple-500 font-semibold mb-4">
        Word {wordNumber + 1} of {totalWords}
      </p>

      {/* Card */}
      <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl w-full text-center border-2 border-purple-100">
        {/* Emoji */}
        <div className="text-6xl mb-4 animate-bounce-slow">{word.emoji}</div>

        {/* Word */}
        <h2 className="text-4xl font-bold text-purple-700 mb-2">{word.word}</h2>

        {/* Pronunciation */}
        <p className="text-lg text-gray-500 italic mb-1">({word.pronunciation})</p>

        {/* Part of speech */}
        <span className="inline-block bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          {word.partOfSpeech}
        </span>

        {/* Definition */}
        <div className="bg-gradient-to-r from-sky-50 to-pink-50 rounded-2xl p-4 mb-4">
          <p className="text-lg text-gray-700 font-medium">{word.definition}</p>
        </div>

        {/* Example */}
        <div className="bg-amber-50 rounded-2xl p-4">
          <p className="text-sm text-gray-500 mb-1">Example:</p>
          <p className="text-base text-gray-700 italic">&ldquo;{word.example}&rdquo;</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-6 w-full">
        <button
          onClick={onPrev}
          disabled={wordNumber === 0}
          className="flex-1 bg-white/80 text-purple-600 border-2 border-purple-200 rounded-2xl py-4 text-lg font-semibold disabled:opacity-30 hover:bg-purple-50 transition-all active:scale-95"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-purple-500 text-white rounded-2xl py-4 text-lg font-semibold hover:bg-purple-600 transition-all active:scale-95 shadow-lg"
        >
          {wordNumber === totalWords - 1 ? "Done! ✨" : "Next →"}
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-purple-100 rounded-full h-2 mt-4">
        <div
          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${((wordNumber + 1) / totalWords) * 100}%` }}
        />
      </div>
    </div>
  );
}
