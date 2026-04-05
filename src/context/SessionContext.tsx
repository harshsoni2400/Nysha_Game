"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DailySession, UserProfile, Activity, ACTIVITY_ORDER } from "@/types";
import { getTodayDate } from "@/lib/contentSelector";

interface SessionContextType {
  profile: UserProfile | null;
  session: DailySession;
  setProfile: (profile: UserProfile) => void;
  completeActivity: (activity: Activity) => void;
  updateQuizAnswer: (questionId: string, answerIndex: number, correct: boolean) => void;
  updateReviewAnswer: (questionId: string, answerIndex: number, correct: boolean) => void;
  completeWords: () => void;
  completeGame: (moves: number, timeSeconds: number) => void;
  completeVideo: () => void;
  completeFunFacts: () => void;
  isActivityUnlocked: (activity: Activity) => boolean;
  isActivityCompleted: (activity: Activity) => boolean;
  nextActivity: () => Activity | null;
  updateStreak: () => void;
}

const defaultSession: DailySession = {
  date: "",
  quizQuestionIds: [],
  quizAnswers: {},
  quizScore: 0,
  wordIds: [],
  wordsCompleted: false,
  gameCompleted: false,
  gameMoves: 0,
  gameTimeSeconds: 0,
  videoId: "",
  videoWatched: false,
  reviewQuestionIds: [],
  reviewAnswers: {},
  reviewScore: 0,
  completedActivities: [],
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<DailySession>({ ...defaultSession, date: getTodayDate() });

  useEffect(() => {
    const savedProfile = localStorage.getItem("brainspark_profile");
    if (savedProfile) {
      setProfileState(JSON.parse(savedProfile));
    }

    const today = getTodayDate();
    const savedSession = localStorage.getItem(`brainspark_session_${today}`);
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    } else {
      setSession({ ...defaultSession, date: today });
    }
  }, []);

  const saveSession = useCallback((s: DailySession) => {
    setSession(s);
    localStorage.setItem(`brainspark_session_${s.date}`, JSON.stringify(s));
  }, []);

  const setProfile = useCallback((p: UserProfile) => {
    setProfileState(p);
    localStorage.setItem("brainspark_profile", JSON.stringify(p));
  }, []);

  const completeActivity = useCallback((activity: Activity) => {
    setSession((prev) => {
      if (prev.completedActivities.includes(activity)) return prev;
      const updated = {
        ...prev,
        completedActivities: [...prev.completedActivities, activity],
      };
      localStorage.setItem(`brainspark_session_${updated.date}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateQuizAnswer = useCallback((questionId: string, answerIndex: number, correct: boolean) => {
    setSession((prev) => {
      const updated = {
        ...prev,
        quizAnswers: { ...prev.quizAnswers, [questionId]: answerIndex },
        quizScore: prev.quizScore + (correct ? 1 : 0),
      };
      localStorage.setItem(`brainspark_session_${updated.date}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateReviewAnswer = useCallback((questionId: string, answerIndex: number, correct: boolean) => {
    setSession((prev) => {
      const updated = {
        ...prev,
        reviewAnswers: { ...prev.reviewAnswers, [questionId]: answerIndex },
        reviewScore: prev.reviewScore + (correct ? 1 : 0),
      };
      localStorage.setItem(`brainspark_session_${updated.date}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeWords = useCallback(() => {
    setSession((prev) => {
      const updated = { ...prev, wordsCompleted: true };
      if (!updated.completedActivities.includes("words")) {
        updated.completedActivities = [...updated.completedActivities, "words"];
      }
      localStorage.setItem(`brainspark_session_${updated.date}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeGame = useCallback((moves: number, timeSeconds: number) => {
    setSession((prev) => {
      const updated = {
        ...prev,
        gameCompleted: true,
        gameMoves: moves,
        gameTimeSeconds: timeSeconds,
      };
      if (!updated.completedActivities.includes("game")) {
        updated.completedActivities = [...updated.completedActivities, "game"];
      }
      localStorage.setItem(`brainspark_session_${updated.date}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeVideo = useCallback(() => {
    setSession((prev) => {
      const updated = { ...prev, videoWatched: true };
      if (!updated.completedActivities.includes("video")) {
        updated.completedActivities = [...updated.completedActivities, "video"];
      }
      localStorage.setItem(`brainspark_session_${updated.date}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeFunFacts = useCallback(() => {
    setSession((prev) => {
      const updated = { ...prev };
      if (!updated.completedActivities.includes("funfacts")) {
        updated.completedActivities = [...updated.completedActivities, "funfacts"];
      }
      localStorage.setItem(`brainspark_session_${updated.date}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isActivityCompleted = useCallback(
    (activity: Activity) => session.completedActivities.includes(activity),
    [session.completedActivities]
  );

  const isActivityUnlocked = useCallback(
    (activity: Activity) => {
      const idx = ACTIVITY_ORDER.indexOf(activity);
      if (idx === 0) return true;
      const prev = ACTIVITY_ORDER[idx - 1];
      return session.completedActivities.includes(prev);
    },
    [session.completedActivities]
  );

  const nextActivity = useCallback((): Activity | null => {
    for (const a of ACTIVITY_ORDER) {
      if (!session.completedActivities.includes(a)) return a;
    }
    return null;
  }, [session.completedActivities]);

  const updateStreak = useCallback(() => {
    if (!profile) return;
    const today = getTodayDate();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = profile.currentStreak;
    if (profile.lastSessionDate === yesterdayStr) {
      newStreak += 1;
    } else if (profile.lastSessionDate !== today) {
      newStreak = 1;
    }

    const updated: UserProfile = {
      ...profile,
      currentStreak: newStreak,
      longestStreak: Math.max(profile.longestStreak, newStreak),
      lastSessionDate: today,
      totalSessions: profile.totalSessions + (profile.lastSessionDate === today ? 0 : 1),
    };
    setProfile(updated);
  }, [profile, setProfile]);

  return (
    <SessionContext.Provider
      value={{
        profile,
        session,
        setProfile,
        completeActivity,
        updateQuizAnswer,
        updateReviewAnswer,
        completeWords,
        completeGame,
        completeVideo,
        completeFunFacts,
        isActivityUnlocked,
        isActivityCompleted,
        nextActivity,
        updateStreak,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
