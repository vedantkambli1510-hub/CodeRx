"use client";

import { useState, useEffect, useCallback } from "react";

export const DEFAULT_PATIENT_AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80";

const STORAGE_KEY = "coderx_patient_avatar";

export function savePatientAvatar(dataUrl: string) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, dataUrl);
      window.dispatchEvent(new Event("patient_avatar_updated"));
    } catch (e) {
      console.warn("Failed to persist avatar to localStorage", e);
    }
  }
}

export function removePatientAvatar() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("patient_avatar_updated"));
    } catch (e) {
      console.warn("Failed to remove avatar from localStorage", e);
    }
  }
}

export function usePatientAvatar(fallback = DEFAULT_PATIENT_AVATAR) {
  const [avatarUrl, setAvatarUrlState] = useState<string>(fallback);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const syncAvatar = useCallback(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAvatarUrlState(stored);
        setIsCustom(true);
      } else {
        setAvatarUrlState(fallback);
        setIsCustom(false);
      }
    }
  }, [fallback]);

  useEffect(() => {
    syncAvatar();

    const handleUpdate = () => syncAvatar();
    window.addEventListener("patient_avatar_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("patient_avatar_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [syncAvatar]);

  const setAvatar = useCallback((dataUrl: string) => {
    savePatientAvatar(dataUrl);
    setAvatarUrlState(dataUrl);
    setIsCustom(true);
  }, []);

  const removeAvatar = useCallback(() => {
    removePatientAvatar();
    setAvatarUrlState(fallback);
    setIsCustom(false);
  }, [fallback]);

  return {
    avatarUrl,
    isCustom,
    setAvatar,
    removeAvatar,
  };
}
