// Shared by the React homepage and its static HTML build, so crawlers and visitors
// receive the same service descriptions, project roles, and answers.
export const HOME = {
  title: 'Web Developer in Malta & Business Automation | Fahad Al Noman',
  description: 'Fahad Al Noman builds websites, mobile apps, AI automation and CRM/ERP systems in Malta, with SEO, design and digital marketing for clients worldwide.',
  heading: 'Web development & business automation',
  summary: 'Custom websites, mobile apps, and CRM/ERP solutions. Built around your business, wherever you work.',
  about: 'I’m Fahad Al Noman, a web developer and entrepreneur based in Qormi, Malta. I build websites, mobile apps, and business systems for clients in Malta and worldwide, bringing development, design, and business thinking together.',
  aboutMore: 'My work covers the whole journey — from a first sketch to development, deployment, and ongoing maintenance. I use React, Next.js, Laravel, Flutter, and WordPress to build practical solutions around your needs.',
  services: [
    { id:'automation', group:'systems', title:'Business Automation', desc:'Automate daily tasks and connect your tools with practical AI workflows.', skills:['AI workflows','API integrations'], href:'/services#systems' },
    { id:'crm', group:'systems', title:'Business CRM/ERP Solutions', desc:'Custom systems for customer relationships, sales, inventory, and business operations.', skills:['Custom CRM','Connected ERP'], href:'/services#systems' },
    { id:'websites', group:'websites', title:'Website Building', desc:'Fast, responsive websites built with React, Next.js, or WordPress for your business.', skills:['React & Next.js','WordPress'], href:'/services#websites' },
    { id:'apps', group:'websites', title:'App Building', desc:'Web and mobile apps, designed around your users and business.', skills:['Flutter','Laravel & APIs'], href:'/services#apps' },
    { id:'marketing', group:'support', title:'Digital Marketing', desc:'Reach the right audience with clear strategy and focused digital campaigns.', skills:['Campaigns','Growth strategy'], href:'/services#marketing' },
    { id:'design', group:'websites', title:'UI/UX Design', desc:'Clear, intuitive website and app interfaces that are easy to use.', skills:['Web & app design','User journeys'], href:'/services#design' },
    { id:'seo', group:'support', title:'Search Engine Optimization', desc:'Help customers find you with better site structure, speed, and content.', skills:['Technical SEO','On-page SEO'], href:'/services#seo' },
    { id:'maintenance', group:'support', title:'Website Maintenance', desc:'Keep your website secure, updated, and running smoothly with ongoing support.', skills:['WordPress care','Performance'], href:'/services#support' },
  ],
  automationHeading: 'Business Automation Examples',
  automationSummary: 'Practical workflows to save time, support customers, and keep your business moving.',
  automationExamples: [
    'AI Customer Support', 'Product Enquiry Assistant', 'Order Collection',
    'Lead Capture', 'Lead Follow-up', 'Appointment Booking', 'Quotation Creation',
    'Invoice and Payment Reminders', 'Order Status Updates', 'After-sales Support',
    'Email Management', 'Social Media Workflow', 'Review Requests', 'Inventory Alerts',
    'Staff Task Assignment', 'Document Processing', 'Customer Reactivation',
    'Daily Business Reports', 'Data Synchronisation', 'Internal AI Assistant',
  ],
  projects: [
    { domain:'infixclean', id:'infix', title:'Infix Malta', category:'SERVICES / MALTA', image:'/projects/infix.jpg', role:'Website, admin dashboard & SEO', url:'https://infixclean.com' },
    { domain:'kendortextiles', id:'kendor', title:'Kendor Textiles', category:'TEXTILES', image:'/projects/kendor.png', role:'Website development', url:'https://kendortextiles.com' },
    { domain:'onereal', id:'onereal', title:'ONREAL', category:'REAL ESTATE / CANADA', image:'/projects/onereal.jpg', role:'Website development', url:'https://onereal.ca' },
    { domain:'rentthecampbell', id:'campbell', title:'Rent the Campbell', category:'RENTAL / PROPERTY', image:'/projects/campbell.png', role:'Website development', url:'https://www.rentthecampbell.com/' },
    { domain:'reliancesupermarket', id:'reliance', title:'Reliance Supermarket', category:'RETAIL / AUSTRALIA', role:'Website development', url:'https://reliancesupermarket.com.au' },
    { domain:'smileswallet', id:'smiles', title:'Smiles Wallet', category:'FINTECH / GLOBAL', image:'/projects/smiles.jpg', role:'Frontend design & development', url:'https://smileswallet.com' },
    { domain:'bdproperty', id:'bdproperty', title:'BD Property', category:'PROPERTY / BANGLADESH', image:'/projects/bdproperty.png', role:'Property platform & digital marketing', url:'https://bdproperty.xyz' },
  ],
  faqs: [
    { question:'What services does Fahad Al Noman offer?', answer:'I offer business automation, custom CRM and ERP solutions, website and app development, digital marketing, UI/UX design, search engine optimization, and website maintenance.' },
    { question:'Where are you based, and do you work remotely?', answer:'I’m based in Qormi, Malta, and work remotely with businesses worldwide. We can discuss your goals, review designs, and share project updates online.' },
    { question:'What is the difference between CRM and ERP?', answer:'CRM means Customer Relationship Management: it helps organize leads, customer relationships, and sales. ERP means Enterprise Resource Planning: it connects operations such as inventory, purchasing, and reporting. A custom solution can bring these workflows together.' },
    { question:'How do I start a website, app, or automation project?', answer:'Send your goals, current challenges, and any existing website or software through the contact form or by email. We’ll discuss the requirements and agree on the scope and next steps before development begins.' },
  ],
};

