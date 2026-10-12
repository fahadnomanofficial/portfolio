import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Clock, Search, X, RefreshCw, FileText } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { fetchPosts, fetchCategories, type BlogPost, type BlogCategory } from "@/api/client";
import { applySeo, SITE_URL } from "@/lib/seo";
import { BLOG, BLOG_SCHEMA } from "@/lib/blog-content.mjs";
import { articleDate, articleMinutes, collectCategories, matchesCategory, selectArticles } from "@/lib/blog-utils";
import "./blog.css";

const PAGE_SIZE = 9;

function ArticleCover({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [post.cover]);
  return <div className="journal-cover">
    {post.cover && !failed ? <img src={post.cover} alt="" width={1200} height={750} loading={featured ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)} />
      : <div className="journal-cover-fallback" aria-hidden="true"><BookOpen size={46} strokeWidth={1} /><span>{post.category?.name || post.tags[0] || "Business & technology"}</span><span className="journal-cover-lines" /></div>}
    {featured && <span className="journal-feature-label">FEATURED READ <ArrowUpRight size={13} aria-hidden="true" /></span>}
  </div>;
}

function ArticleMeta({ post }: { post: BlogPost }) {
  const date = articleDate(post);
  return <div className="journal-meta">{date && <span>{date}</span>}<span><Clock size={13} aria-hidden="true" />{articleMinutes(post)} min read</span></div>;
}

function ArticleCard({ post }: { post: BlogPost }) {
  return <article className="journal-card"><Link to={`/blog/${post.slug}`} className="journal-card-link">
    <ArticleCover post={post} />
    <div className="journal-card-copy"><span className="journal-topic">{post.category?.name || post.tags[0] || "Insights"}</span><h3>{post.title}</h3><p>{post.excerpt}</p><ArticleMeta post={post} /><span className="journal-read">Read article <ArrowUpRight size={17} aria-hidden="true" /></span></div>
  </Link></article>;
}

