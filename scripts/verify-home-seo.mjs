import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { HOME } from '../src/lib/home-content.mjs';
import { PORTFOLIO_PROJECTS } from '../src/lib/portfolio-content.mjs';

const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const body = html.split('<body>')[1];
const graphs = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
assert.equal(graphs.length, 1, 'Homepage must have one structured-data graph');
const graph = JSON.parse(graphs[0][1])['@graph'];
assert.equal(new Set(graph.map(item => item['@id'])).size, graph.length, 'Schema entity IDs must be unique');
assert.equal((body.match(/<h1\b/g) || []).length, 1, 'Static homepage must contain one H1');
assert(body.includes(escape(HOME.heading)), 'Visible H1 must be available without JavaScript');
assert(html.includes(`<title>${escape(HOME.title)}</title>`), 'Static page title must match runtime content');
assert(html.includes('rel="canonical" href="https://fahadalnoman.com/"'), 'Homepage canonical must be absolute');
assert(body.includes('href="/blog"'), 'Blog must have a crawlable homepage link');
assert(body.includes('mailto:hello@fahadalnoman.com'), 'Contact email must be crawlable');
assert.equal(graph.filter(item => item['@type'] === 'Service').length, 8);
for (const service of HOME.services) {
  assert(body.includes(escape(service.title)) && body.includes(escape(service.desc)), `Missing readable service: ${service.title}`);
  assert(body.includes(`id="service-${service.id}"`), 'Service entity anchor must resolve');
  assert.equal(graph.find(item => item['@type'] === 'Service' && item.name === service.title)?.description, service.desc);
}
const faq = graph.find(item => item['@type'] === 'FAQPage');
const automationStart = body.indexOf('id="automation-examples"');
assert(body.indexOf('id="work"') > body.indexOf('id="services"') && automationStart > body.indexOf('id="work"') && automationStart < body.indexOf('id="about"'), 'Homepage order must follow the recording: services, portfolio, automation, about');
const automationBody = body.slice(automationStart, body.indexOf('id="about"'));
assert.equal((automationBody.match(/<li>/g) || []).length, 20, 'All 20 automation examples must be crawlable');
for (const label of HOME.automationExamples) assert(automationBody.includes(escape(label)), `Missing automation example: ${label}`);
assert.equal(faq.mainEntity.length, HOME.faqs.length);
for (const answer of HOME.faqs) assert(body.includes(escape(answer.question)) && body.includes(escape(answer.answer)), 'FAQ schema must match readable content');
for (const project of HOME.projects) assert(body.includes(escape(project.title)) && body.includes(`href="${project.url}"`), `Missing project: ${project.title}`);
const featuredDomains = ['infixclean.com','kendortextiles.com','onereal.ca','rentthecampbell.com','reliancesupermarket.com.au','smileswallet.com','bdproperty.xyz'];
assert.deepEqual(HOME.projects.map(project => new URL(project.url).hostname.replace(/^www\./,'')), featuredDomains, 'Featured projects must match the requested seven and their order');
assert.equal(PORTFOLIO_PROJECTS.filter(project => project.featured).length, 7);
assert.equal(PORTFOLIO_PROJECTS.filter(project => !project.featured).length, 6, 'All other projects must remain non-featured');
for (const route of ['about','services','portfolio','pricing','contact','blog','faq','privacy','terms']) {
  const page = readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8');
  assert(page.includes(`rel="canonical" href="https://fahadalnoman.com/${route}"`));
  const scripts = [...page.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert(!JSON.parse(scripts[0][1])['@graph'].some(item => item['@type'] === 'OfferCatalog'), 'Detail routes must not inherit the homepage catalog');
}
const portfolioHtml = readFileSync(new URL('../dist/portfolio/index.html', import.meta.url), 'utf8');
assert(portfolioHtml.includes('CollectionPage') && portfolioHtml.includes('ItemList'), 'Portfolio must expose its collection schema');
assert.equal((portfolioHtml.match(/<article>/g) || []).length, 13, 'Portfolio must list all 13 projects without JavaScript');
assert(portfolioHtml.includes('<h2>Featured projects</h2>') && portfolioHtml.includes('<h2>More work</h2>'), 'Static portfolio must distinguish featured and other projects');
assert(readFileSync(new URL('../dist/sitemap.xml', import.meta.url),'utf8').includes('https://fahadalnoman.com/portfolio'), 'Portfolio must be in the sitemap');
console.log('SEO checks passed: homepage content and schema, 9 route canonicals, and 13 crawlable portfolio projects.');
