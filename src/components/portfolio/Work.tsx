import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SAIL_PROJECTS, FREELANCE_PROJECTS, EU_PROJECTS } from "./data";
import { fadeUp, staggerParent, viewportOnce } from "./motion";

type Project = { name: string; url: string; desc: string; stack: string[] };
const allProjects: Project[] = [...EU_PROJECTS, ...FREELANCE_PROJECTS, ...SAIL_PROJECTS];
const selected = [
  { domain: "infixclean", id: "infix", title: "Infix Malta", image: "/projects/infix.jpg", role: "Website · Admin dashboard · SEO" },
  { domain: "onereal", id: "onereal", title: "ONREAL", image: "/projects/onereal.jpg", role: "Website development" },
  { domain: "smileswallet", id: "smiles", title: "Smiles Wallet", image: "/projects/smiles.jpg", role: "Frontend design & development" },
  { domain: "bdproperty", id: "bdproperty", title: "BD Property", image: undefined, role: "Property platform · Digital marketing" },
  { domain: "kendortextiles", id: "kendor", title: "Kendo Textile", image: undefined, role: "Website development" },
  { domain: "bdcare", id: "bdcare", title: "BD Care", image: undefined, role: "Website development" },
];
const remaining = allProjects.filter(p => !selected.some(item => p.url.includes(item.domain)));

export function Work() {
  return <section id="work" className="relative py-24 sm:py-32">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionHeader eyebrow="selected work" title="Ideas, put to work." intro="Websites and platforms built for real businesses. Explore a few of the projects below." />
      <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {selected.map(item => {
          const project = allProjects.find(p => p.url.includes(item.domain))!;
          return <motion.a key={item.id} variants={fadeUp} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 24 }} data-project={item.id} href={project.url} target="_blank" rel="noreferrer" className="project-preview group overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/50">
            {item.image && <div className="project-preview-image"><img src={item.image} alt={`${item.title} live website preview`} width={1274} height={717} loading="lazy" decoding="async" /></div>}
            <div className="p-6">
              <div className="flex items-center justify-between gap-3"><h3 className="font-display text-xl font-semibold group-hover:text-accent">{item.title}</h3><ArrowUpRight size={19} className="shrink-0 text-muted-foreground group-hover:text-accent" aria-hidden="true" /></div>
              <p className="mt-2 text-sm text-muted-foreground">{item.role}</p>
              <div className="mt-5 flex flex-wrap gap-2">{project.stack.map(s => <span key={s} className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground">{s}</span>)}</div>
            </div>
          </motion.a>;
        })}
      </motion.div>
      <p className="mt-4 font-mono text-[10px] text-muted-foreground">Previews show the current live websites.</p>
      <details className="more-projects mt-10 rounded-2xl border border-border bg-surface">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display font-medium">More projects <span className="flex items-center gap-3 font-mono text-xs text-muted-foreground">{remaining.length} projects <Plus size={17} aria-hidden="true" /></span></summary>
        <div className="grid gap-4 border-t border-border p-5 sm:grid-cols-2 lg:grid-cols-3">{remaining.map(p => <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="rounded-xl border border-border p-4 transition-colors hover:border-accent/50"><div className="flex items-center justify-between gap-2"><h3 className="font-display font-semibold">{p.name}</h3><ArrowUpRight size={16} aria-hidden="true" /></div><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p></a>)}</div>
      </details>
    </div>
  </section>;
}
