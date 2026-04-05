"use client";

import { useCallback } from "react";

type SoundName = "correct" | "wrong" | "flip" | "match" | "cheer" | "complete";

const FREQUENCIES: Record<SoundName, number[]> = {
  correct: [523, 659, 784],
  wrong: [300, 250],
  flip: [440],
  match: [523, 659],
  cheer: [523, 587, 659, 784, 880],
  complete: [523, 659, 784, 1047],
};

const DURATIONS: Record<SoundName, number> = {
  correct: 150,
  wrong: 200,
  flip: 50,
  match: 150,
  cheer: 120,
  complete: 200,
};

export function useSound() {
  const play = useCallback((name: SoundName) => {
    try {
      const ctx = new AudioContext();
      const freqs = FREQUENCIES[name];
      const dur = DURATIONS[name] / 1000;

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = name === "wrong" ? "sawtooth" : "sine";
        osc.frequency.value = freq;
        gain.gain.value = 0.15;
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (i + 1) * dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * dur);
        osc.stop(ctx.currentTime + (i + 1) * dur + 0.05);
      });
    } catch {
      // Audio not available
    }
  }, []);

  return { play };
}
