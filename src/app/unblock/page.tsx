"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StarBurst from "@/components/StarBurst";
import { useSound } from "@/hooks/useSound";

// 6x6 grid. Each block has: id, row, col, length, orientation ('h' | 'v'), isTarget
// Target block is the red one - exit is at row 2 (0-indexed), right side.
// Coordinates: row 0 is top, col 0 is left.

type Orientation = "h" | "v";

interface Block {
  id: string;
  row: number;
  col: number;
  length: number;
  orientation: Orientation;
  isTarget: boolean;
  color: string;
}

const GRID_SIZE = 6;
const EXIT_ROW = 2; // Row where target exits (0-indexed)

// 8 puzzles, easy to harder
const PUZZLES: Block[][] = [
  // Level 1 - very easy
  [
    { id: "t", row: 2, col: 1, length: 2, orientation: "h", isTarget: true, color: "bg-red-500" },
    { id: "a", row: 0, col: 0, length: 2, orientation: "h", isTarget: false, color: "bg-blue-400" },
    { id: "b", row: 4, col: 0, length: 3, orientation: "h", isTarget: false, color: "bg-green-400" },
  ],
  // Level 2
  [
    { id: "t", row: 2, col: 0, length: 2, orientation: "h", isTarget: true, color: "bg-red-500" },
    { id: "a", row: 0, col: 3, length: 2, orientation: "v", isTarget: false, color: "bg-blue-400" },
    { id: "b", row: 0, col: 5, length: 3, orientation: "v", isTarget: false, color: "bg-green-400" },
    { id: "c", row: 4, col: 1, length: 2, orientation: "h", isTarget: false, color: "bg-yellow-400" },
  ],
  // Level 3
  [
    { id: "t", row: 2, col: 1, length: 2, orientation: "h", isTarget: true, color: "bg-red-500" },
    { id: "a", row: 0, col: 0, length: 2, orientation: "v", isTarget: false, color: "bg-blue-400" },
    { id: "b", row: 0, col: 3, length: 3, orientation: "h", isTarget: false, color: "bg-green-400" },
    { id: "c", row: 1, col: 5, length: 2, orientation: "v", isTarget: false, color: "bg-yellow-400" },
    { id: "d", row: 5, col: 0, length: 3, orientation: "h", isTarget: false, color: "bg-purple-400" },
  ],
  // Level 4
  [
    { id: "t", row: 2, col: 1, length: 2, orientation: "h", isTarget: true, color: "bg-red-500" },
    { id: "a", row: 0, col: 0, length: 3, orientation: "v", isTarget: false, color: "bg-blue-400" },
    { id: "b", row: 0, col: 1, length: 2, orientation: "h", isTarget: false, color: "bg-green-400" },
    { id: "c", row: 1, col: 3, length: 2, orientation: "v", isTarget: false, color: "bg-yellow-400" },
    { id: "d", row: 3, col: 5, length: 3, orientation: "v", isTarget: false, color: "bg-purple-400" },
    { id: "e", row: 5, col: 1, length: 3, orientation: "h", isTarget: false, color: "bg-pink-400" },
  ],
  // Level 5
  [
    { id: "t", row: 2, col: 0, length: 2, orientation: "h", isTarget: true, color: "bg-red-500" },
    { id: "a", row: 0, col: 0, length: 2, orientation: "h", isTarget: false, color: "bg-blue-400" },
    { id: "b", row: 0, col: 3, length: 3, orientation: "v", isTarget: false, color: "bg-green-400" },
    { id: "c", row: 0, col: 5, length: 2, orientation: "v", isTarget: false, color: "bg-yellow-400" },
    { id: "d", row: 3, col: 0, length: 2, orientation: "v", isTarget: false, color: "bg-purple-400" },
    { id: "e", row: 4, col: 2, length: 3, orientation: "h", isTarget: false, color: "bg-pink-400" },
    { id: "f", row: 3, col: 5, length: 3, orientation: "v", isTarget: false, color: "bg-orange-400" },
  ],
  // Level 6
  [
    { id: "t", row: 2, col: 1, length: 2, orientation: "h", isTarget: true, color: "bg-red-500" },
    { id: "a", row: 0, col: 0, length: 3, orientation: "h", isTarget: false, color: "bg-blue-400" },
    { id: "b", row: 1, col: 3, length: 2, orientation: "v", isTarget: false, color: "bg-green-400" },
    { id: "c", row: 0, col: 5, length: 3, orientation: "v", isTarget: false, color: "bg-yellow-400" },
    { id: "d", row: 3, col: 0, length: 2, orientation: "v", isTarget: false, color: "bg-purple-400" },
    { id: "e", row: 3, col: 4, length: 2, orientation: "h", isTarget: false, color: "bg-pink-400" },
    { id: "f", row: 5, col: 1, length: 2, orientation: "h", isTarget: false, color: "bg-orange-400" },
    { id: "g", row: 4, col: 4, length: 2, orientation: "v", isTarget: false, color: "bg-cyan-400" },
  ],
  // Level 7
  [
    { id: "t", row: 2, col: 2, length: 2, orientation: "h", isTarget: true, color: "bg-red-500" },
    { id: "a", row: 0, col: 0, length: 2, orientation: "v", isTarget: false, color: "bg-blue-400" },
    { id: "b", row: 0, col: 1, length: 3, orientation: "h", isTarget: false, color: "bg-green-400" },
    { id: "c", row: 0, col: 4, length: 2, orientation: "v", isTarget: false, color: "bg-yellow-400" },
    { id: "d", row: 1, col: 5, length: 2, orientation: "v", isTarget: false, color: "bg-purple-400" },
    { id: "e", row: 3, col: 0, length: 2, orientation: "h", isTarget: false, color: "bg-pink-400" },
    { id: "f", row: 4, col: 2, length: 2, orientation: "h", isTarget: false, color: "bg-orange-400" },
    { id: "g", row: 4, col: 5, length: 2, orientation: "v", isTarget: false, color: "bg-cyan-400" },
    { id: "h", row: 5, col: 0, length: 2, orientation: "h", isTarget: false, color: "bg-indigo-400" },
  ],
  // Level 8 - hard
  [
    { id: "t", row: 2, col: 1, length: 2, orientation: "h", isTarget: true, color: "bg-red-500" },
    { id: "a", row: 0, col: 0, length: 2, orientation: "v", isTarget: false, color: "bg-blue-400" },
    { id: "b", row: 0, col: 1, length: 3, orientation: "h", isTarget: false, color: "bg-green-400" },
    { id: "c", row: 0, col: 5, length: 2, orientation: "v", isTarget: false, color: "bg-yellow-400" },
    { id: "d", row: 1, col: 3, length: 2, orientation: "v", isTarget: false, color: "bg-purple-400" },
    { id: "e", row: 1, col: 4, length: 3, orientation: "v", isTarget: false, color: "bg-pink-400" },
    { id: "f", row: 3, col: 0, length: 2, orientation: "h", isTarget: false, color: "bg-orange-400" },
    { id: "g", row: 3, col: 5, length: 3, orientation: "v", isTarget: false, color: "bg-cyan-400" },
    { id: "h", row: 4, col: 1, length: 3, orientation: "h", isTarget: false, color: "bg-indigo-400" },
    { id: "i", row: 5, col: 0, length: 1, orientation: "h", isTarget: false, color: "bg-teal-400" },
  ],
];

