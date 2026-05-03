import { CodeLevel, CommandType, Direction } from "@/data/codeLevels";

export interface RunnerState {
  r: number;
  c: number;
  facing: Direction;
  collectedStars: { r: number; c: number }[];
}

const DIRS: Record<Direction, { dr: number; dc: number }> = {
  up: { dr: -1, dc: 0 },
  right: { dr: 0, dc: 1 },
  down: { dr: 1, dc: 0 },
  left: { dr: 0, dc: -1 },
};

const RIGHT_TURN: Record<Direction, Direction> = {
  up: "right",
  right: "down",
  down: "left",
  left: "up",
};

const LEFT_TURN: Record<Direction, Direction> = {
  up: "left",
  left: "down",
  down: "right",
  right: "up",
};

export function initialState(level: CodeLevel): RunnerState {
  return {
    r: level.start.r,
    c: level.start.c,
    facing: level.start.facing,
    collectedStars: [],
  };
}

export interface StepResult {
  state: RunnerState;
  ok: boolean;
  message?: string;
}

export function executeCommand(
  state: RunnerState,
  command: CommandType,
  level: CodeLevel
): StepResult {
  if (command === "right") {
    return { state: { ...state, facing: RIGHT_TURN[state.facing] }, ok: true };
  }
  if (command === "left") {
    return { state: { ...state, facing: LEFT_TURN[state.facing] }, ok: true };
  }
  if (command === "forward") {
    const { dr, dc } = DIRS[state.facing];
    const nr = state.r + dr;
    const nc = state.c + dc;
    if (nr < 0 || nr >= level.rows || nc < 0 || nc >= level.cols) {
      return { state, ok: false, message: "Oops! You walked off the grid!" };
    }
    if (level.walls.some((w) => w.r === nr && w.c === nc)) {
      return { state, ok: false, message: "Oops! That's a wall!" };
    }
    const newState = { ...state, r: nr, c: nc };
    // Auto-pickup any star at new position
    const starHere = level.stars.find(
      (s) => s.r === nr && s.c === nc && !state.collectedStars.some((cs) => cs.r === nr && cs.c === nc)
    );
    if (starHere) {
      newState.collectedStars = [...state.collectedStars, starHere];
    }
    return { state: newState, ok: true };
  }
  return { state, ok: false, message: "Unknown command" };
}

export function checkWin(state: RunnerState, level: CodeLevel): boolean {
  const atGoal = state.r === level.goal.r && state.c === level.goal.c;
  const allStars = state.collectedStars.length === level.stars.length;
  return atGoal && allStars;
}

export function getStarRating(commandCount: number, optimalCount: number): number {
  if (commandCount <= optimalCount) return 3;
  if (commandCount <= optimalCount + 2) return 2;
  return 1;
}
