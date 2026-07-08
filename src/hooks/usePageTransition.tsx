import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PageTransitionOverlay } from "../components/PageTransitionOverlay";

export type PageTransitionVariant =
  | "solar"
  | "blackhole"
  | "archive"
  | "default";

export type PageTransitionPhase =
  | "idle"
  | "departing"
  | "arriving"
  | "releasing";

export interface PageTransitionState {
  phase: PageTransitionPhase;
  variant: PageTransitionVariant;
  label: string;
  targetPath: string | null;
}

interface StoredTransition {
  variant: PageTransitionVariant;
  label: string;
  targetPath: string;
  createdAt: number;
}

interface PageTransitionContextValue {
  isTransitioning: boolean;
  transitionTo: (
    targetPath: string,
    variant?: PageTransitionVariant,
    label?: string,
  ) => boolean;
  transitionLink: (
    event: MouseEvent<HTMLAnchorElement>,
    targetPath: string,
    variant?: PageTransitionVariant,
    label?: string,
  ) => boolean;
}

const STORAGE_KEY = "starvista:page-transition";
const ARRIVAL_MAX_AGE_MS = 12_000;
const LABELS: Record<PageTransitionVariant, string> = {
  solar: "CALIBRATING ORBITAL MAP",
  blackhole: "ENTERING GRAVITY WELL",
  archive: "RETURNING TO STAR ARCHIVE",
  default: "ALIGNING CELESTIAL VECTOR",
};

let cachedArrival: StoredTransition | null | undefined;

function readArrival(): StoredTransition | null {
  if (cachedArrival !== undefined) {
    return cachedArrival;
  }

  cachedArrival = null;
  try {
    const storedValue = window.sessionStorage.getItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
    if (!storedValue) {
      return cachedArrival;
    }

    const parsed = JSON.parse(storedValue) as StoredTransition;
    if (
      LABELS[parsed.variant] &&
      typeof parsed.label === "string" &&
      typeof parsed.targetPath === "string" &&
      Date.now() - parsed.createdAt < ARRIVAL_MAX_AGE_MS
    ) {
      cachedArrival = parsed;
    }
  } catch {
    cachedArrival = null;
  }

  return cachedArrival;
}

function getInitialState(): PageTransitionState {
  const arrival = readArrival();
  if (arrival) {
    return {
      phase: "arriving",
      variant: arrival.variant,
      label: arrival.label,
      targetPath: arrival.targetPath,
    };
  }

  return {
    phase: "idle",
    variant: "default",
    label: LABELS.default,
    targetPath: null,
  };
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null,
);

interface PageTransitionProviderProps {
  children: ReactNode;
}

export function PageTransitionProvider({
  children,
}: PageTransitionProviderProps) {
  const [transition, setTransition] = useState<PageTransitionState>(getInitialState);
  const lockedRef = useRef(transition.phase !== "idle");
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const unlockPage = useCallback(() => {
    document.documentElement.classList.remove(
      "page-transition-lock",
      "page-transition-arriving",
    );
    lockedRef.current = false;
    setTransition((current) => ({ ...current, phase: "idle", targetPath: null }));
  }, []);

  useEffect(() => {
    if (transition.phase !== "arriving") {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.documentElement.classList.add(
      "page-transition-lock",
      "page-transition-arriving",
    );

    const releaseTimer = window.setTimeout(
      () => setTransition((current) => ({ ...current, phase: "releasing" })),
      reducedMotion ? 40 : 300,
    );
    const finishTimer = window.setTimeout(
      unlockPage,
      reducedMotion ? 220 : 780,
    );
    timersRef.current.push(releaseTimer, finishTimer);

  }, [clearTimers, transition.phase, unlockPage]);

  useEffect(
    () => () => {
      clearTimers();
      document.documentElement.classList.remove(
        "page-transition-lock",
        "page-transition-arriving",
      );
    },
    [clearTimers],
  );

  const transitionTo = useCallback(
    (
      targetPath: string,
      variant: PageTransitionVariant = "default",
      label = LABELS[variant],
    ) => {
      if (lockedRef.current) {
        return false;
      }

      let destination: URL;
      try {
        destination = new URL(targetPath, window.location.href);
      } catch {
        return false;
      }

      if (destination.origin !== window.location.origin) {
        return false;
      }

      clearTimers();
      lockedRef.current = true;
      document.documentElement.classList.add("page-transition-lock");
      setTransition({ phase: "departing", variant, label, targetPath });

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const navigationTimer = window.setTimeout(() => {
        const storedTransition: StoredTransition = {
          variant,
          label,
          targetPath,
          createdAt: Date.now(),
        };
        try {
          window.sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(storedTransition),
          );
        } catch {
          // Navigation should still work if session storage is unavailable.
        }

        try {
          window.location.assign(destination.href);
        } catch {
          try {
            window.sessionStorage.removeItem(STORAGE_KEY);
          } catch {
            // Storage may be unavailable for the same reason as above.
          }
          unlockPage();
        }
      }, reducedMotion ? 140 : 860);

      const recoveryTimer = window.setTimeout(() => {
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // The overlay recovery must not depend on storage access.
        }
        unlockPage();
      }, 4_500);
      timersRef.current.push(navigationTimer, recoveryTimer);
      return true;
    },
    [clearTimers, unlockPage],
  );

  const transitionLink = useCallback(
    (
      event: MouseEvent<HTMLAnchorElement>,
      targetPath: string,
      variant: PageTransitionVariant = "default",
      label?: string,
    ) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.currentTarget.target === "_blank" ||
        event.currentTarget.hasAttribute("download")
      ) {
        return false;
      }

      event.preventDefault();
      return transitionTo(targetPath, variant, label);
    },
    [transitionTo],
  );

  const contextValue = useMemo<PageTransitionContextValue>(
    () => ({
      isTransitioning: transition.phase !== "idle",
      transitionTo,
      transitionLink,
    }),
    [transition.phase, transitionLink, transitionTo],
  );

  return (
    <PageTransitionContext.Provider value={contextValue}>
      {children}
      <PageTransitionOverlay transition={transition} />
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error(
      "usePageTransition must be used within PageTransitionProvider",
    );
  }

  return context;
}
