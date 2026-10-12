/**
 * Post-build prerender step.
 *
 * The app is a client-rendered SPA — one static index.html is served for every
 * route, and React updates <title>, <meta>, and <link rel="canonical"> on mount.
 * That works for humans and for Googlebot with JS rendering, but non-JS
 * crawlers (and AdSense reviewers) see the homepage's canonical, title, and
 * fallback content on every URL — which reads as a site full of duplicate
 * pages.
 *
 * This script fixes that. After `vite build` writes dist/index.html, we:
 *   1. Clone that HTML per route (/about, /services, /contact, /blog, ...)
 *   2. Rewrite <title>, meta description, canonical, and OG tags per route
 *   3. Replace the SEO fallback content inside #root with route-specific text
 *   4. Write each to dist/<route>/index.html
 *
 * Apache's DirectorySlash + DirectoryIndex serves dist/about/index.html when
 * a request for /about arrives, because the existing .htaccess check
 * (RewriteCond %{REQUEST_FILENAME} -d) matches a directory before falling
 * through to the SPA fallback.
 *
 * React still hydrates on top of whatever HTML the server sent, so the user
 * experience doesn't change. Only the crawler view improves.
 */

const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const SRC = path.join(DIST, 'index.html');
const SITE = 'https://fahadalnoman.com';
const AVATAR = `${SITE}/avatar_v2.jpg`;
let HOME;
let HOME_SCHEMA;

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));

function homeBody() {
  return `<div style="max-width:1100px;margin:auto;padding:28px;font-family:system-ui,sans-serif;line-height:1.7">
    <header><a href="/#top">Fahad’s Portfolio</a><nav aria-label="Main navigation"><a href="/services">Services</a> · <a href="/portfolio">Portfolio</a> · <a href="/about">About</a> · <a href="/blog">Blog</a> · <a href="/#contact">Contact</a></nav></header>
    <main>
      <section id="top"><h1>${escapeHtml(HOME.heading)}</h1><p>${escapeHtml(HOME.summary)}</p><p>Explore the portfolio, or enable JavaScript for Laura’s optional voice tour.</p></section>
      <section id="services"><h2>Services for your business.</h2><p>Development, automation, design, and growth. For businesses in Malta and worldwide.</p>${HOME.services.map(service => `<article id="service-${service.id}"><h3><a href="${service.href}">${escapeHtml(service.title)}</a></h3><p>${escapeHtml(service.desc)}</p><p>${service.skills.map(escapeHtml).join(' / ')}</p></article>`).join('')}</section>
      <section id="work"><h2>Featured website &amp; app portfolio.</h2><p>Explore each project and my role. Previews show the current live websites.</p><ul>${HOME.projects.map(project => `<li><a href="${project.url}">${escapeHtml(project.title)}</a> — ${escapeHtml(project.role)}</li>`).join('')}</ul><a href="/portfolio">Explore more work</a></section>
      <section id="automation-examples"><h2>${escapeHtml(HOME.automationHeading)}</h2><p>${escapeHtml(HOME.automationSummary)}</p><ul>${HOME.automationExamples.map(label => `<li>${escapeHtml(label)}</li>`).join('')}</ul></section>
      <section id="about"><h2>Your developer. Based in Malta.</h2><p>${escapeHtml(HOME.about)}</p><p>${escapeHtml(HOME.aboutMore)}</p><a href="/about">About Fahad Al Noman</a></section>
      <section><h2>Simple steps. Thoughtful execution.</h2><h3>Understand.</h3><p>We talk about your business, your users, and what needs to work better.</p><h3>Build.</h3><p>I design and develop the solution, with clear updates along the way.</p><h3>Make it work.</h3><p>We test, launch, and keep improving what matters.</p></section>
      <section id="home-faq"><h2>Questions about working together.</h2>${HOME.faqs.map(faq => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join('')}</section>
      <section id="contact"><h2>Your next idea starts here.</h2><p>A new website. A better app. A task that takes too much time. Tell me what you have in mind — we’ll figure out the next step together.</p><address>Qormi, Malta<br /><a href="mailto:hello@fahadalnoman.com">hello@fahadalnoman.com</a><br /><a href="tel:+35699784477">+356 9978 4477</a><br /><a href="https://wa.me/35699784477">WhatsApp</a> · <a href="https://www.linkedin.com/in/fahad-al-noman-555039411/">LinkedIn</a></address><p><a href="/contact">Open the contact page</a></p></section>
    </main><footer><a href="/blog">Blog</a> · <a href="/pricing">Pricing</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></footer>
  </div>`;
}

