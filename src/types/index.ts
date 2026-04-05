export interface Question {
  id: string;
  subject: "math" | "english" | "science" | "gk" | "iq";
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  difficulty: 1 | 2 | 3;
  source: "bank" | "generated";
}

export interface Word {
  id: string;
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  partOfSpeech: string;
  emoji: string;
  source: "bank" | "generated";
}

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  channel: string;
  subject: "math" | "english" | "science" | "gk";
  durationSeconds: number;
}

export interface DailySession {
  date: string;
  quizQuestionIds: string[];
  quizAnswers: Record<string, number>;
  quizScore: number;
  wordIds: string[];
  wordsCompleted: boolean;
  gameCompleted: boolean;
  gameMoves: number;
  gameTimeSeconds: number;
  videoId: string;
  videoWatched: boolean;
  reviewQuestionIds: string[];
  reviewAnswers: Record<string, number>;
  reviewScore: number;
  completedActivities: string[];
}

export interface UserProfile {
  name: string;
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string;
  totalSessions: number;
}

export interface GeneratedCache {
  questions: Question[];
  words: Word[];
  lastGenerated: string;
}

export type Activity = "quiz" | "words" | "game" | "video" | "review";

export const ACTIVITY_ORDER: Activity[] = ["quiz", "words", "game", "video", "review"];
