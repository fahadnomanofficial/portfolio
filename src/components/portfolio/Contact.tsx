import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Download, Send, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "./SectionHeader";
import { CONTACT, CV_PATH } from "./data";
import { fadeUp, staggerParent, viewportOnce } from "./motion";
import { submitContact } from "@/api/client";
import { ContactChannels } from "./ContactChannels";
import { ContactChat } from "./ContactChat";
import type { ContactForm } from "@/api/client";

export function Contact({ studio = false }: { studio?: boolean }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: true,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendEnquiry(form);
  };
  const sendEnquiry = async (data: ContactForm): Promise<boolean> => {
    if (submitting) return false;
    setSubmitting(true);
    try {
      const result = await submitContact(data);
      if (!result.success) throw new Error(result.message || "Please try again.");
      const consent = localStorage.getItem("cookie_consent_set");
      const analyticsAllowed = consent === "accepted_all" || (consent === "custom" && localStorage.getItem("cookie_analytics_allowed") === "true");
      if (analyticsAllowed) {
        const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
        gtag?.("event", "generate_lead", { method: "contact_form" });
      }
      toast.success("Message sent — I'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", whatsapp: true, message: "" });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {!studio && <SectionHeader
          eyebrow="contact"
          title={studio ? "Your next idea starts here." : "Let's build something."}
          intro={studio ? "A new website. A better app. A task that takes too much time. Tell me what you have in mind — we’ll figure out the next step together." : "Tell me what your business needs: a website, an app, or more qualified enquiries. Based in Malta, working worldwide."}
        />}

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="contact-layout grid items-start gap-6 lg:grid-cols-[1fr_1.2fr]"
        >
          <motion.div variants={fadeUp} className="space-y-4">
            {studio && <SectionHeader eyebrow="contact" title="Your next idea starts here." intro="Have an idea or a task to automate? Tell me a little about it, and we’ll find the next step together." />}
            {studio ? <ContactChannels /> : [
              { Icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
              { Icon: Phone, label: "Phone", value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
              { Icon: MessageCircle, label: "WhatsApp", value: CONTACT.phone, href: CONTACT.whatsapp },
              { Icon: MapPin, label: "Location", value: CONTACT.location },
              { Icon: Linkedin, label: "LinkedIn", value: "fahad-al-noman", href: CONTACT.linkedin },
            ].map(({ Icon, label, value, href }) => {
              const isLocation = label === "Location";
              const content = (
                <>
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
                    <div className="truncate font-display text-foreground">
                      {value}
                    </div>
                  </div>
                </>
              );
              const Wrapper = isLocation ? "address" : "div";
              return href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/40 hover:shadow-glow-sm"
                >
                  {content}
                </a>
              ) : (
                <Wrapper key={label} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 not-italic">
                  {content}
                </Wrapper>
              );
            })}

            {!studio && <a
              href={CV_PATH}
              download
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition-transform active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              Download CV
            </a>}
          </motion.div>

          {studio ? <motion.div variants={fadeUp}><ContactChat onSend={sendEnquiry} submitting={submitting} /></motion.div> : <motion.form
            variants={fadeUp}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Name</span>
                <input
                  required
                  maxLength={100}
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Email</span>
                <input
                  required
                  maxLength={255}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Phone</span>
                <input
                  required
                  type="tel"
                  maxLength={40}
                  placeholder="+356 ..."
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors hover:border-accent/50">
                <input
                  type="checkbox"
                  checked={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.checked })}
                  className="h-4 w-4 accent-accent"
                />
                <MessageCircle className="h-4 w-4 text-accent" />
                <span>Available on WhatsApp</span>
              </label>
            </div>

            <label className="mt-4 block">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Message</span>
              <textarea
                required
                maxLength={2000}
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </motion.form>}
        </motion.div>
      </div>
    </section>
  );
}
