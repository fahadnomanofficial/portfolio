import { useState, useEffect } from "react";
import { X, MessageSquare, ArrowRight, ShieldCheck, Zap, Clock, Copy, Check } from "lucide-react";
import { PricingPackage } from "./pricingData";
import { AVATAR_URL, CONTACT } from "./data";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: PricingPackage | null;
}

export function WhatsAppModal({ isOpen, onClose, selectedPackage }: WhatsAppModalProps) {
  const [customNote, setCustomNote] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setCustomNote("");
    onClose();
  };

  const defaultMsg = selectedPackage
    ? selectedPackage.whatsAppMessage
    : "Hello Fahad, I would like to discuss a custom web or mobile development project for my business.";

  const finalMessage = customNote
    ? `${defaultMsg}\n\nProject Notes: ${customNote}`
    : defaultMsg;

  const handleWhatsAppRedirect = () => {
    const encoded = encodeURIComponent(finalMessage);
    const url = `https://wa.me/35699784477?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
    handleClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(finalMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-glow text-foreground z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <img
              src={AVATAR_URL}
              alt="Fahad Al Noman"
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-accent/30"
            />
            <div>
              <div className="font-display text-sm font-semibold text-foreground">Fahad Al Noman</div>
              <span className="font-mono text-[11px] text-accent">Direct WhatsApp Inquiry</span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-4">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
              Let&apos;s discuss your project.
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Connect directly with me on WhatsApp for a free strategy consultation.
            </p>
          </div>

          {/* Selected Package Banner */}
          {selectedPackage && (
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold">
                  Selected Package
                </span>
                <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent font-mono">
                  {selectedPackage.price}
                </span>
              </div>
              <p className="mt-1 font-display text-base font-bold text-foreground">
                {selectedPackage.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {selectedPackage.description}
              </p>
            </div>
          )}

          {/* Message Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Pre-filled WhatsApp Message:</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs text-accent hover:underline cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy message</span>
                  </>
                )}
              </button>
            </div>
            <div className="rounded-xl border border-border bg-background p-3 text-xs text-foreground font-mono leading-relaxed select-all">
              {defaultMsg}
            </div>
          </div>

          {/* Optional extra note */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Add specific project details or timeline (optional):
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Need delivery within 2 weeks, custom dashboard, Shopify sync..."
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="flex flex-col items-center rounded-xl border border-border bg-surface-2 p-2.5">
              <Clock className="h-4 w-4 text-accent mb-1" />
              <span className="text-[11px] text-muted-foreground">Fast Reply</span>
              <span className="text-[10px] font-semibold text-foreground">&lt; 30 Mins</span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-border bg-surface-2 p-2.5">
              <ShieldCheck className="h-4 w-4 text-accent mb-1" />
              <span className="text-[11px] text-muted-foreground">Direct Dev</span>
              <span className="text-[10px] font-semibold text-foreground">No Middlemen</span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-border bg-surface-2 p-2.5">
              <Zap className="h-4 w-4 text-accent mb-1" />
              <span className="text-[11px] text-muted-foreground">No Pressure</span>
              <span className="text-[10px] font-semibold text-foreground">Free Discovery</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleWhatsAppRedirect}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-bold text-accent-foreground shadow-glow hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <MessageSquare className="h-4 w-4 fill-current" />
            <span>Continue to WhatsApp</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={handleClose}
            className="rounded-full border border-border px-5 py-3 text-xs font-semibold text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>

        <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground">
          WhatsApp: <span className="text-foreground">{CONTACT.phone}</span> • Email: <span className="text-foreground">{CONTACT.email}</span>
        </p>
      </div>
    </div>
  );
}
