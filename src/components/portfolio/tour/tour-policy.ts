export type TourStatus = "idle" | "loading" | "playing" | "paused" | "blocked" | "choice" | "complete" | "error";

export function isPlaybackLocked(started: boolean, status: TourStatus) {
  return started && ["playing", "loading", "paused", "blocked", "choice"].includes(status);
}
