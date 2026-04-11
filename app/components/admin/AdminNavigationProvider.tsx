"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

const MIN_VISIBLE_PROGRESS_MS = 240;
const INITIAL_PROGRESS = 18;
const PROGRESS_TICK_MS = 120;
const MAX_IN_PROGRESS = 92;
const COMPLETION_HIDE_DELAY_MS = 180;
const MAX_NAVIGATION_WAIT_MS = 10000;
const IDLE_PROGRESS = 0;

type NavigationPendingState = {
  href: string;
  startedAt: number;
};

type AdminNavigationContextValue = {
  isNavigating: boolean;
  progress: number;
  pendingHref: string | null;
  startNavigation: (href: string) => void;
  completeNavigation: () => void;
  isHrefPending: (href: string) => boolean;
};

const AdminNavigationContext = createContext<AdminNavigationContextValue | null>(null);

function normalizePath(value: string) {
  if (!value) {
    return "/";
  }

  const pathname = new URL(value, "http://localhost").pathname;
  return pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function clampProgress(value: number) {
  return Math.max(IDLE_PROGRESS, Math.min(MAX_IN_PROGRESS, value));
}

export function AdminNavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(IDLE_PROGRESS);
  const [pendingState, setPendingState] = useState<NavigationPendingState | null>(null);
  const completionTimeoutRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (completionTimeoutRef.current !== null) {
      window.clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }

    if (progressIntervalRef.current !== null) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const resetNavigation = useCallback(() => {
    clearTimers();
    setPendingState(null);
    setProgress(IDLE_PROGRESS);
  }, [clearTimers]);

  const completeNavigation = useCallback(() => {
    clearTimers();
    setPendingState(null);
    setProgress(100);

    completionTimeoutRef.current = window.setTimeout(() => {
      setProgress(IDLE_PROGRESS);
      completionTimeoutRef.current = null;
    }, COMPLETION_HIDE_DELAY_MS);
  }, [clearTimers]);

  const startNavigation = useCallback(
    (href: string) => {
      clearTimers();
      const normalizedHref = normalizePath(href);
      const now = Date.now();

      setPendingState({ href: normalizedHref, startedAt: now });
      setProgress((current) => Math.max(current, INITIAL_PROGRESS));

      progressIntervalRef.current = window.setInterval(() => {
        setProgress((current) => {
          if (current >= MAX_IN_PROGRESS) {
            return current;
          }

          const remaining = MAX_IN_PROGRESS - current;
          const nextStep = Math.max(1, Math.round(remaining * 0.18));
          return clampProgress(current + nextStep);
        });
      }, PROGRESS_TICK_MS);
    },
    [clearTimers]
  );

  useEffect(() => {
    if (!pendingState) {
      return;
    }

    const currentPath = normalizePath(pathname ?? "/");

    if (currentPath !== pendingState.href) {
      return;
    }

    const elapsed = Date.now() - pendingState.startedAt;
    const remainingVisibleTime = Math.max(0, MIN_VISIBLE_PROGRESS_MS - elapsed);
    const timeout = window.setTimeout(completeNavigation, remainingVisibleTime);

    return () => window.clearTimeout(timeout);
  }, [completeNavigation, pathname, pendingState]);

  useEffect(() => {
    if (!pendingState) {
      return;
    }

    const timeout = window.setTimeout(resetNavigation, MAX_NAVIGATION_WAIT_MS);
    return () => window.clearTimeout(timeout);
  }, [pendingState, resetNavigation]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const value = useMemo<AdminNavigationContextValue>(
    () => ({
      isNavigating: progress > IDLE_PROGRESS,
      progress,
      pendingHref: pendingState?.href ?? null,
      startNavigation,
      completeNavigation,
      isHrefPending: (href: string) => pendingState?.href === normalizePath(href),
    }),
    [completeNavigation, pendingState?.href, progress, startNavigation]
  );

  return <AdminNavigationContext.Provider value={value}>{children}</AdminNavigationContext.Provider>;
}

export function useAdminNavigation() {
  const context = useContext(AdminNavigationContext);

  if (!context) {
    throw new Error("useAdminNavigation must be used within an AdminNavigationProvider.");
  }

  return context;
}
