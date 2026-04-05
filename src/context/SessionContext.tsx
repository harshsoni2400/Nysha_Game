"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserProfile } from "@/types";
import { getTodayDate } from "@/lib/contentSelector";

interface SessionContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateStreak: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("brainspark_profile");
    if (savedProfile) {
      setProfileState(JSON.parse(savedProfile));
    }
  }, []);

  const setProfile = useCallback((p: UserProfile) => {
    setProfileState(p);
    localStorage.setItem("brainspark_profile", JSON.stringify(p));
  }, []);

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
    <SessionContext.Provider value={{ profile, setProfile, updateStreak }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
