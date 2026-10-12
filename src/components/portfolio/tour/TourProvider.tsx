import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { CHAPTERS } from "./manifest";
import { isPlaybackLocked, type TourStatus } from "./tour-policy";
import "./tour.css";

type TourContextValue = {
  status: TourStatus; chapter: number; position: number;
  motionPaused: boolean; reducedMotion: boolean; visible: boolean;
  playbackLocked: boolean; end: () => void; continueTour: () => void;
};
const TourContext = createContext<TourContextValue | null>(null);
export function useTour() {
  const context = useContext(TourContext);
  if (!context) throw new Error("The voice tour requires TourProvider.");
  return context;
}

export function TourProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<TourStatus>("idle");
  const statusRef = useRef<TourStatus>("idle");
  const [chapter, setChapter] = useState(0);
  const chapterRef = useRef(0);
  const requestRef = useRef(0);
  const attempted = useRef(false);
  const pending = useRef(false);
  const resumeOnVisible = useRef(false);
  const startedRef = useRef(false);
  const lifecycle = useRef(0);
  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState(0);
  const [visible, setVisible] = useState(!document.hidden);
  const reducedMotion = !!useReducedMotion();
  const motionPaused = false;
  const playbackLocked = isPlaybackLocked(started, status);
  const transition = useCallback((next: TourStatus) => { statusRef.current = next; setStatus(next); }, []);
  const navigate = useCallback((index: number) => {
    const target = document.getElementById(CHAPTERS[index].id);
    if (target) window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - 96), behavior: reducedMotion ? "instant" : "smooth" });
  }, [reducedMotion]);
  const play = useCallback(() => {
    const media = audio.current;
    if (!media) return;
    const request = ++requestRef.current;
    pending.current = true;
    transition("loading");
    // Keep this synchronous so a first page tap can satisfy browser autoplay rules.
    void media.play().catch((error: DOMException) => {
      if (request !== requestRef.current || statusRef.current !== "loading") return;
      if (error.name === "NotAllowedError") transition("blocked");
      else if (error.name !== "AbortError") { pending.current = false; transition("error"); }
    });
  }, [transition]);
  const choose = useCallback((index: number) => {
    const media = audio.current;
    if (!media || !CHAPTERS[index]) return;
    requestRef.current++;
    media.pause();
    chapterRef.current = index;
    setChapter(index);
    setPosition(0);
    media.src = CHAPTERS[index].src;
    media.load();
    play();
  }, [play]);
  const continueTour = useCallback(() => {
    if (statusRef.current === "choice") choose(1);
  }, [choose]);
  const end = useCallback(() => {
    pending.current = false;
    resumeOnVisible.current = false;
    requestRef.current++;
    transition("idle");
    audio.current?.pause();
    window.scrollTo({ top: window.scrollY, behavior: "instant" });
    if (audio.current) audio.current.currentTime = 0;
    setPosition(0);
  }, [transition]);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;
    // Each homepage mount starts a fresh tour, including after Skip and reload.
    if (document.hidden) { resumeOnVisible.current = true; return; }
    choose(0);
  }, [choose]);

  useEffect(() => {
    if (!playbackLocked) return;
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");
    const previous = { html: html.style.overflow, body: body.style.overflow, overscroll: html.style.overscrollBehavior, inert: root?.inert, marker: body.getAttribute("data-voice-tour-locked") };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.setAttribute("data-voice-tour-locked", "true");
    // The Skip button lives in a body portal, outside the inert application root.
    if (root) root.inert = true;
    const preventScroll = (event: Event) => event.preventDefault();
    window.addEventListener("touchmove", preventScroll, { passive: false, capture: true });
    window.addEventListener("wheel", preventScroll, { passive: false, capture: true });
    return () => {
      html.style.overflow = previous.html;
      body.style.overflow = previous.body;
      html.style.overscrollBehavior = previous.overscroll;
      if (root) root.inert = previous.inert ?? false;
      if (previous.marker === null) body.removeAttribute("data-voice-tour-locked");
      else body.setAttribute("data-voice-tour-locked", previous.marker);
      window.removeEventListener("touchmove", preventScroll, true);
      window.removeEventListener("wheel", preventScroll, true);
    };
  }, [playbackLocked]);

  useEffect(() => {
    const onVisibility = () => {
      setVisible(!document.hidden);
      if (document.hidden && ["playing", "loading"].includes(statusRef.current)) {
        resumeOnVisible.current = true;
        pending.current = false;
        requestRef.current++;
        transition("paused");
        audio.current?.pause();
      } else if (!document.hidden && resumeOnVisible.current) {
        resumeOnVisible.current = false;
        if (audio.current?.getAttribute("src")) play(); else choose(0);
      }
    };
    const retryBlocked = (event: Event) => {
      if (event.isTrusted && pending.current && statusRef.current === "blocked" && !document.hidden) { play(); return true; }
      return false;
    };
    let lastScrollAttempt = -Infinity;
    const onScrollIntent = (event: WheelEvent | TouchEvent) => {
      if (event instanceof WheelEvent && (!event.deltaX && !event.deltaY || event.ctrlKey)) return;
      const now = performance.now();
      if (now - lastScrollAttempt < 600) return;
      // Retry in the input event itself; a browser may still require a tap for sound.
      if (retryBlocked(event)) lastScrollAttempt = now;
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest("[data-tour-skip], [data-tour-choice]")) return;
      if (isPlaybackLocked(startedRef.current, statusRef.current)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        retryBlocked(event);
      } else if (!target.closest("a, button, input, textarea, select, form, summary")) retryBlocked(event);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      // The modal manages Tab, Enter and Space while waiting for a decision.
      if (statusRef.current === "choice") {
        if (event.key === "Escape") { event.preventDefault(); end(); }
        return;
      }
      if (isPlaybackLocked(startedRef.current, statusRef.current)) {
        if (event.key === "Escape") { event.preventDefault(); end(); return; }
        if (event.key === "Tab") {
          event.preventDefault();
          document.querySelector<HTMLButtonElement>("[data-tour-skip]")?.focus({ preventScroll: true });
        } else if (!(event.target instanceof Element && event.target.closest("[data-tour-skip]")) || ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
        }
        return;
      }
      if (!event.repeat && !["Escape", "Shift", "Control", "Alt", "Meta"].includes(event.key)
        && !(event.target instanceof Element && event.target.closest("a, button, input, textarea, select, form, summary"))) {
        if (retryBlocked(event) && [" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) event.preventDefault();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("wheel", onScrollIntent, { passive: true });
    window.addEventListener("touchmove", onScrollIntent, { passive: true });
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("wheel", onScrollIntent);
      window.removeEventListener("touchmove", onScrollIntent);
    };
  }, [choose, end, play, transition]);
  useEffect(() => {
    const generation = ++lifecycle.current;
    const media = audio.current;
    return () => queueMicrotask(() => {
      // Strict Mode immediately reconnects effects; only stop a real unmount.
      if (lifecycle.current !== generation) return;
      requestRef.current++;
      media?.pause();
    });
  }, []);

  const current = CHAPTERS[chapter];
  const caption = current?.captions.find(cue => position >= cue.start && position < cue.end);
  const active = status === "playing" || status === "loading";
  return <TourContext.Provider value={{ status, chapter, position, motionPaused, reducedMotion, visible, playbackLocked, end, continueTour }}>
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
      <div inert={playbackLocked} data-tour-motion-paused={reducedMotion} data-tour-section={active ? current?.id : undefined} data-tour-highlight={active ? caption?.highlight : undefined}>{children}</div>
    </MotionConfig>
    <audio ref={audio} preload="auto"
      onTimeUpdate={() => setPosition(audio.current?.currentTime ?? 0)}
      onPlaying={() => {
        if (statusRef.current !== "loading") { if (statusRef.current !== "playing") audio.current?.pause(); return; }
        if (!startedRef.current) {
          startedRef.current = true;
          setStarted(true);
        }
        pending.current = false;
        transition("playing");
        navigate(chapterRef.current);
      }}
      onWaiting={() => { if (statusRef.current === "playing") transition("loading"); }}
      onError={() => { if (["idle", "complete"].includes(statusRef.current)) return; pending.current = false; transition("error"); }}
      onEnded={() => {
        if (!["playing", "loading"].includes(statusRef.current)) return;
        if (chapterRef.current === 0) {
          pending.current = false;
          resumeOnVisible.current = false;
          transition("choice");
        }
        else if (chapterRef.current === CHAPTERS.length - 1) { pending.current = false; transition("complete"); }
        else choose(chapterRef.current + 1);
      }} />
  </TourContext.Provider>;
}
