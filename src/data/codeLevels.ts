export type Direction = "up" | "right" | "down" | "left";
export type CommandType = "forward" | "right" | "left" | "pickup";

export interface CodeLevel {
  id: number;
  name: string;
  intro: string;
  rows: number;
  cols: number;
  start: { r: number; c: number; facing: Direction };
  goal: { r: number; c: number };
  walls: { r: number; c: number }[];
  stars: { r: number; c: number }[];
  availableCommands: CommandType[];
  maxCommands: number;
  optimalCount: number;
}

// Level design: gradually introduce concepts
export const CODE_LEVELS: CodeLevel[] = [
  // Level 1 - just press forward
  {
    id: 1,
    name: "First Steps",
    intro: "Tap the ⬆️ arrow 4 times to walk to the trophy! Then press RUN.",
    rows: 1,
    cols: 5,
    start: { r: 0, c: 0, facing: "right" },
    goal: { r: 0, c: 4 },
    walls: [],
    stars: [],
    availableCommands: ["forward"],
    maxCommands: 6,
    optimalCount: 4,
  },
  // Level 2 - longer straight path
  {
    id: 2,
    name: "Keep Going",
    intro: "Just walk forward to reach the trophy!",
    rows: 1,
    cols: 6,
    start: { r: 0, c: 0, facing: "right" },
    goal: { r: 0, c: 5 },
    walls: [],
    stars: [],
    availableCommands: ["forward"],
    maxCommands: 7,
    optimalCount: 5,
  },
  // Level 3 - walking down (different direction)
  {
    id: 3,
    name: "Going Down",
    intro: "Walk down to the trophy!",
    rows: 5,
    cols: 1,
    start: { r: 0, c: 0, facing: "down" },
    goal: { r: 4, c: 0 },
    walls: [],
    stars: [],
    availableCommands: ["forward"],
    maxCommands: 6,
    optimalCount: 4,
  },
  // Level 4 - introduce turn right (corner)
  {
    id: 4,
    name: "Turn Right",
    intro: "Walk forward, then turn right ↪️, then walk again!",
    rows: 4,
    cols: 4,
    start: { r: 0, c: 0, facing: "right" },
    goal: { r: 3, c: 3 },
    walls: [],
    stars: [],
    availableCommands: ["forward", "right"],
    maxCommands: 10,
    optimalCount: 7,
  },
  // Level 5 - introduce turn left
  {
    id: 5,
    name: "Turn Left",
    intro: "Try turning left ↩️ this time!",
    rows: 4,
    cols: 4,
    start: { r: 0, c: 3, facing: "down" },
    goal: { r: 3, c: 0 },
    walls: [],
    stars: [],
    availableCommands: ["forward", "right", "left"],
    maxCommands: 10,
    optimalCount: 7,
  },
  // Level 6 - L-shape with walls
  {
    id: 6,
    name: "Around the Wall",
    intro: "Walls block your way - go around them!",
    rows: 4,
    cols: 4,
    start: { r: 0, c: 0, facing: "right" },
    goal: { r: 3, c: 3 },
    walls: [
      { r: 1, c: 1 },
      { r: 2, c: 1 },
      { r: 1, c: 2 },
    ],
    stars: [],
    availableCommands: ["forward", "right", "left"],
    maxCommands: 12,
    optimalCount: 8,
  },
  // Level 7 - introduce stars
  {
    id: 7,
    name: "Collect a Star",
    intro: "Collect the ⭐ star on your way! Walk over it to pick it up.",
    rows: 1,
    cols: 5,
    start: { r: 0, c: 0, facing: "right" },
    goal: { r: 0, c: 4 },
    walls: [],
    stars: [{ r: 0, c: 2 }],
    availableCommands: ["forward"],
    maxCommands: 6,
    optimalCount: 4,
  },
  // Level 8 - L-shape with stars
  {
    id: 8,
    name: "Two Stars",
    intro: "Pick up both stars before reaching the trophy!",
    rows: 4,
    cols: 4,
    start: { r: 0, c: 0, facing: "right" },
    goal: { r: 3, c: 3 },
    walls: [],
    stars: [
      { r: 0, c: 2 },
      { r: 2, c: 3 },
    ],
    availableCommands: ["forward", "right", "left"],
    maxCommands: 12,
    optimalCount: 7,
  },
  // Level 9 - zigzag with multiple stars
  {
    id: 9,
    name: "Star Adventure",
    intro: "Three stars to collect! Plan your path carefully.",
    rows: 5,
    cols: 5,
    start: { r: 0, c: 0, facing: "right" },
    goal: { r: 4, c: 4 },
    walls: [
      { r: 1, c: 1 },
      { r: 1, c: 2 },
      { r: 3, c: 2 },
      { r: 3, c: 3 },
    ],
    stars: [
      { r: 0, c: 3 },
      { r: 2, c: 2 },
      { r: 4, c: 1 },
    ],
    availableCommands: ["forward", "right", "left"],
    maxCommands: 18,
    optimalCount: 14,
  },
];
