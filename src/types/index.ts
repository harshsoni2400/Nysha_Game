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

export interface UserProfile {
  name: string;
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string;
  totalSessions: number;
}

export interface Country {
  id: string;
  name: string;
  capital: string;
  continent: string;
  language: string;
  flag: string;
  currency: string;
  funFact: string;
  famousFor: string;
  greeting: string;
}

export interface FunFact {
  id: string;
  category: "animals" | "places" | "flags" | "space";
  title: string;
  emoji: string;
  image: string;
  facts: [string, string, string, string, string];
}
