<?php
declare(strict_types=1);
require __DIR__.'/seo-runtime.php';
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=120, must-revalidate');
try {
    $posts = seoFetch('posts');
    $urls = [];
    foreach (['/', '/about', '/services', '/pricing', '/contact', '/blog', '/faq', '/terms', '/privacy'] as $path) {
        $urls[] = ['loc'=>'https://fahadalnoman.com'.$path];
    }
    foreach ($posts as $post) {
        if (($post['source'] ?? '') !== 'fahadalnoman' || ($post['status'] ?? '') !== 'published') { continue; }
        $urls[] = ['loc'=>'https://fahadalnoman.com/blog/'.rawurlencode($post['slug']), 'lastmod'=>substr($post['updated_at'] ?? $post['published_at'], 0, 10)];
    }
    echo '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
    foreach ($urls as $url) {
        echo '<url><loc>'.seoEscape($url['loc']).'</loc>'.(isset($url['lastmod']) ? '<lastmod>'.seoEscape($url['lastmod']).'</lastmod>' : '')."</url>\n";
    }
    echo '</urlset>';
} catch (Throwable $error) {
    http_response_code(503);
    header('Retry-After: 120');
    header('Cache-Control: no-store');
    echo '<?xml version="1.0"?><error>Sitemap temporarily unavailable</error>';
}
