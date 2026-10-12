import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, ArrowRight, ArrowLeft, Plus, Bot, LayoutDashboard, Globe, Smartphone, Megaphone, PenTool, Search, Wrench, Headphones } from "lucide-react";
import { EU_PROJECTS, FREELANCE_PROJECTS, SAIL_PROJECTS, PORTRAIT_URL } from "./data";
import { fadeUp, staggerParent, viewportOnce } from "./motion";
import { useTour } from "./tour/TourProvider";
import { CHAPTERS } from "./tour/manifest";
import { HOME } from "@/lib/home-content.mjs";
import { TourText } from "./tour/TourText";
export { StudioFooter } from "./StudioFooter";

export function StudioNav() {
  return <header className="studio-nav">
    <Link to="/#top" className="studio-portfolio-title">Fahad’s Portfolio</Link>
    <nav aria-label="Header navigation" className="studio-header-actions"><Link to="/blog" className="studio-blog-button">Blog <ArrowUpRight size={15} aria-hidden="true" /></Link></nav>
  </header>;
}

export function StudioServices() {
  const { motionPaused, reducedMotion, chapter, position, status } = useTour();
  const rail = useRef<HTMLDivElement>(null);
  const serviceCue = CHAPTERS[chapter]?.captions.findLast(cue => cue.start <= position && cue.serviceId);
  const activeService = CHAPTERS[chapter]?.id === 'services' && ['playing','loading','paused'].includes(status) ? serviceCue?.serviceId : undefined;
  useEffect(() => {
    if (!activeService) return;
    const element = rail.current;
    const card = element?.querySelector<HTMLElement>(`#service-${activeService}`);
    if (!element || !card) return;
    const reveal = () => {
      if (!window.matchMedia('(max-width:767px)').matches) return;
      const left = element.scrollLeft + card.getBoundingClientRect().left - element.getBoundingClientRect().left - (element.clientWidth - card.clientWidth) / 2;
      element.scrollTo({ left, behavior:reducedMotion || motionPaused ? 'instant' : 'smooth' });
    };
    reveal();
    const resize = new ResizeObserver(reveal);
    resize.observe(element);
    return () => resize.disconnect();
  }, [activeService, reducedMotion, motionPaused]);
  const icons = { automation:Bot, crm:LayoutDashboard, websites:Globe, apps:Smartphone, marketing:Megaphone, design:PenTool, seo:Search, maintenance:Wrench };
  const services = HOME.services.map(service => ({ ...service, Icon:icons[service.id] }));
  return <section id="services" className="studio-section studio-services studio-section-compact" data-motion-paused={motionPaused || reducedMotion}>
    <div className="studio-section-heading"><span className="studio-kicker"><span /> WHAT I CAN HELP WITH</span><h2>Services for your business.</h2><p>Development, automation, design, and growth.<br />For businesses in Malta and worldwide.</p></div>
    <motion.div ref={rail} className="studio-service-cards" role="region" aria-label="Services, scroll horizontally on mobile" tabIndex={0} variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once:true, amount:.05 }}>
      {services.map(({ Icon, ...service }, index) => <motion.article id={`service-${service.id}`} variants={fadeUp} key={service.id} className="studio-service-card" data-service={service.group} data-voice-active={activeService === service.id || undefined} whileHover={motionPaused || reducedMotion ? undefined : { y:-4 }}>
        <Link to={service.href} className="studio-service-card-link">
          <div className="studio-service-card-top"><span className="studio-service-icon"><Icon size={23} strokeWidth={1.6} aria-hidden="true" /></span><span className="studio-card-number">0{index+1}</span><ArrowUpRight size={17} aria-hidden="true" /></div>
          <h3>{service.title}</h3><p>{service.desc}</p><ul className="studio-service-tags">{service.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
        </Link>
      </motion.article>)}
    </motion.div>
    <Link to="/services" className="studio-text-link studio-explore-services">Explore all services <ArrowUpRight size={17} aria-hidden="true" /></Link>
  </section>;
}

const allProjects = [...EU_PROJECTS, ...FREELANCE_PROJECTS, ...SAIL_PROJECTS];
const projects = HOME.projects;

