import { Question, Word } from "@/types";

const QUESTION_PROMPT = `You are a children's education content creator for 6-year-old children.
Generate multiple-choice questions that are age-appropriate, encouraging, and educational.
Return valid JSON array matching this schema exactly:
[{
  "id": "gen-XXX",
  "subject": "math"|"english"|"science"|"gk"|"iq",
  "question": "question text",
  "options": ["option1", "option2", "option3", "option4"],
  "correctIndex": 0-3,
  "explanation": "friendly explanation",
  "difficulty": 1-2,
  "source": "generated"
}]`;

const WORD_PROMPT = `You are a children's vocabulary teacher for 6-year-old children.
Generate vocabulary words that are slightly above a 6-year-old's current level but learnable.
Return valid JSON array matching this schema exactly:
[{
  "id": "gen-word-XXX",
  "word": "the word",
  "pronunciation": "phonetic guide like ee-NOR-mus",
  "definition": "simple definition a child can understand",
  "example": "example sentence using the word",
  "partOfSpeech": "noun/verb/adjective/adverb",
  "emoji": "relevant emoji",
  "source": "generated"
}]`;

export function getQuestionPrompt(subject: string, count: number): string {
  return `${QUESTION_PROMPT}\n\nGenerate ${count} ${subject} questions for a 6-year-old. Return only the JSON array, no other text.`;
}

export function getWordPrompt(count: number): string {
  return `${WORD_PROMPT}\n\nGenerate ${count} vocabulary words. Return only the JSON array, no other text.`;
}

export function parseGeneratedQuestions(text: string): Question[] {
  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [];
    return JSON.parse(match[0]);
  } catch {
    return [];
  }
}

export function parseGeneratedWords(text: string): Word[] {
  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [];
    return JSON.parse(match[0]);
  } catch {
    return [];
  }
}
