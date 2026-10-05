"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "scintillar-analytics-consent";
type Consent = "granted" | "denied" | "unset";

// Consent lives in localStorage; this tiny store lets React read it without an effect.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readConsent(): Consent {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : "unset";
  } catch {
    return "unset";
  }
}

function writeConsent(value: "granted" | "denied") {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage blocked: the banner will ask again next visit.
  }
  listeners.forEach((l) => l());
}

interface AnalyticsProps {
  gaId?: string;
  privacyHref: string;
  t: { body: string; accept: string; decline: string; learn: string };
}

/** Asks before loading Google Analytics (Québec Law 25). Renders nothing without a GA ID. */
export function Analytics({ gaId, privacyHref, t }: AnalyticsProps) {
  // "pending" on the server and during hydration, so the banner never flashes for people who already chose.
  const consent = useSyncExternalStore<Consent | "pending">(subscribe, readConsent, () => "pending");

  if (!gaId) return null;
  if (consent === "granted") return <GoogleAnalytics gaId={gaId} />;
  if (consent !== "unset") return null;

  return (
    <div
      role="region"
      aria-label="Analytics consent"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg sm:flex sm:items-center sm:gap-4"
    >
      <p className="text-sm font-light">
        {t.body}{" "}
        <Link href={privacyHref} className="font-medium text-primary underline-offset-4 hover:underline">
          {t.learn}
        </Link>
      </p>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <Button size="sm" variant="outline" onClick={() => writeConsent("denied")}>
          {t.decline}
        </Button>
        <Button size="sm" onClick={() => writeConsent("granted")}>
          {t.accept}
        </Button>
      </div>
    </div>
  );
}
