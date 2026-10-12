import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { ArrowDown, ArrowUpRight, Bot, Code2, LayoutDashboard, Megaphone, PenTool, Sparkles } from "lucide-react";
import { useTour } from "./tour/TourProvider";
import { CHAPTERS } from "./tour/manifest";
import { HOME } from "@/lib/home-content.mjs";
import { EmphasizedText } from "./tour/TourText";

const intro = CHAPTERS[0];
const introduction = intro.captions;
const serviceApps = [
  { id: "automation", label: "AI Automation", Icon: Bot },
  { id: "business", label: "Business CRM/ERP", Icon: LayoutDashboard },
  { id: "coding", label: "Coding", Icon: Code2 },
  { id: "design", label: "Design", Icon: PenTool },
  { id: "marketing", label: "Marketing", Icon: Megaphone },
];

function ScrollingServiceApps() {
  return <div className="hero-app-rail" role="region" aria-label="Services — scroll horizontally to explore" tabIndex={0}>
    <div className="hero-app-track">{[false, true].map(duplicate => <ul key={String(duplicate)} className="hero-app-group" aria-hidden={duplicate || undefined}>
      {serviceApps.map(({ id, label, Icon }) => <li key={id} className="hero-app-tile" data-app={id}><span className="hero-app-icon" aria-hidden="true"><Icon size={30} strokeWidth={1.65} />{id === "automation" && <Sparkles className="hero-app-sparkle" size={12} />}</span><span className="hero-app-name">{label}</span></li>)}
    </ul>)}</div>
  </div>;
}

function TypingIntroduction({ running }: { running: boolean }) {
  const { chapter, status, position, motionPaused, reducedMotion } = useTour();
  const [clock, setClock] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const anchor = useRef({ time: position, at: 0 });
  const followingAudio = chapter === 0 && ["playing", "paused", "loading", "choice"].includes(status);
  const playingIntro = chapter === 0 && status === "playing";
  useEffect(() => {
    if (playingIntro) setHasPlayed(true);
    else if (status === "idle") setHasPlayed(false);
  }, [playingIntro, status]);
  useEffect(() => {
    anchor.current = { time: position, at: performance.now() };
    setClock(position);
  }, [position, status, chapter]);
  useEffect(() => {
    if (!running || !playingIntro) return;
    let frame = 0;
    const tick = (now: number) => {
      // Smooth the native audio clock between timeupdate events; cap it if playback stalls.
      setClock(Math.min(intro.duration, anchor.current.time + Math.min(.3, (now - anchor.current.at) / 1000)));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, playingIntro]);
  const time = followingAudio ? clock : introduction[0].end;
  const cue = followingAudio ? introduction.find(item => time < item.end) ?? introduction.at(-1)! : introduction[0];
  const progress = Math.max(0, Math.min(1, (time - cue.start) / (cue.end - cue.start - .15)));
  const showFull = reducedMotion || motionPaused || chapter !== 0;
  const text = showFull ? cue.text : cue.text.slice(0, Math.floor(cue.text.length * progress));
  // Reveal the introduction only when audio actually plays, including after autoplay is allowed.
  if ((!hasPlayed && !playingIntro) || ["idle", "blocked", "error"].includes(status)) return null;
  return <div className="hero-introduction">
    <span className="hero-intro-label"><span /> A PERSONAL INTRODUCTION</span>
    <div className="hero-intro-stage"><p className="hero-intro-type" aria-hidden="true"><EmphasizedText text={text} phrases={cue.emphasis} /><span className={`hero-caret ${!running || (!playingIntro && followingAudio) || showFull ? "is-still" : ""}`}>|</span></p></div>
    <p className="sr-only">{intro.captions.map(cue => cue.text).join(" ")}</p>
  </div>;
}

export function Hero() {
  const { motionPaused, reducedMotion, visible } = useTour();
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { amount: 0.05 });
  const ambient = inView && visible && !motionPaused && !reducedMotion;
  return <section ref={section} id="top" className="portfolio-hero" data-ambient={ambient ? "running" : "paused"}>
    <div className="studio-hero-art" aria-hidden="true"><div className="studio-orbit-grid" /><svg className="studio-orbit" viewBox="0 0 800 800"><g className="studio-orbit-spin"><circle cx="400" cy="400" r="295" /><ellipse cx="400" cy="400" rx="295" ry="100" transform="rotate(-34 400 400)" /><ellipse cx="400" cy="400" rx="295" ry="190" transform="rotate(-34 400 400)" /><ellipse cx="400" cy="400" rx="100" ry="295" transform="rotate(-34 400 400)" /><ellipse cx="400" cy="400" rx="190" ry="295" transform="rotate(-34 400 400)" /><path d="M155 565 L645 235 M235 155 L565 645" /><circle className="studio-orbit-dot" cx="150" cy="555" r="7" /><circle className="studio-orbit-dot studio-orbit-dot-two" cx="644" cy="234" r="5" /></g><circle className="studio-orbit-outer" cx="400" cy="400" r="350" /></svg><span className="studio-art-coordinate coordinate-one">DESIGN × TECHNOLOGY</span><span className="studio-art-coordinate coordinate-two">IDEAS → WORKING SYSTEMS</span><span className="studio-cross cross-one">+</span><span className="studio-cross cross-two">+</span></div>
    <div className="hero-content">
      <div className="hero-portrait">
        <div className="hero-portrait-art">
          <img src="/fahad-lines-dots.svg" alt="Fahad Al Noman, illustrated in dots and lines" width={760} height={1013} fetchPriority="high" decoding="async" />
          <span className="hero-portrait-glimmer" aria-hidden="true" />
        </div>
      </div>
      <div className="hero-copy">
      <TypingIntroduction running={ambient} />
      <ScrollingServiceApps />
      <div className="hero-description hero-services-summary"><h1>{HOME.heading}</h1><p>{HOME.summary}</p></div>
      <div className="hero-actions">
        <a href="#work" className="hero-button hero-button-primary">Explore my work <ArrowUpRight size={18} aria-hidden="true" /></a>
        <a href="#contact" className="hero-button hero-button-secondary">Have an idea? Let’s talk <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
      </div>
    </div>
    <div className="hero-bottom">
      <span className="hero-footnote">BUILT FOR YOUR BUSINESS <span className="studio-dim">/ WORKING WORLDWIDE</span></span>
      <a href="#services" className="hero-explore">SCROLL TO EXPLORE <ArrowDown size={14} aria-hidden="true" /></a>
    </div>
  </section>;
}
