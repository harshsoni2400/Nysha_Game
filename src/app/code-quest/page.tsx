"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import StarBurst from "@/components/StarBurst";
import { useSound } from "@/hooks/useSound";
import { CODE_LEVELS, CommandType } from "@/data/codeLevels";
import { initialState, executeCommand, checkWin, getStarRating, RunnerState } from "@/lib/codeRunner";

const COMMAND_INFO: Record<CommandType, { icon: string; label: string; color: string }> = {
  forward: { icon: "⬆️", label: "Forward", color: "from-sky-400 to-sky-500" },
  right: { icon: "↪️", label: "Turn Right", color: "from-orange-400 to-orange-500" },
  left: { icon: "↩️", label: "Turn Left", color: "from-pink-400 to-pink-500" },
  pickup: { icon: "🤚", label: "Pick Up", color: "from-green-400 to-green-500" },
};

const DIR_ROTATION: Record<string, string> = {
  up: "rotate-0",
  right: "rotate-90",
  down: "rotate-180",
  left: "-rotate-90",
};

const STORAGE_KEY = "brainspark_code_quest_progress";

interface Progress {
  unlockedLevel: number;
  starsByLevel: Record<number, number>;
  trophies: number;
}

function loadProgress(): Progress {
  if (typeof window === "undefined") return { unlockedLevel: 1, starsByLevel: {}, trophies: 0 };
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return { unlockedLevel: 1, starsByLevel: {}, trophies: 0 };
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export default function CodeQuestPage() {
  const router = useRouter();
  const { play } = useSound();
  const [progress, setProgress] = useState<Progress>({ unlockedLevel: 1, starsByLevel: {}, trophies: 0 });
  const [levelIdx, setLevelIdx] = useState(0);
  const [program, setProgram] = useState<CommandType[]>([]);
  const [state, setState] = useState<RunnerState>(initialState(CODE_LEVELS[0]));
  const [running, setRunning] = useState(false);
  const [highlightedStep, setHighlightedStep] = useState(-1);
  const [won, setWon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const cancelRef = useRef(false);

  const level = CODE_LEVELS[levelIdx];

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const resetLevel = useCallback(() => {
    cancelRef.current = true;
    setProgram([]);
    setState(initialState(level));
    setRunning(false);
    setHighlightedStep(-1);
    setWon(false);
    setError(null);
  }, [level]);

  useEffect(() => {
    resetLevel();
  }, [levelIdx, resetLevel]);

  const addCommand = (cmd: CommandType) => {
    if (running || won) return;
    if (program.length >= level.maxCommands) return;
    play("flip");
    setProgram((p) => [...p, cmd]);
  };

  const removeCommand = (i: number) => {
    if (running || won) return;
    setProgram((p) => p.filter((_, idx) => idx !== i));
  };

  const runProgram = async () => {
    if (running || program.length === 0) return;
    cancelRef.current = false;
    setRunning(true);
    setError(null);
    setState(initialState(level));

    let curr = initialState(level);
    for (let i = 0; i < program.length; i++) {
      if (cancelRef.current) break;
      setHighlightedStep(i);
      await new Promise((r) => setTimeout(r, 500));
      const result = executeCommand(curr, program[i], level);
      curr = result.state;
      setState({ ...curr });
      if (!result.ok) {
        play("wrong");
        setError(result.message || "Something went wrong!");
        setRunning(false);
        setHighlightedStep(-1);
        return;
      }
      if (program[i] === "forward") {
        play("flip");
      }
      if (curr.collectedStars.length > (state.collectedStars?.length || 0)) {
        play("match");
      }
    }
    setHighlightedStep(-1);
    setRunning(false);

    if (checkWin(curr, level)) {
      setWon(true);
      play("cheer");
      // Save progress
      const stars = getStarRating(program.length, level.optimalCount);
      const newProgress: Progress = {
        unlockedLevel: Math.max(progress.unlockedLevel, levelIdx + 2),
        starsByLevel: {
          ...progress.starsByLevel,
          [level.id]: Math.max(progress.starsByLevel[level.id] || 0, stars),
        },
        trophies: progress.trophies,
      };
      newProgress.trophies = Object.keys(newProgress.starsByLevel).length;
      setProgress(newProgress);
      saveProgress(newProgress);
    } else {
      setError("Almost there! Try again 💪");
      play("wrong");
    }
  };

  const goToLevel = (idx: number) => {
    if (idx + 1 > progress.unlockedLevel && idx !== levelIdx) return;
    setLevelIdx(idx);
    setShowLevelSelect(false);
  };

  // Calculate cell size based on grid
  const maxBoard = 320;
  const cellSize = Math.min(60, Math.floor(maxBoard / Math.max(level.rows, level.cols)));

  if (won) {
    const stars = getStarRating(program.length, level.optimalCount);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <StarBurst />
        <div className="bg-white/95 rounded-3xl p-8 shadow-xl text-center max-w-sm animate-bounce-in">
          <div className="text-6xl mb-3">🏆</div>
          <h2 className="text-3xl font-bold text-purple-700">Level {level.id} Done!</h2>
          <p className="text-gray-600 mt-1">{level.name}</p>
          <div className="text-5xl my-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i}>{i < stars ? "⭐" : "☆"}</span>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Used {program.length} commands
            {stars === 3 && " - Perfect!"}
          </p>
          <div className="flex gap-3 mt-6">
            {levelIdx < CODE_LEVELS.length - 1 ? (
              <button
                onClick={() => setLevelIdx(levelIdx + 1)}
                className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-2xl py-3 hover:from-green-500 hover:to-green-600 transition-all active:scale-95"
              >
                Next Level →
              </button>
            ) : (
              <button
                onClick={() => setLevelIdx(0)}
                className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-2xl py-3 hover:from-green-500 hover:to-green-600 transition-all active:scale-95"
              >
                All Done! 🎉
              </button>
            )}
            <button
              onClick={resetLevel}
              className="flex-1 bg-gradient-to-r from-sky-400 to-sky-500 text-white font-bold rounded-2xl py-3 hover:from-sky-500 hover:to-sky-600 transition-all active:scale-95"
            >
              Replay 🔄
            </button>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl py-3 hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95"
          >
            Home 🏠
          </button>
        </div>
      </div>
    );
  }

  if (showLevelSelect) {
    return (
      <div className="min-h-screen p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setShowLevelSelect(false)} className="text-purple-500 font-semibold">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-purple-700">Pick a Level</h1>
          <div className="text-sm">🏆 {progress.trophies}</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CODE_LEVELS.map((lvl, i) => {
            const unlocked = i + 1 <= progress.unlockedLevel;
            const stars = progress.starsByLevel[lvl.id] || 0;
            return (
              <button
                key={lvl.id}
                onClick={() => goToLevel(i)}
                disabled={!unlocked}
                className={`bg-white rounded-2xl p-4 shadow-md border-2 transition-all ${
                  unlocked
                    ? "border-purple-300 hover:scale-105 active:scale-95"
                    : "border-gray-200 opacity-50"
                }`}
              >
                <div className="text-2xl mb-1">{unlocked ? "🌟" : "🔒"}</div>
                <div className="text-xs font-bold text-gray-700">Level {lvl.id}</div>
                <div className="text-[10px] text-gray-500 mb-1">{lvl.name}</div>
                {unlocked && (
                  <div className="text-sm">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <span key={j} className={j < stars ? "" : "opacity-20"}>⭐</span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 flex flex-col max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => router.push("/")} className="text-purple-500 font-semibold hover:text-purple-700">
          ← Back
        </button>
        <h1 className="text-lg font-bold text-purple-700">🤖 Code Quest</h1>
        <button onClick={() => setShowLevelSelect(true)} className="text-sm font-semibold text-purple-500">
          Lv {level.id}/9
        </button>
      </div>

      {/* Level intro */}
      <div className="bg-white/80 rounded-2xl p-3 mb-3 text-center shadow-sm">
        <p className="text-sm font-bold text-purple-700">{level.name}</p>
        <p className="text-xs text-gray-600 mt-0.5">{level.intro}</p>
      </div>

      {/* Grid */}
      <div className="flex justify-center mb-3">
        <div
          className="relative bg-emerald-50 border-4 border-emerald-700 rounded-xl"
          style={{
            width: level.cols * cellSize + 8,
            height: level.rows * cellSize + 8,
            padding: 4,
          }}
        >
          {/* Cells */}
          {Array.from({ length: level.rows }).map((_, r) =>
            Array.from({ length: level.cols }).map((_, c) => {
              const isWall = level.walls.some((w) => w.r === r && w.c === c);
              const isGoal = level.goal.r === r && level.goal.c === c;
              const star = level.stars.find((s) => s.r === r && s.c === c);
              const collected = star && state.collectedStars.some((s) => s.r === r && s.c === c);
              return (
                <div
                  key={`${r}-${c}`}
                  className="absolute flex items-center justify-center border border-emerald-200"
                  style={{
                    left: 4 + c * cellSize,
                    top: 4 + r * cellSize,
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: isWall ? "#78350f" : "transparent",
                  }}
                >
                  {isGoal && <span style={{ fontSize: cellSize * 0.6 }}>🏆</span>}
                  {star && !collected && <span style={{ fontSize: cellSize * 0.5 }}>⭐</span>}
                </div>
              );
            })
          )}
          {/* Character */}
          <div
            className={`absolute flex items-center justify-center transition-all duration-500 ${DIR_ROTATION[state.facing]}`}
            style={{
              left: 4 + state.c * cellSize,
              top: 4 + state.r * cellSize,
              width: cellSize,
              height: cellSize,
              fontSize: cellSize * 0.7,
            }}
          >
            🤖
          </div>
        </div>
      </div>

      {/* Program area */}
      <div className="bg-white/80 rounded-2xl p-3 mb-3 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 mb-2">YOUR PROGRAM</p>
        <div className="flex flex-wrap gap-1.5 min-h-[48px]">
          {Array.from({ length: level.maxCommands }).map((_, i) => {
            const cmd = program[i];
            const isHighlighted = i === highlightedStep;
            return (
              <button
                key={i}
                onClick={() => cmd && removeCommand(i)}
                disabled={!cmd || running}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                  cmd
                    ? `bg-gradient-to-br ${COMMAND_INFO[cmd].color} text-white shadow-md ${
                        isHighlighted ? "ring-4 ring-yellow-400 scale-110" : ""
                      }`
                    : "bg-gray-100 border-2 border-dashed border-gray-300"
                }`}
              >
                {cmd ? COMMAND_INFO[cmd].icon : ""}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbox */}
      <div className="bg-white/80 rounded-2xl p-3 mb-3 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 mb-2">COMMANDS - tap to add</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {level.availableCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => addCommand(cmd)}
              disabled={running || won || program.length >= level.maxCommands}
              className={`bg-gradient-to-br ${COMMAND_INFO[cmd].color} text-white rounded-xl px-3 py-2 shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex flex-col items-center min-w-[64px]`}
            >
              <span className="text-2xl">{COMMAND_INFO[cmd].icon}</span>
              <span className="text-[10px] font-semibold">{COMMAND_INFO[cmd].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-orange-100 border-2 border-orange-300 rounded-2xl p-3 mb-3 text-center">
          <p className="text-orange-800 font-semibold text-sm">{error}</p>
        </div>
      )}

      {/* Run + Reset buttons */}
      <div className="flex gap-2">
        <button
          onClick={runProgram}
          disabled={running || program.length === 0}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-bold rounded-2xl py-3 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 transition-all active:scale-95 shadow-lg"
        >
          {running ? "Running..." : "▶️ RUN"}
        </button>
        <button
          onClick={resetLevel}
          disabled={running}
          className="bg-orange-400 text-white font-bold rounded-2xl px-4 hover:bg-orange-500 disabled:opacity-50 transition-all active:scale-95 shadow-lg"
        >
          🔄
        </button>
      </div>

      {/* Star info */}
      {level.stars.length > 0 && (
        <p className="text-center text-xs text-gray-500 mt-2">
          ⭐ Collected: {state.collectedStars.length}/{level.stars.length}
        </p>
      )}
    </div>
  );
}