/**
 * Per-route metadata and readable static content for all visitors, including
 * crawlers without JavaScript. The homepage is generated from the same content
 * module used by React; the other routes retain their existing summaries.
 */
const ROUTES = [
  {
    path: '/about',
    title: 'About Fahad Al Noman — Full-Stack Developer & DevOps Engineer in Malta',
    description:
      "Learn about Fahad Al Noman — a full-stack developer and DevOps engineer based in Qormi, Malta. Six years building marketplaces, deploying production infrastructure, and growing organic traffic for clients across Europe and Asia.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/services">Services</a> <a href="/contact">Contact</a> <a href="/blog">Blog</a></nav></header>
      <main>
        <h1>About Fahad Al Noman</h1>
        <p>Fahad Al Noman is a full-stack developer and DevOps engineer based in Qormi, Malta.
        Six years of experience building production web applications end-to-end — from React and
        Next.js frontends down to the Linux servers and PostgreSQL databases that keep them running.</p>
        <h2>Work Experience</h2>
        <ul>
          <li><strong>Marketing &amp; Technology Coordinator at Prochimps LTD</strong> — Jul 2026 to Present. Santa Venera, Malta.</li>
          <li><strong>Junior DevOps Engineer at CartUp LTD</strong> — Aug 2024 to Feb 2026. Deployed and managed e-commerce apps on Hostinger VPS. Docker containerisation. Python-based PostgreSQL backups.</li>
          <li><strong>Marketing &amp; Technology Coordinator at SAIL Corporation</strong> — Apr 2022 to Jul 2024. Built Bonikbazar.com marketplace, grew bdproperty.xyz to 5M+ visits.</li>
          <li><strong>Freelance Full-Stack Web Developer</strong> — 2020 to Present.</li>
        </ul>
        <h2>Skills</h2>
        <p>React, Next.js, Laravel, Python, PHP, Docker, Linux, PostgreSQL, MySQL, technical SEO, Google Ads, digital marketing.</p>
        <h2>Certifications</h2>
        <ul>
          <li>Programming with a Purpose — Princeton University</li>
          <li>SEO with Squarespace — Coursera</li>
          <li>Fundamentals of Machine Learning and AI — Amazon Web Services</li>
          <li>Google Ads for Beginners — Coursera</li>
        </ul>
        <p><a href="/contact">Get in touch</a></p>
      </main>
    `,
  },
  {
    path: '/services',
    title: 'Website, App & Digital Marketing Services | Fahad Al Noman',
    description:
      "Business automation, CRM/ERP systems, websites, mobile apps, UI/UX design, SEO, digital marketing and ongoing maintenance for businesses worldwide.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/contact">Contact</a> <a href="/blog">Blog</a></nav></header>
      <main>
        <h1>Websites, Apps &amp; Business Systems</h1>
        <p>End-to-end delivery for web projects — design the interface, build the frontend and backend, deploy the infrastructure, and run the marketing.</p>
        <h2 id="systems">Business Automation, CRM &amp; ERP</h2><p>Workflow automation, customer records, lead tracking, connected operations, reporting dashboards and API integrations built around your team.</p>
        <h2 id="apps">Mobile App Development</h2><p>Cross-platform iOS and Android apps for bookings, customer accounts and repeat business, with secure backend APIs and a scoped first release.</p><h2 id="websites">React &amp; Next.js Development</h2>
        <p>Custom React and Next.js apps with TypeScript, server-side rendering, API integrations, and Core Web Vitals tuning.</p>
        <h2>Laravel Web App Development</h2>
        <p>Secure Laravel backends with REST APIs, admin dashboards, PostgreSQL and MySQL schema design, and payment integrations.</p>
        <h2>DevOps, Docker &amp; VPS Management</h2>
        <p>Deploy and containerise applications on Hostinger, DigitalOcean, or any Linux VPS. SSH hardening, automated PostgreSQL backups, Nginx and HTTPS via Let's Encrypt.</p>
        <h2 id="support">WordPress Development &amp; Maintenance</h2>
        <p>Custom WordPress themes, WooCommerce stores, speed optimisation, and ongoing maintenance.</p>
        <h2 id="seo">SEO &amp; Organic Growth for Businesses</h2>
        <p>Technical audits, on-page optimisation, local citations, and Google Business Profile management for Malta and EU targeting.</p>
        <h2 id="marketing">Google Ads &amp; Digital Marketing</h2>
        <p>Google Ads campaigns, conversion tracking, Meta ads, and landing page conversion optimisation. Case study: 5M+ visits to bdproperty.xyz.</p>
        <h2 id="design">UI / UX Design</h2>
        <p>Clean, modern interface design with Figma prototypes, responsive layouts, and accessibility built in.</p>
        <p><a href="/contact">Get in touch to start</a></p>
      </main>
    `,
  },
  {
    path: '/pricing',
    title: 'Pricing & Packages — Web Development, Mobile Apps & SEO | Fahad Al Noman',
    description:
      "Transparent pricing packages for custom website development, Laravel & React apps, mobile apps, technical SEO, and 24/7 maintenance starting from €300.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/services">Services</a> <a href="/pricing">Pricing</a> <a href="/contact">Contact</a> <a href="/blog">Blog</a></nav></header>
      <main>
        <h1>Transparent Pricing &amp; Development Packages</h1>
        <p>Predictable investment for high-performance websites, custom web applications, cross-platform mobile apps, SEO and ongoing maintenance.</p>
        <h2>Core Development Tiers</h2>
        <ul>
          <li><strong>STARTER — Website Only (€300):</strong> Custom responsive website (up to ~5 pages), SEO foundation, contact form, domain & hosting included.</li>
          <li><strong>ECOMMERCE — Online Store (€600):</strong> Custom Shopify, WooCommerce or Laravel storefront with payment gateways, product catalog, and checkout flow.</li>
          <li><strong>ELITE 01 — Website + Mobile App (€800):</strong> Bespoke web platform plus cross-platform Flutter iOS & Android mobile application with unified admin panel.</li>
          <li><strong>ELITE 02 — Web + App + Growth (€1,000):</strong> Complete transformation bundle with custom web app, mobile apps, and full digital marketing & AI search kickoff.</li>
        </ul>
        <h2>Maintenance SLA</h2>
        <p>Website & App Maintenance Plan at €200/month: 24/7 uptime monitoring, daily offsite backups, security patching, speed optimization, and priority support.</p>
        <p><a href="/contact">Get in touch for a free discovery consultation</a></p>
      </main>
    `,
  },
  {
    path: '/contact',
    title: 'Contact Fahad Al Noman — Hire a Full-Stack Developer in Malta',
    description:
      "Get in touch with Fahad Al Noman for freelance web development, Laravel and React projects, DevOps and Docker deployments, SEO audits, and Google Ads campaigns. Based in Qormi, Malta — available worldwide.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/services">Services</a> <a href="/blog">Blog</a></nav></header>
      <main>
        <h1>Contact Fahad Al Noman</h1>
        <p>Whether you're planning a new build, need someone to take over an existing project, or want an SEO audit — send a message. I read every enquiry personally and usually reply the same day.</p>
        <h2>Response time</h2>
        <p>Within 24 hours, Monday to Saturday.</p>
        <h2>Working with</h2>
        <p>Clients worldwide. Based in Malta. Have delivered projects across the EU, UK, US, Canada, Australia, and Bangladesh.</p>
        <h2>Availability</h2>
        <p>Freelance and contract engagements — from short one-off builds to long-term retainers.</p>
        <h2>Get in touch</h2>
        <address>
          <p>Email: <a href="mailto:hello@fahadalnoman.com">hello@fahadalnoman.com</a></p>
          <p>Phone: <a href="tel:+35699784477">+356 9978 4477</a></p>
          <p>WhatsApp: <a href="https://wa.me/35699784477">Chat on WhatsApp</a></p>
          <p>Location: Qormi, Malta</p>
          <p>LinkedIn: <a href="https://www.linkedin.com/in/fahad-al-noman-555039411/" rel="noreferrer">fahad-al-noman on LinkedIn</a></p>
        </address>
      </main>
    `,
  },
  {
    path: '/blog',
    title: 'Blog — Fahad Al Noman',
    description:
      "Notes from building on the web — lessons from shipping marketplaces, growing traffic, and working with developers around the world. Articles on Laravel, React, DevOps, PostgreSQL, technical SEO, and freelance business.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/services">Services</a> <a href="/contact">Contact</a></nav></header>
      <main>
        <h1>Blog</h1>
        <p>Notes from building on the web — lessons from shipping marketplaces, growing traffic, and working with developers around the world.</p>
        <p>Articles cover full-stack web development, Laravel and React, DevOps and Docker on Linux VPS, PostgreSQL, technical SEO, Google Ads, and freelance business tips.</p>
        <p>Browse posts at <a href="/blog">/blog</a>.</p>
      </main>
    `,
  },
  {
    path: '/faq',
    title: 'FAQ — Frequently Asked Questions — Fahad Al Noman',
    description:
      "Find answers to frequently asked questions about Fahad Al Noman's engineering blog, tutorial code usage permissions, freelance availability, and tech stack.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/services">Services</a> <a href="/contact">Contact</a> <a href="/blog">Blog</a></nav></header>
      <main>
        <h1>Frequently Asked Questions</h1>
        <p>Answers to common questions about this engineering blog, tutorial code usage permissions, freelance availability, and tech stack.</p>
        <h2>Can I use the code from your tutorials?</h2>
        <p>Yes, all code snippets and configurations are released under permissive MIT terms for personal and commercial use.</p>
        <h2>Are the tutorials free?</h2>
        <p>Yes, 100% free with no paywalls.</p>
        <h2>Do you take on freelance projects?</h2>
        <p>Yes, open to freelance web development, Laravel and React builds, DevOps setup, and SEO consulting.</p>
        <p><a href="/faq">Read all 10 FAQs</a></p>
      </main>
    `,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — Fahad Al Noman',
    description:
      "Privacy policy for Fahad Al Noman's portfolio site. GDPR-compliant. Details on cookies, Google Analytics, Google AdSense, third-party advertising vendors, and your rights under EU data protection law.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/services">Services</a> <a href="/contact">Contact</a></nav></header>
      <main>
        <h1>Privacy Policy</h1>
        <p>Privacy policy for fahadalnoman.com — including how we collect and use data, cookie consent, Google Analytics, Google AdSense advertising cookies (including the DoubleClick DART cookie), and your rights under the General Data Protection Regulation (GDPR).</p>
        <p>Read the full policy on the site.</p>
      </main>
    `,
  },
  {
    path: '/terms',
    title: 'Terms of Service — Fahad Al Noman',
    description:
      "Terms of service for Fahad Al Noman's portfolio and freelance web development services. Governing law, intellectual property, user conduct, and limitation of liability.",
    body: `
      <header><nav><a href="/">Home</a> <a href="/about">About</a> <a href="/services">Services</a> <a href="/contact">Contact</a></nav></header>
      <main>
        <h1>Terms of Service</h1>
        <p>Terms of service governing use of fahadalnoman.com and the professional freelance services offered — including web development, DevOps, SEO, and digital marketing.</p>
      </main>
    `,
  },
  // Note: /sitemap is intentionally not prerendered as an HTML page.
  // It's served as the real /sitemap.xml file (see scripts/generate-sitemap.cjs).
  // The React app redirects /sitemap -> /sitemap.xml at runtime.
];

function replaceOrInsert(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

/**
 * Given the base index.html, produce a per-route variant.
 */
function makeRoutePage(baseHtml, route) {
  const url = `${SITE}${route.path}`;
  let html = baseHtml;

  // <title>
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(route.title)}</title>`
  );

  // <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${route.description.replace(/"/g, '&quot;')}" />`
  );

  // <link rel="canonical">
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`
  );

  // og:title, og:description, og:url
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${route.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${route.description.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`
  );

  // twitter:title, twitter:description
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${route.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${route.description.replace(/"/g, '&quot;')}" />`
  );

  // Vite moves module scripts into the head, so replace the root directly.
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
  html = html.replace('<div id="root"></div>', `<div id="root">${route.body.trim()}</div>`);

  // Use one graph per page; non-home routes must not inherit the homepage's
  // service catalog, FAQ, project list, or old navigation-as-breadcrumb markup.
  const schema = route.schema || (route.path === '/' ? HOME_SCHEMA : {
    '@context':'https://schema.org',
    '@graph':[
      { '@type':'WebSite', '@id':`${SITE}/#website`, name:'Fahad’s Portfolio', url:`${SITE}/` },
      { '@type':'WebPage', '@id':`${url}#webpage`, url, name:route.title, description:route.description, inLanguage:'en', isPartOf:{ '@id':`${SITE}/#website` } },
    ],
  });
  html = html.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, '');
  html = html.replace('</head>', `<script type="application/ld+json" id="seo-jsonld">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>\n</head>`);

  return html;
}

