import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import {
  Bot, MessageSquare, ShoppingBag, UserPlus, Send, CalendarDays, FileText,
  Receipt, Truck, LifeBuoy, Mail, Share2, Star, Package, ListTodo, Files,
  RotateCcw, BarChart3, RefreshCw, BrainCircuit,
} from "lucide-react";
import { HOME } from "@/lib/home-content.mjs";
import { useTour } from "./tour/TourProvider";
import { CHAPTERS } from "./tour/manifest";

const icons = [Bot, MessageSquare, ShoppingBag, UserPlus, Send, CalendarDays,
  FileText, Receipt, Truck, LifeBuoy, Mail, Share2, Star, Package, ListTodo,
  Files, RotateCcw, BarChart3, RefreshCw, BrainCircuit];
const palettes = ["automation", "business", "coding", "design", "marketing"];
const rows = [0, 7, 14].map(start => HOME.automationExamples.slice(start, start + 7).map((label, offset) => ({ label, index: start + offset })));

function AutomationRow({ items, row, active, highlighted, reducedMotion }: { items: { label: string; index: number }[]; row: number; active: boolean; highlighted: number[]; reducedMotion: boolean }) {
  const rail = useRef<HTMLDivElement>(null);
  const manualUntil = useRef(0);
  const [interacting, setInteracting] = useState(false);
  const direction = row === 1 ? 1 : -1;
  const selected = highlighted.filter(index => items.some(item => item.index === index));
  const selectedKey = selected.join(',');
  useEffect(() => {
    const element = rail.current;
    if (!element || !selectedKey) return;
    const reveal = () => {
      const cards = selectedKey.split(',').map(id => element.querySelector<HTMLElement>(`.studio-automation-group:not([aria-hidden]) [data-automation-id="${id}"]`)).filter(Boolean);
      if (!cards.length) return;
      const start = cards[0]!.getBoundingClientRect().left;
      const finish = cards.at(-1)!.getBoundingClientRect().right;
      const left = element.scrollLeft + (start + finish) / 2 - element.getBoundingClientRect().left - element.clientWidth / 2;
      element.scrollTo({ left, behavior: reducedMotion ? 'instant' : 'smooth' });
    };
    reveal();
    const resize = new ResizeObserver(reveal);
    resize.observe(element);
    return () => resize.disconnect();
  }, [selectedKey, reducedMotion]);
  useEffect(() => {
    if (!active || interacting || !rail.current) return;
    const element = rail.current;
    const group = element.querySelector<HTMLElement>(".studio-automation-group");
    if (!group) return;
    let cycle = group.offsetWidth;
    if (direction < 0 && element.scrollLeft === 0) element.scrollLeft = cycle;
    let offset = element.scrollLeft;
    let previous = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const delta = Math.min(.05, (now - previous) / 1000);
      previous = now;
      if (now >= manualUntil.current) {
        const next = offset + direction * 22 * delta;
        // Identical copies make the wrap seamless while keeping native swipe scrolling.
        offset = ((next % cycle) + cycle) % cycle;
        element.scrollLeft = offset;
      } else offset = element.scrollLeft;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const resize = new ResizeObserver(() => { cycle = group.offsetWidth; offset = ((element.scrollLeft % cycle) + cycle) % cycle; });
    resize.observe(group);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); };
  }, [active, interacting, direction]);
  return <div ref={rail} className="studio-automation-row" role="region" aria-label={`Automation examples row ${row + 1}, scroll horizontally`}
    tabIndex={0} data-direction={direction < 0 ? "left-to-right" : "right-to-left"}
    onPointerEnter={event => { if (event.pointerType === "mouse") setInteracting(true); }} onPointerLeave={() => setInteracting(false)}
    onFocus={() => setInteracting(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}
    onPointerDown={() => { manualUntil.current = performance.now() + 5000; }} onWheel={() => { manualUntil.current = performance.now() + 5000; }}>
    <div className="studio-automation-track">{[false, true].map(duplicate => <ul key={String(duplicate)} className="studio-automation-group" aria-hidden={duplicate || undefined}>
      {items.map(({ label, index }) => {
        const Icon = icons[index];
        return <li key={label} className="hero-app-tile studio-automation-item" data-automation-id={index} data-voice-active={selected.includes(index) || undefined} data-app={palettes[index % palettes.length]}>
          <span className="hero-app-icon" aria-hidden="true"><Icon size={29} strokeWidth={1.65} /></span>
          <span className="studio-automation-label">{label}</span>
        </li>;
      })}
    </ul>)}</div>
  </div>;
}

export function StudioAutomationExamples() {
  const { motionPaused, reducedMotion, visible, chapter, position, status } = useTour();
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { amount: .05 });
  const current = CHAPTERS[chapter];
  const followingVoice = current?.id === 'automation-examples' && ['playing','loading','paused'].includes(status);
  const highlighted = followingVoice ? current.captions.find(cue => position >= cue.start && position < cue.end)?.automationIds ?? [] : [];
  const active = inView && visible && !motionPaused && !reducedMotion && !followingVoice;

  return <section ref={section} id="automation-examples" className="studio-section studio-section-compact studio-automation" aria-labelledby="automation-title">
    <div className="studio-section-heading">
      <span className="studio-kicker"><span /> EVERYDAY TASKS, MADE EASIER</span>
      <h2 id="automation-title">{HOME.automationHeading}</h2>
      <p>{HOME.automationSummary}</p>
    </div>
    <div className="studio-automation-rows">{rows.map((items, row) => <AutomationRow key={row} items={items} row={row} active={active} highlighted={highlighted} reducedMotion={reducedMotion || motionPaused} />)}</div>
  </section>;
}
