import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type { JSX } from "react";

import { formatDuration } from "../../utils/time";

type Phase = "focus" | "short_break";

interface PomodoroState {
  phase: Phase;
  remainingSeconds: number;
  remainingFormatted: string;
  isRunning: boolean;
}

type Action =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "TICK" }
  | { type: "CHANGE_PHASE"; phase: Phase; remainingSeconds: number };

interface PomodoroContextValue {
  state: PomodoroState;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

const FOCUS_SECONDS = 25 * 60;
const SHORT_BREAK_SECONDS = 5 * 60;

const initialState: PomodoroState = {
  phase: "focus",
  remainingSeconds: FOCUS_SECONDS,
  remainingFormatted: formatDuration(FOCUS_SECONDS),
  isRunning: false,
};

type WindowWithWebkitAudioContext = Window &
  typeof globalThis & {
    AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
};

function reducer(state: PomodoroState, action: Action): PomodoroState {
  switch (action.type) {
    case "START":
      return { ...state, isRunning: true };
    case "PAUSE":
      return { ...state, isRunning: false };
    case "RESET":
      return { ...initialState };
    case "TICK": {
      const next = Math.max(state.remainingSeconds - 1, 0);
      return {
        ...state,
        remainingSeconds: next,
        remainingFormatted: formatDuration(next),
        isRunning: next > 0 && state.isRunning,
      };
    }
    case "CHANGE_PHASE":
      return {
        phase: action.phase,
        remainingSeconds: action.remainingSeconds,
        remainingFormatted: formatDuration(action.remainingSeconds),
        isRunning: false,
      };
    default:
      return state;
  }
}

function getNextPhase(current: Phase): { phase: Phase; duration: number } {
  if (current === "focus") {
    return { phase: "short_break", duration: SHORT_BREAK_SECONDS };
  }
  return { phase: "focus", duration: FOCUS_SECONDS };
}

export function PomodoroProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const win = window as WindowWithWebkitAudioContext;
    const AudioContextCtor = win.AudioContext ?? win.webkitAudioContext;

    if (!AudioContextCtor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    return audioContextRef.current;
  }, []);

  const ensureAudioContextResume = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }

    if (ctx.state === "suspended") {
      void ctx.resume().catch(() => {
        // Some browsers require explicit user interaction before audio playback.
      });
    }
  }, [getAudioContext]);

  const playAlarm = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }

    if (ctx.state === "suspended") {
      void ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.22, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 1);
  }, [getAudioContext]);

  useEffect(() => {
    if (state.isRunning && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    }

    if (!state.isRunning && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning]);

  useEffect(() => {
    if (!state.isRunning && state.remainingSeconds === 0) {
      playAlarm();

      const next = getNextPhase(state.phase);
      dispatch({
        type: "CHANGE_PHASE",
        phase: next.phase,
        remainingSeconds: next.duration,
      });
    }
  }, [playAlarm, state.isRunning, state.phase, state.remainingSeconds]);

  const value = useMemo<PomodoroContextValue>(
    () => ({
      state,
      start: () => {
        ensureAudioContextResume();
        dispatch({ type: "START" });
      },
      pause: () => dispatch({ type: "PAUSE" }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [ensureAudioContextResume, state]
  );

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}

export function usePomodoro(): PomodoroContextValue {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return context;
}
