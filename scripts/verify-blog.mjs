import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { BLOG, BLOG_SCHEMA } from '../src/lib/blog-content.mjs';

// Exercise the actual TypeScript selectors without a browser or API dependency.
const source = fs.readFileSync(new URL('../src/lib/blog-utils.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module:ts.ModuleKind.ESNext, target:ts.ScriptTarget.ES2022 } });
const { selectArticles, collectCategories, articleMinutes, articleDate } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const categories = [{ id:1, slug:'automation', name:'Automation' }, { id:2, slug:'websites', name:'Websites' }];
const base = { excerpt:'Practical advice for businesses', cover:'', content:'Useful ideas.', tags:[], status:'published', featured:false, weight:0 };
const posts = [
  { ...base, id:1, slug:'automate-support', title:'Automate customer support', category_id:1, published_at:'2026-10-12', read_minutes:8, tags:['AI'] },
  { ...base, id:2, slug:'website-guide', title:'Build a better website', category:categories[1], published_at:'2026-10-10', read_minutes:3, tags:['Growth'] },
  { ...base, id:3, slug:'old-note', title:'Organise daily work', date:'2026-10-01', read_minutes:5, tags:['automation'] },
  { ...base, id:4, slug:'draft', title:'Unpublished', published_at:'2026-10-13', status:'draft', read_minutes:1 },
];
const ids = filters => selectArticles(posts, categories, filters).map(post => post.id);
assert.deepEqual(ids(), [1,2,3], 'Newest first; exclude drafts');
assert.deepEqual(ids({sort:'oldest'}), [3,2,1]);
assert.deepEqual(ids({sort:'quick'}), [2,3,1]);
assert.deepEqual(ids({category:'automation'}), [1,3], 'Match category IDs and legacy tags');
assert.deepEqual(ids({category:'websites'}), [2], 'Match embedded categories');
assert.deepEqual(ids({category:'does-not-exist'}), [], 'Unknown category must not show all posts');
assert.deepEqual(ids({tag:'ai', query:' CUSTOMER '}), [1], 'Case-insensitive search and tag matching');
assert.deepEqual(ids({category:'automation', tag:'Growth'}), [], 'Filters intersect');
assert.deepEqual(ids({query:'websites'}), [2], 'Search category name');
assert.equal(collectCategories(posts, []).length, 1, 'Recover categories from articles if category API fails');
assert.equal(collectCategories(posts, categories).length, 2, 'Deduplicate embedded categories');
assert.equal(articleDate({...posts[0], published_at:'invalid'}), '');
assert.equal(articleMinutes({...posts[0], read_minutes:0, content:''}), 1);
assert.deepEqual(posts.map(post => post.id), [1,2,3,4], 'Filtering/sorting does not mutate API data');

const html = fs.readFileSync(new URL('../dist/blog/index.html', import.meta.url), 'utf8');
assert.ok(html.includes(BLOG.heading));
assert.ok(html.includes(BLOG.title.replaceAll('&','&amp;')));
assert.match(html, /rel="canonical" href="https:\/\/fahadalnoman.com\/blog"/);
const schemaMatch = html.match(/<script type="application\/ld\+json" id="seo-jsonld">([\s\S]*?)<\/script>/);
assert.ok(schemaMatch);
assert.deepEqual(JSON.parse(schemaMatch[1])['@graph'][0], BLOG_SCHEMA);
assert.ok(!html.includes('id="services"'), 'Blog must not inherit homepage fallback content');
console.log('Blog checks passed: search, combined filters, published-only data, sorting, category recovery, and prerendered SEO.');