export function StudioWork() {
  const { chapter, position, status, reducedMotion, motionPaused } = useTour();
  const rail = useRef<HTMLDivElement>(null);
  const moreDisclosure = useRef<HTMLDetailsElement>(null);
  const [scrollState, setScrollState] = useState({ start:true, end:false });
  const cue = CHAPTERS[chapter]?.captions.find(item => position >= item.start && position < item.end);
  const activeProject = CHAPTERS[chapter]?.id === 'work' && ['playing','loading','paused'].includes(status) ? cue?.highlight : undefined;
  const measureScroll = () => {
    const element = rail.current;
    if (element) setScrollState({ start:element.scrollLeft <= 2, end:element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
  };
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const observer = new ResizeObserver(measureScroll);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const element = rail.current;
    const card = element?.querySelector<HTMLElement>(`[data-project="${activeProject}"]`);
    if (!element || !activeProject) return;
    if (!card) {
      if (moreDisclosure.current?.querySelector(`[data-project="${activeProject}"]`)) moreDisclosure.current.open = true;
      return;
    }
    // Move only this horizontal rail; preserve page position and keyboard focus.
    const left = element.scrollLeft + card.getBoundingClientRect().left - element.getBoundingClientRect().left - (element.clientWidth - card.clientWidth) / 2;
    element.scrollTo({ left, behavior:reducedMotion || motionPaused ? 'instant' : 'smooth' });
  }, [activeProject, reducedMotion, motionPaused]);
  const scrollProjects = (direction:number) => {
    const element = rail.current;
    if (element) element.scrollBy({ left:direction * (element.clientWidth * .8), behavior:reducedMotion || motionPaused ? 'instant' : 'smooth' });
  };
  const more = allProjects.filter(p => !projects.some(item => p.url.includes(item.domain)));
  return <section id="work" className="studio-section studio-work studio-section-compact">
    <div className="studio-section-heading"><span className="studio-kicker"><span /> FEATURED WORK / {String(projects.length).padStart(2,'0')}</span><h2>Website & app portfolio.</h2><p>Explore each project and my role.<br />Follow the highlight during Laura’s tour.</p></div>
    <div className="studio-work-toolbar"><div><button type="button" onClick={() => scrollProjects(-1)} disabled={scrollState.start} aria-label="Previous projects"><ArrowLeft size={18} aria-hidden="true" /></button><button type="button" onClick={() => scrollProjects(1)} disabled={scrollState.end} aria-label="Next projects"><ArrowRight size={18} aria-hidden="true" /></button></div></div>
    <div ref={rail} className="studio-project-rail" onScroll={measureScroll} role="region" aria-label="Portfolio projects, scroll horizontally" tabIndex={0}>{projects.map((item,index) => {
      const project = item;
      return <a key={item.id} href={project.url} target="_blank" rel="noreferrer" className="studio-project-card" data-project={item.id} data-voice-active={activeProject === item.id || undefined}>
        <div className={`studio-project-thumbnail ${item.image ? '' : 'studio-project-lettermark'}`} style={item.image ? { backgroundColor:`var(--project-${item.id}-bg)` } : undefined}>
          {item.image ? <img src={item.image} width={1274} height={717} alt={`${item.title} current live website`} loading="lazy" decoding="async" /> : <span aria-hidden="true">{item.id === 'bdproperty' ? 'BD / P' : item.title.split(' ').map(word => word[0]).join(' / ')}<Globe size={28} strokeWidth={1} /></span>}
          <span className="studio-project-voice"><Headphones size={12} aria-hidden="true" /> Laura is showing</span>
        </div>
        <div className="studio-project-card-copy"><span className="studio-kicker">0{index+1} / {item.category}</span><div><h3>{item.title}</h3><ArrowUpRight size={19} aria-hidden="true" /></div><p>{item.role}</p><span className="studio-project-domain">{new URL(project.url).hostname}</span></div>
      </a>;
    })}</div>
    <div className="studio-work-bottom"><p>Previews show the current live websites.</p><details ref={moreDisclosure}><summary>Explore more work <Plus size={16} aria-hidden="true" /></summary><div className="studio-more-work">{more.map(p => <a href={p.url} key={p.url} data-project={p.url.includes('bdcare.com.bd') ? 'bdcare' : undefined} data-voice-active={activeProject === 'bdcare' && p.url.includes('bdcare.com.bd') || undefined} target="_blank" rel="noreferrer">{p.name}<ArrowUpRight size={16} aria-hidden="true" /></a>)}<Link to="/portfolio" className="studio-view-more">View more <ArrowUpRight size={16} aria-hidden="true" /></Link></div></details></div>
  </section>;
}

export function StudioAbout() {
  return <section id="about" className="studio-section studio-about">
    <div className="studio-about-portrait"><div className="studio-portrait-image"><img src={PORTRAIT_URL} alt="Fahad Al Noman seated beside a sunlit window" width={1122} height={1402} loading="lazy" decoding="async" /><span className="studio-portrait-corner">HELLO,<br />I’M FAHAD<span>↗</span></span></div><span className="studio-kicker">BASED IN MALTA. CONNECTED EVERYWHERE.</span></div>
    <div className="studio-about-copy"><span className="studio-kicker"><span /> THE PERSON BEHIND THE WORK</span><h2>Your developer.<br /><span className="studio-dim">Based in Malta.</span></h2><p><TourText text={HOME.about} section="about" /></p><p><TourText text={HOME.aboutMore} section="about" /></p><Link to="/about" className="studio-text-link">About Fahad Al Noman <ArrowUpRight size={18} aria-hidden="true" /></Link><div className="studio-about-note"><span>ORIGIN</span> Bangladesh <ArrowRight size={14} aria-hidden="true" /> Malta <span>WORKING WORLDWIDE</span></div></div>
  </section>;
}

export function StudioProcess() {
  return <section className="studio-section studio-process" aria-labelledby="process-title"><span className="studio-kicker"><span /> HOW WE GET THERE</span><h2 id="process-title">Simple steps.<br /><span className="studio-dim">Thoughtful execution.</span></h2><div className="studio-process-grid">{[
    ['01','Understand.','We talk about your business, your users, and what needs to work better.'],
    ['02','Build.','I design and develop the solution, with clear updates along the way.'],
    ['03','Make it work.','We test, launch, and keep improving what matters.'],
  ].map(([number,title,copy]) => <article key={number}><span>{number}<ArrowDown size={17} aria-hidden="true" /></span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>;
}

export function StudioFaq() {
  return <section id="home-faq" className="studio-section studio-section-compact studio-home-faq" aria-labelledby="home-faq-title">
    <div className="studio-section-heading"><span className="studio-kicker"><span /> BEFORE WE START</span><h2 id="home-faq-title">Questions about working together.</h2></div>
    <div className="studio-faq-list">{HOME.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<Plus size={17} aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div>
    <Link to="/#contact" className="studio-text-link">Discuss your project <ArrowUpRight size={17} aria-hidden="true" /></Link>
  </section>;
}

