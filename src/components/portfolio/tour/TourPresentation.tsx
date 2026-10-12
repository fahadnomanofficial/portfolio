import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { SkipForward } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTour } from "./TourProvider";
import { CHAPTERS } from "./manifest";
import { EmphasizedText } from "./TourText";

export function TourPresentation() {
  const { status, playbackLocked, end, continueTour, chapter, position, reducedMotion, motionPaused } = useTour();
  const awaitingChoice = status === "choice";
  const skip = useRef<HTMLButtonElement>(null);
  const current = CHAPTERS[chapter];
  const cue = current?.captions.find(item => position >= item.start && position < item.end);
  useEffect(() => {
    if (!playbackLocked || awaitingChoice) return;
    skip.current?.focus({ preventScroll: true });
  }, [playbackLocked, awaitingChoice]);
  if (awaitingChoice) return <Dialog.Root open onOpenChange={open => { if (!open) end(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="tour-choice-overlay" />
      <Dialog.Content className="portfolio-studio tour-choice-dialog" data-tour-choice onCloseAutoFocus={event => event.preventDefault()} onPointerDownOutside={event => event.preventDefault()}>
        <span className="tour-choice-eyebrow">YOUR PERSONAL TOUR</span>
        <Dialog.Title className="tour-choice-title">Shall we take a quick tour?</Dialog.Title>
        <Dialog.Description className="tour-choice-description">Explore the services, featured projects, and ways to automate your business—or browse at your own pace.</Dialog.Description>
        <div className="tour-choice-actions">
          <button className="tour-choice-continue" onClick={continueTour}>Continue tour</button>
          <button className="tour-choice-skip" onClick={end}>Skip tour</button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
  if (!playbackLocked) return null;
  return createPortal(<div className="portfolio-studio tour-playback-lock" data-tour-motion-paused={reducedMotion || motionPaused}>
    <div className="tour-playback-shield" aria-hidden="true" />
    <button ref={skip} className="tour-skip" data-tour-skip onClick={end} aria-label="Skip voice tour">Skip <SkipForward size={15} aria-hidden="true" /></button>
    {cue && <p key={`${chapter}-${cue.start}`} className="tour-mobile-caption tour-caption-enter" aria-live="off"><EmphasizedText text={cue.text} phrases={cue.emphasis} /></p>}
  </div>, document.body);
}
