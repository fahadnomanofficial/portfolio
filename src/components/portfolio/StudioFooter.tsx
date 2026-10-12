import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight, Check, Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle } from "lucide-react";
import { subscribeNewsletter } from "@/api/client";
import { CONTACT } from "./data";
import "./footer.css";

const pages = [
  ["About", "/about"], ["Services", "/services"], ["Portfolio", "/portfolio"],
  ["Blog", "/blog"], ["Pricing", "/pricing"], ["FAQ", "/faq"],
];
const socials = [
  { name: "LinkedIn", href: CONTACT.linkedin, Icon: Linkedin },
  { name: "Instagram", href: CONTACT.instagram, Icon: Instagram },
  { name: "Facebook", href: CONTACT.facebook, Icon: Facebook },
  { name: "WhatsApp", href: CONTACT.whatsapp, Icon: MessageCircle },
];

export function StudioFooter() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [failed, setFailed] = useState(false);
  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || subscribed) return;
    setBusy(true); setFeedback(""); setFailed(false);
    try {
      const result = await subscribeNewsletter(email.trim());
      if (!result.success) throw new Error(result.message || "Couldn’t subscribe. Please try again.");
      setSubscribed(true); setEmail("");
      setFeedback(result.message || "You’re on the list. Thanks for joining!");
    } catch (error) {
      setFailed(true);
      setFeedback(error instanceof Error ? error.message : "Couldn’t subscribe. Please try again.");
    } finally { setBusy(false); }
  };
  const backToTop = () => window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });

  return <footer className="studio-footer">
    <div className="studio-footer-inner">
      <div className="footer-invitation">
        <div><span className="footer-eyebrow">YOUR NEXT CHAPTER</span><h2>Let’s build what’s next.</h2><p>A website, an app, or a smarter way to run your business.</p></div>
        <Link to="/#contact" className="footer-project-link">Let’s talk <ArrowUpRight size={21} aria-hidden="true" /></Link>
      </div>
      <div className="footer-main">
        <div className="footer-identity">
          <Link to="/#top" className="footer-brand">Fahad’s Portfolio<span aria-hidden="true">.</span></Link>
          <p>Thoughtful design. Practical development.<br />Less busywork for your business.</p>
          <a href={`mailto:${CONTACT.email}`} className="footer-email"><Mail size={16} aria-hidden="true" /><span>{CONTACT.email}</span></a>
          <div className="footer-location"><MapPin size={14} aria-hidden="true" /><span>{CONTACT.location} · Working worldwide</span></div>
          <div className="footer-socials" role="group" aria-label="Social profiles and WhatsApp">{socials.map(({ name, href, Icon }) => <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={`${name} (opens in a new tab)`} title={name}><Icon size={18} aria-hidden="true" /></a>)}</div>
        </div>
        <nav className="footer-explore" aria-label="Footer navigation"><h3>Explore</h3><div>{pages.map(([label, href]) => <Link key={href} to={href}>{label}<ArrowUpRight size={13} aria-hidden="true" /></Link>)}</div></nav>
        <div className="footer-newsletter">
          <h3>Notes from the build.</h3><p>Occasional ideas on websites, automation, and design. Straight to your inbox.</p>
          <form onSubmit={subscribe} aria-busy={busy}>
            <label className="sr-only" htmlFor="studio-newsletter-email">Newsletter email</label>
            <div className="footer-subscribe-field"><input id="studio-newsletter-email" name="email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="Your email address" disabled={busy || subscribed} aria-describedby="footer-subscribe-note footer-subscribe-status" /><button type="submit" disabled={busy || subscribed}>{subscribed ? <><Check size={16} aria-hidden="true" /> Joined</> : busy ? "Joining…" : <>Join <ArrowUpRight size={16} aria-hidden="true" /></>}</button></div>
            <p id="footer-subscribe-note" className="footer-subscribe-note">By subscribing, you agree to the <Link to="/privacy">privacy policy</Link>.</p>
            <p id="footer-subscribe-status" className="footer-subscribe-status" role="status" data-error={failed || undefined}>{feedback}</p>
          </form>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Fahad Al Noman</span><div className="footer-legal"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div><button type="button" onClick={backToTop}>Back to top <ArrowUp size={15} aria-hidden="true" /></button></div>
    </div>
  </footer>;
}
