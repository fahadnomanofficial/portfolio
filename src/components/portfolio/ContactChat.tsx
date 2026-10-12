import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Pencil, Send } from "lucide-react";
import type { ContactForm } from "@/api/client";
import "./contact-chat.css";

const labels = ["Name", "Email", "Phone number", "WhatsApp", "Project brief"];
const empty = { name: "", email: "", phone: "", whatsapp: null as boolean | null, message: "" };
const fields = ["name", "email", "phone", "whatsapp", "message"] as const;

export function ContactChat({ onSend, submitting }: { onSend: (data: ContactForm) => Promise<boolean>; submitting: boolean }) {
  const [answers, setAnswers] = useState(empty);
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const editingReview = useRef(false);
  const focusNext = useRef(false);
  const composer = useRef<HTMLFormElement>(null);
  const firstName = answers.name.trim().split(/\s+/)[0];
  const questions = ["Hi! What’s your name?", `Nice to meet you, ${firstName}! What’s your email?`, "What’s the best number to reach you on?", "Is WhatsApp available on this number?", "Tell me a little about your project."];
  const answerText = (index: number) => index === 3 ? (answers.whatsapp ? "Yes, available on WhatsApp" : "No WhatsApp on this number") : String(answers[fields[index]]);
  useEffect(() => {
    if (!focusNext.current) return;
    composer.current?.querySelector<HTMLElement>("input, textarea, button[type='submit']")?.focus({ preventScroll: true });
    focusNext.current = false;
  }, [step]);
  const go = (next: number) => { setError(""); focusNext.current = true; setStep(next); };
  const advance = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (step === 5) {
      setError("");
      const success = await onSend({ name: answers.name.trim(), email: answers.email.trim(), phone: answers.phone.trim(), whatsapp: answers.whatsapp === true, message: answers.message.trim() });
      if (success) setSent(true);
      else setError("Your message couldn’t be sent. Please try again. Your answers are saved here.");
      return;
    }
    const value = answers[fields[step]];
    if (step === 3 ? value === null : !String(value).trim()) { setError(step === 3 ? "Please choose Yes or No." : "Please add your answer."); return; }
    if (step === 2 && !/^\+?[\d\s().-]+$/.test(answers.phone.trim())) { setError("Use a phone number, including your country code."); return; }
    if (step === 2 && (answers.phone.replace(/\D/g, "").length < 7 || answers.phone.replace(/\D/g, "").length > 15)) { setError("Please enter a phone number with 7 to 15 digits."); return; }
    const next = editingReview.current ? 5 : step + 1;
    editingReview.current = false;
    go(next);
  };
  const edit = (index: number) => { editingReview.current = true; go(index); };

  return <div className="contact-chat" aria-label="Project enquiry chat">
    <div className="contact-chat-header"><img src="/avatar_v2.jpg" width={38} height={38} alt="" /><div><strong>Let’s talk</strong><span>A project enquiry, one question at a time.</span></div><span className="contact-chat-progress">{sent ? <Check size={17} aria-label="Sent" /> : `${Math.min(step + 1, 5)} / 5`}</span></div>
    {sent ? <div className="contact-chat-success" role="status"><span className="contact-chat-question">Thanks, {firstName}! Your message is sent. I’ll get back to you soon.</span><button type="button" onClick={() => { setAnswers(empty); setSent(false); go(0); }}>Start a new enquiry <ArrowRight size={16} aria-hidden="true" /></button></div> : <>
      <div className="contact-chat-conversation">
        {step > 0 && step < 5 && <div className="contact-chat-previous"><span>{labels[step - 1]}</span><button type="button" aria-label={`Edit ${labels[step - 1]}`} onClick={() => go(step - 1)}>{answerText(step - 1)}<Pencil size={12} aria-hidden="true" /></button></div>}
        <p className="contact-chat-question" aria-live="polite" aria-atomic="true">{step === 5 ? `Thanks, ${firstName}. Ready to send these details?` : questions[step]}</p>
        {step === 5 && <div className="contact-chat-review" aria-label="Review your enquiry">{labels.map((label, index) => <button type="button" key={label} aria-label={`Edit ${label}`} onClick={() => edit(index)} disabled={submitting}><span>{label}</span><strong>{answerText(index)}</strong><Pencil size={13} aria-hidden="true" /></button>)}</div>}
      </div>
      <form ref={composer} className="contact-chat-composer" onSubmit={advance}>
        {step < 5 && <>
          {step === 3 ? <fieldset className="contact-chat-whatsapp"><legend className="sr-only">Available on WhatsApp?</legend>{[true, false].map(value => <label key={String(value)} data-checked={answers.whatsapp === value}><input type="radio" name="chat-whatsapp" required checked={answers.whatsapp === value} onChange={() => setAnswers({ ...answers, whatsapp: value })} />{value ? "Yes, WhatsApp works" : "No, call or email"}</label>)}</fieldset> : <>
            <label htmlFor="contact-chat-answer" className="sr-only">{labels[step]}</label>
            {step === 4 ? <textarea key={step} id="contact-chat-answer" name="message" required maxLength={2000} rows={3} value={answers.message} onChange={event => { setError(""); setAnswers({ ...answers, message: event.target.value }); }} placeholder="What would you like to build or improve?" aria-invalid={!!error} aria-describedby={error ? "contact-chat-error" : undefined} /> : <input key={step} id="contact-chat-answer" name={fields[step]} required maxLength={step === 0 ? 100 : step === 1 ? 255 : 40} type={step === 1 ? "email" : step === 2 ? "tel" : "text"} autoComplete={step === 0 ? "name" : step === 1 ? "email" : "tel"} value={String(answers[fields[step]])} onChange={event => { setError(""); setAnswers({ ...answers, [fields[step]]: event.target.value }); }} placeholder={step === 0 ? "Type your name…" : step === 1 ? "you@example.com" : "+356 …"} aria-invalid={!!error} aria-describedby={error ? "contact-chat-error" : undefined} />}
          </>}
        </>}
        {error && <p id="contact-chat-error" className="contact-chat-error" role="alert">{error}</p>}
        <div className="contact-chat-actions">{step > 0 && <button type="button" className="contact-chat-back" onClick={() => { editingReview.current = false; go(step - 1); }} disabled={submitting}><ArrowLeft size={15} aria-hidden="true" />Back</button>}<button type="submit" className="contact-chat-next" disabled={submitting}>{submitting ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />Sending…</> : step === 5 ? <>Send message<Send size={15} aria-hidden="true" /></> : <>{step === 4 ? "Review message" : "Continue"}<ArrowRight size={16} aria-hidden="true" /></>}</button></div>
        <p className="contact-chat-note">{step === 5 ? "Your details are sent only when you choose Send message." : "A few quick details. Review everything before sending."}</p>
      </form>
    </>}
  </div>;
}
