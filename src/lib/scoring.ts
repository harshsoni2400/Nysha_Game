export function getStarRating(score: number, total: number): number {
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  return 1;
}

export function getEncouragement(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1) return "Perfect score! You're a superstar!";
  if (pct >= 0.8) return "Amazing job! You're so smart!";
  if (pct >= 0.6) return "Great work! Keep it up!";
  if (pct >= 0.4) return "Good try! You're learning every day!";
  return "Nice effort! Practice makes perfect!";
}

export function getMascotExpression(score: number, total: number): "celebrating" | "happy" | "thinking" {
  const pct = score / total;
  if (pct >= 0.8) return "celebrating";
  if (pct >= 0.5) return "happy";
  return "thinking";
}
