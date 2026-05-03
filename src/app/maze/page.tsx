"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StarBurst from "@/components/StarBurst";
import { useSound } from "@/hooks/useSound";

// Each cell has 4 walls: top, right, bottom, left
interface Cell {
  walls: [boolean, boolean, boolean, boolean]; // top, right, bottom, left
  visited: boolean;
}

const SIZES = [
  { rows: 6, cols: 6, label: "Easy" },
  { rows: 8, cols: 8, label: "Medium" },
  { rows: 10, cols: 10, label: "Hard" },
];

function generateMaze(rows: number, cols: number): Cell[][] {
  const grid: Cell[][] = Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({ walls: [true, true, true, true], visited: false }))
    );

  // Recursive backtracker
  const stack: [number, number][] = [];
  const startR = 0;
  const startC = 0;
  grid[startR][startC].visited = true;
  stack.push([startR, startC]);

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];
    const neighbors: [number, number, number][] = []; // r, c, direction

    // Check 4 neighbors. Direction: 0=top, 1=right, 2=bottom, 3=left
    if (r > 0 && !grid[r - 1][c].visited) neighbors.push([r - 1, c, 0]);
    if (c < cols - 1 && !grid[r][c + 1].visited) neighbors.push([r, c + 1, 1]);
    if (r < rows - 1 && !grid[r + 1][c].visited) neighbors.push([r + 1, c, 2]);
    if (c > 0 && !grid[r][c - 1].visited) neighbors.push([r, c - 1, 3]);

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const [nr, nc, dir] = neighbors[Math.floor(Math.random() * neighbors.length)];

    // Remove walls between (r,c) and (nr,nc)
    grid[r][c].walls[dir] = false;
    grid[nr][nc].walls[(dir + 2) % 4] = false;

    grid[nr][nc].visited = true;
    stack.push([nr, nc]);
  }

  return grid;
}