function buildGrid(blocks: Block[]): string[][] {
  const grid: string[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(""));
  for (const b of blocks) {
    for (let i = 0; i < b.length; i++) {
      const r = b.orientation === "v" ? b.row + i : b.row;
      const c = b.orientation === "h" ? b.col + i : b.col;
      if (r < GRID_SIZE && c < GRID_SIZE) grid[r][c] = b.id;
    }
  }
  return grid;
}

function canMove(block: Block, dir: number, blocks: Block[]): boolean {
  // dir: -1 (left/up), +1 (right/down)
  const grid = buildGrid(blocks);
  if (block.orientation === "h") {
    const newCol = dir === -1 ? block.col - 1 : block.col + block.length;
    if (newCol < 0 || newCol >= GRID_SIZE) return false;
    return grid[block.row][newCol] === "";
  } else {
    const newRow = dir === -1 ? block.row - 1 : block.row + block.length;
    if (newRow < 0 || newRow >= GRID_SIZE) return false;
    return grid[newRow][block.col] === "";
  }
}

function moveBlock(block: Block, dir: number): Block {
  if (block.orientation === "h") {
    return { ...block, col: block.col + dir };
  } else {
    return { ...block, row: block.row + dir };
  }
}

export default function UnblockPage() {
  const router = useRouter();
  const { play } = useSound();
  const [level, setLevel] = useState(0);
  const [blocks, setBlocks] = useState<Block[]>(() => PUZZLES[0].map((b) => ({ ...b })));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const loadLevel = useCallback((lvl: number) => {
    setBlocks(PUZZLES[lvl].map((b) => ({ ...b })));
    setSelectedId(null);
    setMoves(0);
    setWon(false);
  }, []);

  useEffect(() => {
    loadLevel(level);
  }, [level, loadLevel]);

  const handleBlockClick = (id: string) => {
    if (won) return;
    setSelectedId((curr) => (curr === id ? null : id));
    play("flip");
  };

  const handleMove = (dir: number) => {
    if (!selectedId || won) return;
    const block = blocks.find((b) => b.id === selectedId);
    if (!block) return;
    if (!canMove(block, dir, blocks)) {
      play("wrong");
      return;
    }
    const moved = moveBlock(block, dir);
    const newBlocks = blocks.map((b) => (b.id === selectedId ? moved : b));
    setBlocks(newBlocks);
    setMoves((m) => m + 1);
    play("flip");

    // Check win: target block at exit (right edge)
    if (moved.isTarget && moved.col + moved.length === GRID_SIZE) {
      setWon(true);
      play("cheer");
    }
  };

  const selectedBlock = blocks.find((b) => b.id === selectedId);

  if (won) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <StarBurst />
        <div className="bg-white/90 rounded-3xl p-8 shadow-xl text-center max-w-sm animate-bounce-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-purple-700">Puzzle Solved!</h2>
          <p className="text-lg text-gray-600 mt-2">Level {level + 1} done in {moves} moves!</p>
          <div className="flex gap-3 mt-6">
            {level < PUZZLES.length - 1 && (
              <button
                onClick={() => setLevel(level + 1)}
                className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-2xl py-3 hover:from-green-500 hover:to-green-600 transition-all active:scale-95"
              >
                Next Level →
              </button>
            )}
            <button
              onClick={() => loadLevel(level)}
              className="flex-1 bg-gradient-to-r from-red-400 to-red-500 text-white font-bold rounded-2xl py-3 hover:from-red-500 hover:to-red-600 transition-all active:scale-95"
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

  // Cell size in pixels
  const CELL = 44;
  const GAP = 4;
  const boardSize = GRID_SIZE * CELL + (GRID_SIZE - 1) * GAP;

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => router.push("/")} className="text-purple-500 font-semibold hover:text-purple-700">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-purple-700">🧩 Unblock Me</h1>
        <div className="text-sm text-gray-500">Lv {level + 1}/{PUZZLES.length}</div>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-3 mb-3">
        <div className="bg-white/80 rounded-xl px-3 py-1 shadow text-sm">
          <span className="text-gray-500">Moves: </span>
          <span className="font-bold text-purple-600">{moves}</span>
        </div>
        <button
          onClick={() => loadLevel(level)}
          className="bg-white/80 rounded-xl px-3 py-1 shadow text-sm font-semibold text-orange-600 hover:bg-orange-50"
        >
          🔄 Reset
        </button>
      </div>

      {/* Board */}
      <div className="flex justify-center mb-3">
        <div className="relative bg-amber-100 border-4 border-amber-700 rounded-2xl p-3 shadow-xl">
          {/* Exit indicator */}
          <div
            className="absolute -right-1 bg-amber-50 border-y-4 border-amber-700"
            style={{
              top: 12 + EXIT_ROW * (CELL + GAP),
              height: CELL,
              width: 8,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
            }}
          />

          {/* Grid background dots */}
          <div
            className="grid relative"
            style={{
              width: boardSize,
              height: boardSize,
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL}px)`,
              gap: GAP,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
              <div key={i} className="bg-amber-200/60 rounded-md" />
            ))}

            {/* Blocks */}
            {blocks.map((b) => {
              const w = b.orientation === "h" ? b.length * CELL + (b.length - 1) * GAP : CELL;
              const h = b.orientation === "v" ? b.length * CELL + (b.length - 1) * GAP : CELL;
              const left = b.col * (CELL + GAP);
              const top = b.row * (CELL + GAP);
              return (
                <button
                  key={b.id}
                  onClick={() => handleBlockClick(b.id)}
                  className={`${b.color} absolute rounded-lg shadow-md transition-all duration-200 ${
                    selectedId === b.id ? "ring-4 ring-white ring-offset-2 ring-offset-amber-700 scale-105 z-10" : ""
                  } ${b.isTarget ? "ring-2 ring-red-700" : ""}`}
                  style={{ width: w, height: h, left, top }}
                >
                  {b.isTarget && <span className="text-2xl">🚗</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Instructions / controls */}
      {!selectedBlock ? (
        <p className="text-center text-gray-600 text-sm mb-3">
          Tap a block to select it. Help the 🚗 reach the exit on the right!
        </p>
      ) : (
        <p className="text-center text-purple-600 text-sm font-semibold mb-3">
          Move the {selectedBlock.isTarget ? "🚗" : "block"} {selectedBlock.orientation === "h" ? "left or right" : "up or down"}!
        </p>
      )}

      {/* Direction buttons */}
      {selectedBlock && (
        <div className="flex justify-center gap-4">
          {selectedBlock.orientation === "h" ? (
            <>
              <button
                onClick={() => handleMove(-1)}
                disabled={!canMove(selectedBlock, -1, blocks)}
                className="bg-purple-500 text-white text-3xl font-bold rounded-2xl w-20 h-16 hover:bg-purple-600 disabled:opacity-30 transition-all active:scale-95 shadow-lg"
              >
                ←
              </button>
              <button
                onClick={() => handleMove(1)}
                disabled={!canMove(selectedBlock, 1, blocks)}
                className="bg-purple-500 text-white text-3xl font-bold rounded-2xl w-20 h-16 hover:bg-purple-600 disabled:opacity-30 transition-all active:scale-95 shadow-lg"
              >
                →
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleMove(-1)}
                disabled={!canMove(selectedBlock, -1, blocks)}
                className="bg-purple-500 text-white text-3xl font-bold rounded-2xl w-20 h-16 hover:bg-purple-600 disabled:opacity-30 transition-all active:scale-95 shadow-lg"
              >
                ↑
              </button>
              <button
                onClick={() => handleMove(1)}
                disabled={!canMove(selectedBlock, 1, blocks)}
                className="bg-purple-500 text-white text-3xl font-bold rounded-2xl w-20 h-16 hover:bg-purple-600 disabled:opacity-30 transition-all active:scale-95 shadow-lg"
              >
                ↓
              </button>
            </>
          )}
        </div>
      )}

      {/* Level selector */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {PUZZLES.map((_, i) => (
          <button
            key={i}
            onClick={() => setLevel(i)}
            className={`w-9 h-9 rounded-lg font-bold text-sm transition-all ${
              i === level ? "bg-purple-500 text-white scale-110" : "bg-white/60 text-gray-600 hover:bg-purple-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