async function main() {
  ({ HOME, HOME_SCHEMA } = await import('./src/lib/home-content.mjs'));
  const { BLOG, BLOG_SCHEMA } = await import('./src/lib/blog-content.mjs');
  Object.assign(ROUTES.find(route => route.path === '/blog'), {
    title: BLOG.title, description: BLOG.description,
    schema: { '@context':'https://schema.org', '@graph':[BLOG_SCHEMA] },
    body: `<header><a href="/">Fahad’s Portfolio</a><nav><a href="/services">Services</a> <a href="/portfolio">Portfolio</a> <a href="/about">About</a></nav></header><main><h1>${escapeHtml(BLOG.heading)}</h1><p>${escapeHtml(BLOG.intro)}</p><h2>Business automation, websites and digital growth</h2><p>${escapeHtml(BLOG.description)}</p><p>Browse articles by topic, search for an idea, or find a quick read.</p><p><a href="/#contact">Tell me what you have in mind</a></p></main>`,
  });
  const { PORTFOLIO_META, PORTFOLIO_PROJECTS, PORTFOLIO_SCHEMA } = await import('./src/lib/portfolio-content.mjs');
  ROUTES.push({ path:'/portfolio', ...PORTFOLIO_META, schema:{ '@context':'https://schema.org', '@graph':[PORTFOLIO_SCHEMA] }, body:`<header><a href="/">Fahad’s Portfolio</a><nav><a href="/about">About</a> <a href="/services">Services</a> <a href="/blog">Blog</a></nav></header><main><h1>Ideas turned into working products.</h1><p>Websites, business platforms, and frontend development. Explore the work, my role, and the tools behind each project.</p>${[true,false].map(featured => `<section><h2>${featured ? 'Featured projects' : 'More work'}</h2>${PORTFOLIO_PROJECTS.filter(project => project.featured === featured).map(project => `<article><h3><a href="${project.url}">${escapeHtml(project.title)}</a></h3><p>${escapeHtml(project.role)}</p><p>${project.stack.map(escapeHtml).join(' / ')}</p></article>`).join('')}</section>`).join('')}<a href="/#contact">Tell me about your project</a></main>` });
  if (!fs.existsSync(SRC)) {
    console.error(`prerender: dist/index.html not found — run vite build first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(SRC, 'utf8');
  const homeHtml = makeRoutePage(baseHtml, { path:'/', title:HOME.title, description:HOME.description, body:homeBody() });
  fs.writeFileSync(SRC, homeHtml, 'utf8');
  console.log('  prerendered /            → index.html (shared homepage content)');
  let written = 0;

  for (const route of ROUTES) {
    const routeDir = path.join(DIST, route.path.replace(/^\//, ''));
    fs.mkdirSync(routeDir, { recursive: true });

    const outPath = path.join(routeDir, 'index.html');
    const html = makeRoutePage(baseHtml, route);
    fs.writeFileSync(outPath, html, 'utf8');
    written++;
    console.log(`  prerendered ${route.path.padEnd(12)} → ${path.relative(DIST, outPath)}`);
  }

  console.log(`prerender: wrote ${written} per-route HTML files.`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
