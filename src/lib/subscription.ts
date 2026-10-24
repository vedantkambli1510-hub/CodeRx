"use client";

import { useState, useEffect } from "react";

export interface SubscriptionStatus {
  isSubscribed: boolean;
  plan: "INDIVIDUAL" | "FAMILY" | "PREMIUM" | null;
  isLoaded: boolean;
}

export function getSubscriptionStatus(): {
  isSubscribed: boolean;
  plan: "INDIVIDUAL" | "FAMILY" | "PREMIUM" | null;
} {
  if (typeof window === "undefined") {
    return { isSubscribed: false, plan: null };
  }
  const isSubscribed = localStorage.getItem("coderx_subscribed") === "true";
  const plan = (localStorage.getItem("coderx_subscription_plan") as "INDIVIDUAL" | "FAMILY" | "PREMIUM") || (isSubscribed ? "FAMILY" : null);
  return { isSubscribed, plan };
}

export function setSubscriptionStatus(
  subscribed: boolean,
  plan: "INDIVIDUAL" | "FAMILY" | "PREMIUM" = "FAMILY"
) {
  if (typeof window === "undefined") return;
  if (subscribed) {
    localStorage.setItem("coderx_subscribed", "true");
    localStorage.setItem("coderx_subscription_plan", plan);
    localStorage.setItem("coderx_family_pass_active", plan === "FAMILY" || plan === "PREMIUM" ? "true" : "false");
    localStorage.setItem("coderx_ai_story_unlocked", "true");
  } else {
    localStorage.removeItem("coderx_subscribed");
    localStorage.removeItem("coderx_subscription_plan");
    localStorage.removeItem("coderx_family_pass_active");
    localStorage.removeItem("coderx_ai_story_unlocked");
  }
  window.dispatchEvent(new Event("coderx_subscription_change"));
}

export function useSubscription(): SubscriptionStatus & {
  updateSubscription: typeof setSubscriptionStatus;
} {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    plan: null,
    isLoaded: false,
  });

  useEffect(() => {
    function update() {
      const isSubscribed = localStorage.getItem("coderx_subscribed") === "true";
      const plan =
        (localStorage.getItem("coderx_subscription_plan") as "INDIVIDUAL" | "FAMILY" | "PREMIUM") ||
        (isSubscribed ? "FAMILY" : null);

      setStatus({
        isSubscribed,
        plan,
        isLoaded: true,
      });
    }

    update();
    window.addEventListener("coderx_subscription_change", update);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("coderx_subscription_change", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return {
    ...status,
    updateSubscription: setSubscriptionStatus,
  };
}
