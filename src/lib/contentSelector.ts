import { Question, Word, Video, FunFact } from "@/types";

function hashDate(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash << 5) - hash + date.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getUsedIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function addUsedIds(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  const existing = getUsedIds(key);
  const combined = [...existing, ...ids];
  // Keep only last 14 days worth (rough: 140 questions, 140 words)
  const trimmed = combined.slice(-200);
  localStorage.setItem(key, JSON.stringify(trimmed));
}

export function selectDailyQuestions(
  allQuestions: Question[],
  date: string,
  count: number = 10
): Question[] {
  const usedIds = getUsedIds("brainspark_used_questions");
  const subjects: Question["subject"][] = ["math", "english", "science", "gk"];
  const perSubject = Math.ceil(count / subjects.length);
  const seed = hashDate(date);

  const selected: Question[] = [];

  for (const subject of subjects) {
    const subjectQs = allQuestions.filter((q) => q.subject === subject);
    const available = subjectQs.filter((q) => !usedIds.includes(q.id));
    const pool = available.length >= perSubject ? available : subjectQs;
    const shuffled = seededShuffle(pool, seed + subject.charCodeAt(0));
    selected.push(...shuffled.slice(0, perSubject));
  }

  const result = seededShuffle(selected, seed).slice(0, count);
  addUsedIds(
    "brainspark_used_questions",
    result.map((q) => q.id)
  );
  return result;
}

export function selectDailyWords(
  allWords: Word[],
  date: string,
  count: number = 10
): Word[] {
  const usedIds = getUsedIds("brainspark_used_words");
  const available = allWords.filter((w) => !usedIds.includes(w.id));
  const pool = available.length >= count ? available : allWords;
  const seed = hashDate(date);
  const shuffled = seededShuffle(pool, seed);
  const result = shuffled.slice(0, count);
  addUsedIds(
    "brainspark_used_words",
    result.map((w) => w.id)
  );
  return result;
}

export function selectDailyVideo(allVideos: Video[], date: string): Video {
  // Use date-seeded index so same date always picks same video
  const seed = hashDate(date);
  const index = seed % allVideos.length;
  return allVideos[index];
}

export function selectDailyFunFact(allFacts: FunFact[], date: string): FunFact {
  const seed = hashDate(date + "funfact");
  const index = seed % allFacts.length;
  return allFacts[index];
}

export function selectReviewQuestions(
  iqQuestions: Question[],
  todayWords: Word[],
  wrongQuestionIds: string[],
  allQuestions: Question[],
  date: string
): Question[] {
  const seed = hashDate(date + "review");
  const result: Question[] = [];

  // 6 IQ questions
  const shuffledIq = seededShuffle(iqQuestions, seed);
  result.push(...shuffledIq.slice(0, 6));

  // 4 reinforcement questions from today's words
  const wordQuestions: Question[] = todayWords.slice(0, 4).map((w, i) => ({
    id: `review-word-${i}`,
    subject: "english" as const,
    question: `What does "${w.word}" mean?`,
    options: generateWordOptions(w, todayWords, seed + i),
    correctIndex: 0,
    explanation: `"${w.word}" means: ${w.definition}`,
    difficulty: 1,
    source: "bank" as const,
  }));

  // Shuffle the correct answer position
  for (const wq of wordQuestions) {
    const correctAnswer = wq.options[0];
    const shuffledOpts = seededShuffle([...wq.options], seed + wq.id.charCodeAt(0));
    wq.options = shuffledOpts as [string, string, string, string];
    wq.correctIndex = shuffledOpts.indexOf(correctAnswer);
  }

  result.push(...wordQuestions);
  return result.slice(0, 10);
}

function generateWordOptions(
  correctWord: Word,
  allWords: Word[],
  seed: number
): [string, string, string, string] {
  const others = allWords
    .filter((w) => w.id !== correctWord.id)
    .map((w) => w.definition);
  const shuffled = seededShuffle(others, seed);
  return [
    correctWord.definition,
    shuffled[0] || "Something very small",
    shuffled[1] || "A type of animal",
    shuffled[2] || "A color",
  ];
}

export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}
