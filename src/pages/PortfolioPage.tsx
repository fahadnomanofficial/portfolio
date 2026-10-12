import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Globe } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { useSeo } from "@/hooks/use-seo";
import { PORTFOLIO_META, PORTFOLIO_PROJECTS, PORTFOLIO_SCHEMA } from "@/lib/portfolio-content.mjs";

export function PortfolioPage() {
  useSeo({ ...PORTFOLIO_META, path:"/portfolio", customSchema:PORTFOLIO_SCHEMA });
  return <div className="studio-portfolio-page"><Nav /><main className="studio-directory">
    <Link to="/#work" className="studio-text-link"><ArrowLeft size={16} aria-hidden="true" />Back to home</Link>
    <header className="studio-directory-heading"><span className="studio-kicker">PROJECTS / {String(PORTFOLIO_PROJECTS.length).padStart(2,'0')}</span><h1>Ideas turned into<br /><span className="studio-dim">working products.</span></h1><p>Websites, business platforms, and frontend development. Explore the work, my role, and the tools behind each project.</p><nav aria-label="Explore the portfolio"><Link to="/about">About Fahad <ArrowUpRight size={15} aria-hidden="true" /></Link><Link to="/services">Explore services <ArrowUpRight size={15} aria-hidden="true" /></Link></nav></header>
    {[true, false].map(featured => <section key={String(featured)} className="studio-directory-group" aria-labelledby={featured ? 'featured-projects-title' : 'more-projects-title'}>
    <h2 id={featured ? 'featured-projects-title' : 'more-projects-title'} className="studio-directory-group-title">{featured ? 'Featured projects' : 'More work'}<span>{String(PORTFOLIO_PROJECTS.filter(project => project.featured === featured).length).padStart(2,'0')}</span></h2>
    <div className="studio-directory-grid">{PORTFOLIO_PROJECTS.filter(project => project.featured === featured).map((project,index) => <article key={project.domain} className="studio-directory-card" data-featured={featured}>
      <a href={project.url} target="_blank" rel="noreferrer" className="studio-directory-preview" aria-label={`Visit ${project.title}`}>
        {project.image ? <img src={project.image} alt={`${project.title} current live website`} width={1274} height={717} loading="lazy" /> : <span><Globe size={30} strokeWidth={1.2} aria-hidden="true" />{project.title}</span>}<ArrowUpRight size={20} aria-hidden="true" />
      </a>
      <div className="studio-directory-copy"><span className="studio-kicker">{String(index+1).padStart(2,'0')} / {project.category}</span><h3><a href={project.url} target="_blank" rel="noreferrer">{project.title}</a></h3><p>{project.role}</p><ul aria-label={`Technologies for ${project.title}`}>{project.stack.map(tech => <li key={tech}>{tech}</li>)}</ul><a className="studio-directory-domain" href={project.url} target="_blank" rel="noreferrer">{project.domain}<ArrowUpRight size={14} aria-hidden="true" /></a></div>
    </article>)}</div></section>)}
    <div className="studio-directory-cta"><h2>Have something in mind?</h2><Link className="studio-text-link" to="/#contact">Tell me about your project <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
  </main><Footer /></div>;
}