export default function MazePage() {
  const router = useRouter();
  const { play } = useSound();
  const [difficulty, setDifficulty] = useState(0);
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [pos, setPos] = useState({ r: 0, c: 0 });
  const [path, setPath] = useState<{ r: number; c: number }[]>([{ r: 0, c: 0 }]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  const { rows, cols } = SIZES[difficulty];

  const newMaze = useCallback(() => {
    const m = generateMaze(rows, cols);
    setMaze(m);
    setPos({ r: 0, c: 0 });
    setPath([{ r: 0, c: 0 }]);
    setMoves(0);
    setWon(false);
    setStartTime(Date.now());
    setElapsed(0);
  }, [rows, cols]);

  useEffect(() => {
    newMaze();
  }, [newMaze]);

  // Timer
  useEffect(() => {
    if (won) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [won, startTime]);

  const move = useCallback(
    (dr: number, dc: number) => {
      if (won || maze.length === 0) return;
      const cell = maze[pos.r][pos.c];
      // Direction 0=top, 1=right, 2=bottom, 3=left
      let dir = -1;
      if (dr === -1 && dc === 0) dir = 0;
      else if (dr === 0 && dc === 1) dir = 1;
      else if (dr === 1 && dc === 0) dir = 2;
      else if (dr === 0 && dc === -1) dir = 3;

      if (dir === -1) return;
      if (cell.walls[dir]) {
        play("wrong");
        return;
      }

      const newR = pos.r + dr;
      const newC = pos.c + dc;
      setPos({ r: newR, c: newC });
      setPath((p) => [...p, { r: newR, c: newC }]);
      setMoves((m) => m + 1);
      play("flip");

      if (newR === rows - 1 && newC === cols - 1) {
        setWon(true);
        setTimeout(() => play("cheer"), 200);
      }
    },
    [maze, pos, won, rows, cols, play]
  );

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") move(-1, 0);
      else if (e.key === "ArrowDown") move(1, 0);
      else if (e.key === "ArrowLeft") move(0, -1);
      else if (e.key === "ArrowRight") move(0, 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [move]);

  if (won) {
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <StarBurst />
        <div className="bg-white/90 rounded-3xl p-8 shadow-xl text-center max-w-sm animate-bounce-in">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-purple-700">Maze Solved!</h2>
          <div className="flex gap-6 justify-center mt-4">
            <div>
              <p className="text-3xl font-bold text-sky-600">{moves}</p>
              <p className="text-sm text-gray-500">moves</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </p>
              <p className="text-sm text-gray-500">time</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={newMaze}
              className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-2xl py-3 hover:from-emerald-500 hover:to-emerald-600 transition-all active:scale-95"
            >
              New Maze 🔄
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl py-3 hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95"
            >
              Home 🏠
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate cell size based on grid size
  const maxBoard = 360;
  const cellSize = Math.floor(maxBoard / cols);
  const wallW = 2;

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => router.push("/")} className="text-purple-500 font-semibold hover:text-purple-700">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-purple-700">🗺️ Maze</h1>
        <div className="text-sm text-gray-500">{Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}</div>
      </div>

      {/* Difficulty */}
      <div className="flex justify-center gap-2 mb-3">
        {SIZES.map((s, i) => (
          <button
            key={i}
            onClick={() => setDifficulty(i)}
            className={`px-3 py-1 rounded-lg font-semibold text-sm transition-all ${
              i === difficulty ? "bg-purple-500 text-white" : "bg-white/60 text-gray-600"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-3 mb-3">
        <div className="bg-white/80 rounded-xl px-3 py-1 shadow text-sm">
          <span className="text-gray-500">Moves: </span>
          <span className="font-bold text-purple-600">{moves}</span>
        </div>
        <button
          onClick={newMaze}
          className="bg-white/80 rounded-xl px-3 py-1 shadow text-sm font-semibold text-orange-600 hover:bg-orange-50"
        >
          🔄 New Maze
        </button>
      </div>

      {/* Maze */}
      <div className="flex justify-center mb-4">
        <div
          className="relative bg-white border-4 border-purple-700 rounded-xl"
          style={{ width: cols * cellSize + 8, height: rows * cellSize + 8, padding: 4 }}
        >
          {/* Cells */}
          {maze.map((row, r) =>
            row.map((cell, c) => {
              const isCurrent = pos.r === r && pos.c === c;
              const isGoal = r === rows - 1 && c === cols - 1;
              const isVisited = path.some((p) => p.r === r && p.c === c);
              return (
                <div
                  key={`${r}-${c}`}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: 4 + c * cellSize,
                    top: 4 + r * cellSize,
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: isVisited && !isCurrent ? "rgba(168, 85, 247, 0.15)" : "transparent",
                    borderTop: cell.walls[0] ? `${wallW}px solid #6b21a8` : "none",
                    borderRight: cell.walls[1] ? `${wallW}px solid #6b21a8` : "none",
                    borderBottom: cell.walls[2] ? `${wallW}px solid #6b21a8` : "none",
                    borderLeft: cell.walls[3] ? `${wallW}px solid #6b21a8` : "none",
                  }}
                >
                  {isGoal && !isCurrent && <span style={{ fontSize: cellSize * 0.6 }}>🥕</span>}
                  {isCurrent && <span style={{ fontSize: cellSize * 0.7 }} className="animate-bounce-slow">🐰</span>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <button
          onClick={() => move(-1, 0)}
          className="bg-purple-500 text-white text-3xl font-bold rounded-2xl w-16 h-14 hover:bg-purple-600 transition-all active:scale-95 shadow-lg"
        >
          ↑
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => move(0, -1)}
            className="bg-purple-500 text-white text-3xl font-bold rounded-2xl w-16 h-14 hover:bg-purple-600 transition-all active:scale-95 shadow-lg"
          >
            ←
          </button>
          <button
            onClick={() => move(1, 0)}
            className="bg-purple-500 text-white text-3xl font-bold rounded-2xl w-16 h-14 hover:bg-purple-600 transition-all active:scale-95 shadow-lg"
          >
            ↓
          </button>
          <button
            onClick={() => move(0, 1)}
            className="bg-purple-500 text-white text-3xl font-bold rounded-2xl w-16 h-14 hover:bg-purple-600 transition-all active:scale-95 shadow-lg"
          >
            →
          </button>
        </div>
      </div>

      <p className="text-center text-gray-600 text-sm mt-3">
        Help the 🐰 reach the 🥕!
      </p>
    </div>
  );
}
