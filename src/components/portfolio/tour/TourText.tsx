import { useTour } from "./TourProvider";
import { CHAPTERS } from "./manifest";

export function EmphasizedText({ text, phrases = [] }: { text: string; phrases?: string[] }) {
  if (!phrases.length) return <>{text}</>;
  const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(${[...phrases].sort((a,b) => b.length-a.length).map(escape).join("|")})`, "gi");
  return <>{text.split(pattern).map((part,index) => phrases.some(phrase => phrase.toLowerCase() === part.toLowerCase())
    ? <mark key={index} className="tour-spoken-emphasis">{part}</mark> : part)}</>;
}

export function TourText({ text, section }: { text: string; section: string }) {
  const { chapter, position, status } = useTour();
  const current = CHAPTERS[chapter];
  const cue = current?.captions.find(item => position >= item.start && position < item.end);
  const speaking = status === "playing" || status === "loading";
  return <EmphasizedText text={text} phrases={speaking && current?.id === section ? cue?.emphasis : []} />;
}

export function SpeakingIndicator({ playing }: { playing: boolean }) {
  return <span className="tour-speaking-indicator" data-playing={playing} aria-hidden="true"><i /><i /><i /><i /></span>;
}