export function BlogListPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category");
  const tag = params.get("tag");
  const query = params.get("q") || "";
  const sort = ["oldest", "quick"].includes(params.get("sort") || "") ? params.get("sort")! : "latest";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [rawCategories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    setLoading(true);
    setError(false);
    Promise.allSettled([fetchPosts(undefined, controller.signal), fetchCategories(controller.signal)]).then(([articles, topics]) => {
      if (!active) return;
      if (articles.status === "fulfilled") setPosts(articles.value.filter(post => post.status === "published"));
      else setError(true);
      if (topics.status === "fulfilled") setCategories(topics.value);
      setLoading(false);
      window.clearTimeout(timeout);
    });
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, [retry]);

  const categories = useMemo(() => collectCategories(posts, rawCategories), [posts, rawCategories]);
  const allPosts = useMemo(() => selectArticles(posts, categories), [posts, categories]);
  const filtered = useMemo(() => selectArticles(posts, categories, { category, tag, query, sort }), [posts, categories, category, tag, query, sort]);
  const tags = useMemo(() => Array.from(new Set(posts.flatMap(post => post.tags))).slice(0, 8), [posts]);
  const isFiltered = !!(category || tag || query.trim());
  const featured = !isFiltered && sort === "latest" ? allPosts.find(post => post.featured) || allPosts[0] : undefined;
  const remaining = featured ? filtered.filter(post => post.id !== featured.id) : filtered;
  const currentCategory = categories.find(item => item.slug === category);

  useEffect(() => setLimit(PAGE_SIZE), [query, category, tag, sort]);
  useEffect(() => {
    applySeo({
      title: currentCategory?.seo_title || (tag ? `${tag} Articles | Fahad Al Noman` : BLOG.title),
      description: currentCategory?.seo_meta?.meta_description || currentCategory?.description || BLOG.description,
      path: "/blog",
      keywords: ["business automation", "web development", "CRM ERP", "mobile apps", "digital marketing"],
      breadcrumbs: [{ name: "Home", url: `${SITE_URL}/` }, { name: "Blog", url: `${SITE_URL}/blog` }],
      customSchema: { ...BLOG_SCHEMA, mainEntity: { "@type": "ItemList", itemListElement: filtered.map((post, index) => ({ "@type": "ListItem", position: index + 1, name: post.title, url: `${SITE_URL}/blog/${post.slug}` })) } },
    });
  }, [currentCategory, tag, filtered]);

  function updateFilters(changes: Record<string, string | null>, replace = false) {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      for (const [key, value] of Object.entries(changes)) value ? next.set(key, value) : next.delete(key);
      return next;
    }, { replace });
  }
  function resetFilters() { updateFilters({ category: null, tag: null, q: null, sort: null }); }

  return <div className="journal-page"><Nav /><main id="blog-main" className="journal-main">
    <header className="journal-header">
      <Link to="/" className="studio-text-link journal-back"><ArrowLeft size={15} aria-hidden="true" />Back to home</Link>
      <div className="journal-heading-layout"><div><span className="studio-kicker">THE BLOG / IDEAS & INSIGHTS</span><h1>Ideas for a<br /><span>smarter business.</span></h1><p>{BLOG.intro}</p></div>
        <aside className="journal-note"><BookOpen size={25} strokeWidth={1.3} aria-hidden="true" /><span>LESS GUESSWORK.<br />BETTER NEXT STEPS.</span><p>Websites. Automation. Digital growth.<br />Explore the thinking behind the work.</p><Link to="/about">Meet the person behind it <ArrowUpRight size={15} aria-hidden="true" /></Link></aside>
      </div>
    </header>

    <section className="journal-library" aria-labelledby="journal-library-title">
      <div className="journal-toolbar">
        <div className="journal-search"><Search size={18} aria-hidden="true" /><label className="sr-only" htmlFor="journal-search">Search articles</label><input id="journal-search" type="search" placeholder="What would you like to learn?" value={query} onChange={event => updateFilters({ q: event.target.value || null }, true)} />{query && <button type="button" onClick={() => updateFilters({ q: null }, true)} aria-label="Clear search"><X size={17} aria-hidden="true" /></button>}</div>
        <div className="journal-sort"><label htmlFor="journal-sort">Sort by</label><select id="journal-sort" value={sort} onChange={event => updateFilters({ sort: event.target.value === "latest" ? null : event.target.value })}><option value="latest">Newest first</option><option value="oldest">Oldest first</option><option value="quick">Quick reads</option></select></div>
      </div>
      <nav className="journal-categories" aria-label="Filter articles by topic"><button type="button" aria-pressed={!category && !tag} onClick={() => updateFilters({ category: null, tag: null })}>All articles{!loading && !error && <span>{posts.length}</span>}</button>{categories.map(item => <button key={item.slug} type="button" aria-pressed={category === item.slug} onClick={() => updateFilters({ category: category === item.slug ? null : item.slug, tag: null })}>{item.name}<span>{posts.filter(post => matchesCategory(post, item.slug, categories)).length}</span></button>)}</nav>
      {tags.length > 0 && <div className="journal-tags"><span>Explore:</span>{tags.map(item => <button type="button" key={item} aria-pressed={tag === item} onClick={() => updateFilters({ tag: tag === item ? null : item })}>#{item}</button>)}</div>}

      <div className="journal-results-heading"><h2 id="journal-library-title">{isFiltered ? "Your reading list" : "Fresh perspectives"}</h2><span role="status" aria-live="polite">{loading ? "Loading articles…" : error ? "" : `${filtered.length} ${filtered.length === 1 ? "article" : "articles"}`}</span></div>
      {isFiltered && <div className="journal-active-filters"><span>{category && `${currentCategory?.name || category} · `}{tag && `#${tag} · `}{query.trim() && `“${query.trim()}”`}</span><button type="button" onClick={resetFilters}>Clear filters <X size={13} aria-hidden="true" /></button></div>}

      <div aria-busy={loading}>
        {loading ? <div className="journal-grid journal-skeletons" aria-hidden="true">{Array.from({ length: 3 }, (_, index) => <div className="journal-skeleton" key={index}><div /><span /><span /><span /></div>)}</div>
          : error ? <div className="journal-empty" role="alert"><RefreshCw size={27} strokeWidth={1.4} aria-hidden="true" /><h3>Articles couldn’t load.</h3><p>Please try again in a moment. You can still explore the services and work.</p><button type="button" onClick={() => setRetry(value => value + 1)}>Try again <RefreshCw size={15} aria-hidden="true" /></button><Link to="/services">Explore services <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
          : filtered.length === 0 ? <div className="journal-empty"><FileText size={28} strokeWidth={1.4} aria-hidden="true" /><h3>{isFiltered ? "No matching articles yet." : "New ideas are on the way."}</h3><p>{isFiltered ? "Try another topic or a shorter search." : "While the next guide takes shape, explore the projects and services behind this site."}</p>{isFiltered ? <button type="button" onClick={resetFilters}>Show all articles <ArrowRight size={15} aria-hidden="true" /></button> : <Link to="/portfolio">Explore the work <ArrowUpRight size={15} aria-hidden="true" /></Link>}</div>
          : <>
            {featured && <article className="journal-feature"><Link to={`/blog/${featured.slug}`}><ArticleCover post={featured} featured /><div className="journal-feature-copy"><span className="journal-topic">{featured.category?.name || featured.tags[0] || "Selected for you"}</span><h3>{featured.title}</h3><p>{featured.excerpt}</p><ArticleMeta post={featured} /><span className="journal-read">Read the story <ArrowUpRight size={19} aria-hidden="true" /></span></div></Link></article>}
            <div className="journal-grid">{remaining.slice(0, limit).map(post => <ArticleCard key={post.id} post={post} />)}</div>
            <div className="journal-load-more"><span role="status" aria-live="polite">Showing {Math.min(limit, remaining.length) + (featured ? 1 : 0)} of {filtered.length} articles</span>{remaining.length > limit && <button type="button" onClick={() => setLimit(value => value + PAGE_SIZE)}>More to explore <ArrowRight size={16} aria-hidden="true" /></button>}</div>
          </>}
      </div>
    </section>
    <aside className="journal-project-note"><div><span className="studio-kicker">FROM AN IDEA TO A PLAN</span><h2>Want to put it into practice?</h2><p>Let’s talk about what could work for your business.</p></div><Link to="/#contact">Tell me what you have in mind <ArrowUpRight size={18} aria-hidden="true" /></Link></aside>
  </main><Footer /></div>;
}
