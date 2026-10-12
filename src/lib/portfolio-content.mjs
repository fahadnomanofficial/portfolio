import { HOME } from './home-content.mjs';

export const PORTFOLIO_META = {
  title: 'Website & App Portfolio | Fahad Al Noman',
  description: 'Explore websites, business platforms and frontend projects by Fahad Al Noman, with project roles, technologies and links to the live websites.',
};

export const SAIL_PROJECTS = [
  {
    name: "Bonikbazar.com",
    url: "https://bonikbazar.com",
    desc: "Classifieds marketplace platform. Full-stack build plus SEO leadership.",
    stack: ["React", "Laravel", "PostgreSQL", "SEO"],
  },
  {
    name: "bdproperty.xyz",
    url: "https://bdproperty.xyz",
    desc: "Property platform; grown via digital ad campaigns that drove 5M+ visits.",
    stack: ["React", "Laravel", "MySQL", "Digital Marketing"],
  },
  {
    name: "Ispondon.com",
    url: "https://ispondon.com",
    desc: "Company web platform.",
    stack: ["React", "Laravel", "MySQL"],
  },
  {
    name: "hideexpo.com",
    url: "https://hideexpo.com",
    desc: "Company web platform.",
    stack: ["React", "Laravel", "MySQL"],
  },
  {
    name: "sailtechbd.com",
    url: "https://sailtechbd.com",
    desc: "Corporate / IT services site.",
    stack: ["WordPress"],
  },
];

export const EU_PROJECTS = [
  {
    name: "infixclean.com",
    url: "https://infixclean.com",
    desc: "Premium cleaning services platform in the EU. Shipped the marketing website, custom admin dashboard, and drove organic growth via SEO & Google Ads campaigns.",
    stack: ["React", "Laravel", "SEO", "Digital Marketing"],
  },
];

export const FREELANCE_PROJECTS = [
  { name: "garikinun.com", url: "https://garikinun.com", desc: "Full build — ongoing / active.", stack: ["Full-Stack"] },
  { name: "BD Care", url: "https://bdcare.com.bd", desc: "Website development.", stack: ["Full-Stack"] },
  { name: "rentthecampbell.com", url: "https://www.rentthecampbell.com/", desc: "Full build.", stack: ["Full-Stack"] },
  { name: "onereal.ca", url: "https://onereal.ca", desc: "Full build.", stack: ["Full-Stack"] },
  { name: "kendortextiles.com", url: "https://kendortextiles.com", desc: "Full build.", stack: ["Full-Stack"] },
  { name: "reliancesupermarket.com.au", url: "https://reliancesupermarket.com.au", desc: "Full build.", stack: ["Full-Stack"] },
  { name: "smileswallet.com", url: "https://smileswallet.com", desc: "Frontend design & build.", stack: ["Frontend"] },
];


const domain = url => new URL(url).hostname.replace(/^www\./,'');
const source = [...EU_PROJECTS, ...FREELANCE_PROJECTS, ...SAIL_PROJECTS];
const unique = source.filter((project,index) => source.findIndex(item => domain(item.url) === domain(project.url)) === index);
export const PORTFOLIO_PROJECTS = unique.map(project => {
  const featured = HOME.projects.find(item => domain(item.url) === domain(project.url));
  return { ...project, featured: Boolean(featured), title: featured?.title || project.name, role: featured?.role || project.desc, image: featured?.image, category: featured?.category || 'WEBSITE / BUSINESS', domain: domain(project.url) };
}).sort((a,b) => {
  const rank = project => { const index = HOME.projects.findIndex(item => domain(item.url) === project.domain); return index < 0 ? 100 : index; };
  return rank(a) - rank(b);
});
export const PORTFOLIO_SCHEMA = {
  '@context':'https://schema.org',
  '@type':'CollectionPage',
  '@id':'https://fahadalnoman.com/portfolio#webpage',
  url:'https://fahadalnoman.com/portfolio', name:PORTFOLIO_META.title, description:PORTFOLIO_META.description,
  mainEntity:{ '@type':'ItemList', numberOfItems:PORTFOLIO_PROJECTS.length, itemListElement:PORTFOLIO_PROJECTS.map((project,index) => ({ '@type':'ListItem', position:index + 1, item:{ '@type':'CreativeWork', name:project.title, url:project.url, description:project.role } })) },
};
