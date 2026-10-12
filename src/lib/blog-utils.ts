import type { BlogCategory, BlogPost } from "@/api/client";

export type BlogFilters = { category?: string | null; tag?: string | null; query?: string; sort?: string };
export function articleTime(post: BlogPost) {
  const value = Date.parse(post.published_at || post.date || post.created_at || "");
  return Number.isFinite(value) ? value : 0;
}
export function articleDate(post: BlogPost) {
  const timestamp = articleTime(post);
  return timestamp ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(timestamp) : "";
}
export function articleMinutes(post: BlogPost) {
  return Math.max(1, post.read_minutes || Math.ceil((post.content || post.excerpt).split(/\s+/).length / 200));
}
export function collectCategories(posts: BlogPost[], categories: BlogCategory[]) {
  const result = new Map(categories.map(category => [category.slug, category]));
  for (const post of posts) if (post.category?.slug && !result.has(post.category.slug)) result.set(post.category.slug, post.category);
  return Array.from(result.values()).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.name.localeCompare(b.name));
}
export function matchesCategory(post: BlogPost, slug: string, categories: BlogCategory[]) {
  const category = categories.find(item => item.slug === slug);
  return post.category?.slug === slug || !!(category && post.category_id === category.id) || post.tags.some(tag => tag.toLowerCase() === slug.toLowerCase() || tag.toLowerCase() === category?.name.toLowerCase());
}
export function selectArticles(posts: BlogPost[], categories: BlogCategory[], filters: BlogFilters = {}) {
  const query = (filters.query || "").trim().toLowerCase();
  return posts.filter(post => post.status === "published")
    .filter(post => !filters.category || matchesCategory(post, filters.category, categories))
    .filter(post => !filters.tag || post.tags.some(tag => tag.toLowerCase() === filters.tag!.toLowerCase()))
    .filter(post => !query || [post.title, post.excerpt, post.category?.name || "", ...post.tags].join(" ").toLowerCase().includes(query))
    .sort((a, b) => filters.sort === "oldest" ? articleTime(a) - articleTime(b) || a.id - b.id
      : filters.sort === "quick" ? articleMinutes(a) - articleMinutes(b) || articleTime(b) - articleTime(a)
      : articleTime(b) - articleTime(a) || b.id - a.id);
}