const site = 'https://fahadalnoman.com';
const person = { '@id':`${site}/#person` };
export const HOME_SCHEMA = {
  '@context':'https://schema.org',
  '@graph':[
    { '@type':'Person', ...person, name:'Fahad Al Noman', jobTitle:'Web Developer & Entrepreneur', url:`${site}/`, image:`${site}/fahad-portrait-20261012.png`, email:'mailto:hello@fahadalnoman.com', telephone:'+35699784477', address:{ '@type':'PostalAddress', addressLocality:'Qormi', addressCountry:'MT' }, sameAs:['https://www.linkedin.com/in/fahad-al-noman-555039411/'], knowsAbout:HOME.services.map(service => service.title) },
    { '@type':'WebSite', '@id':`${site}/#website`, url:`${site}/`, name:'Fahad’s Portfolio', inLanguage:'en', publisher:person },
    { '@type':'WebPage', '@id':`${site}/#webpage`, url:`${site}/`, name:HOME.title, description:HOME.description, inLanguage:'en', isPartOf:{ '@id':`${site}/#website` }, about:person, mainEntity:{ '@id':`${site}/#services` }, hasPart:[{ '@id':`${site}/#work` },{ '@id':`${site}/#home-faq` }] },
    { '@type':'OfferCatalog', '@id':`${site}/#services`, name:'Development, automation, and digital marketing services', itemListElement:HOME.services.map(service => ({ '@type':'Offer', itemOffered:{ '@id':`${site}/#service-${service.id}` } })) },
    ...HOME.services.map(service => ({ '@type':'Service', '@id':`${site}/#service-${service.id}`, name:service.title, description:service.desc, url:`${site}${service.href}`, provider:person, areaServed:['Malta','Worldwide'] })),
    { '@type':'ItemList', '@id':`${site}/#work`, name:'Selected portfolio projects', numberOfItems:HOME.projects.length, itemListElement:HOME.projects.map((project,index) => ({ '@type':'ListItem', position:index+1, name:project.title, url:project.url, description:project.role })) },
    { '@type':'FAQPage', '@id':`${site}/#home-faq`, url:`${site}/#home-faq`, isPartOf:{ '@id':`${site}/#webpage` }, mainEntity:HOME.faqs.map(faq => ({ '@type':'Question', name:faq.question, acceptedAnswer:{ '@type':'Answer', text:faq.answer } })) },
  ],
};
