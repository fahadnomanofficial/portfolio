import { motion } from "framer-motion";
import { ArrowUpRight, Check, Code2, GitBranch, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeader } from "./SectionHeader";
import { fadeUp, staggerParent, viewportOnce } from "./motion";

const groups = [
  { id: "websites", Icon: Code2, title: "Websites & apps", description: "A clear online presence. A better customer experience. Built to work as well as it looks.", items: ["React & Next.js websites", "Laravel applications & APIs", "iOS & Android mobile apps"], link: "Explore development" },
  { id: "systems", Icon: GitBranch, title: "A smarter way to work", description: "Connect your tools, simplify daily tasks, and give your team more time for the work that matters.", items: ["Business & workflow automation", "Custom CRM for customer relationships", "ERP for connected operations"], link: "Explore business systems" },
  { id: "support", Icon: Sparkles, title: "Support & growth", description: "Keep your website healthy, make it easier to find, and improve every step of the user experience.", items: ["WordPress development & maintenance", "SEO & digital marketing", "UI & UX design"], link: "Explore ongoing support" },
];

export function Services() {
  return <section id="services" className="relative py-24 sm:py-32">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionHeader eyebrow="what I can help with" title="Good ideas. Built to work." intro="From your first website to the systems behind your business. A considered approach, from start to finish." />
      <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid gap-5 md:grid-cols-3">
        {groups.map(({ id, Icon, title, description, items, link }, index) => <motion.article key={id} variants={fadeUp} className="service-group" data-service={id}>
          <div className="service-group-number"><span>0{index + 1}</span><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></div>
          <h3>{title}</h3><p>{description}</p>
          <ul>{items.map((item) => <li key={item}><Check size={13} aria-hidden="true" />{item}</li>)}</ul>
          <Link to={`/services#${id}`}>{link}<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </motion.article>)}
      </motion.div>
    </div>
  </section>;
}
