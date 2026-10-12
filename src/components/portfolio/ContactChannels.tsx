import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Facebook, Folder, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT } from "./data";
import "./contact-channels.css";

const channels = [
  { Icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, action: "Send an email" },
  { Icon: Phone, label: "Call", value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}`, action: "Call me" },
  { Icon: MessageCircle, label: "WhatsApp", value: CONTACT.phone, href: CONTACT.whatsapp, action: "Open WhatsApp" },
  { Icon: Facebook, label: "Facebook", value: "Fahadnomanofficial", href: CONTACT.facebook, action: "View Facebook" },
  { Icon: Instagram, label: "Instagram", value: "@im_fahadalnoman", href: CONTACT.instagram, action: "View Instagram" },
  { Icon: Linkedin, label: "LinkedIn", value: "Fahad Al Noman", href: CONTACT.linkedin, action: "View LinkedIn" },
];

export function ContactChannels() {
  const [active, setActive] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const restoreFocus = useRef<number | null>(null);
  const hoverSuppressed = useRef(false);
  const close = (focus = false) => {
    hoverSuppressed.current = true;
    if (focus) restoreFocus.current = active;
    setActive(null);
  };
  useEffect(() => {
    if (active === null && restoreFocus.current !== null) {
      buttons.current[restoreFocus.current]?.focus({ preventScroll: true });
      restoreFocus.current = null;
    }
  }, [active]);
  useEffect(() => {
    if (active === null) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setActive(null);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [active]);
  const selected = active === null ? null : channels[active];

  return <div className="contact-channels" ref={root} onPointerLeave={() => { hoverSuppressed.current = false; }}
    onKeyDown={event => { if (event.key === "Escape" && active !== null) { event.preventDefault(); close(true); } }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
    <div className="contact-channel-row" role="group" aria-label="Contact options" data-expanded={selected ? "true" : "false"}>
      {channels.map(({ Icon, label }, index) => <button key={label} type="button"
        ref={element => { buttons.current[index] = element; }}
        className="contact-channel-icon" hidden={active !== null && active !== index}
        aria-label={label} aria-expanded={active === index} aria-controls={active === index ? "contact-channel-details" : undefined}
        onPointerEnter={event => { if (event.pointerType === "mouse" && !hoverSuppressed.current) setActive(index); }}
        onClick={() => setActive(index)}>
        <Icon size={21} aria-hidden="true" />
      </button>)}
      {selected && <>
        <div className="contact-channel-details" id="contact-channel-details" key={selected.label}>
          <span>{selected.label}</span>
          <a href={selected.href} target={selected.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label={`${selected.action}: ${selected.value}`}>
            <span>{selected.value}</span><ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
        <button type="button" className="contact-channel-folder" aria-label="Show all contact icons" onClick={() => close(true)}>
          <Folder className="contact-folder-outline" aria-hidden="true" />
          <span className="contact-folder-icons" aria-hidden="true">{channels.filter((_, index) => index !== active).map(({ Icon, label }) => <Icon key={label} />)}</span>
        </button>
      </>}
    </div>
    <address className="contact-channel-location"><MapPin size={15} aria-hidden="true" />{CONTACT.location}</address>
  </div>;
}
