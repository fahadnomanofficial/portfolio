<?php
declare(strict_types=1);
require __DIR__.'/seo-runtime.php';
$path = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/blog', '/');
$base = 'https://fahadalnoman.com';
try {
    if ($path === '/blog') {
        $posts = seoFetch('posts');
        $body = '<header><a href="/">Fahad’s Portfolio</a><nav><a href="/services">Services</a> <a href="/portfolio">Portfolio</a> <a href="/about">About</a></nav></header><main><h1>Ideas for a smarter business.</h1><p>Make better decisions about your website, your systems, and what comes next. Practical ideas from building digital products for real businesses.</p><h2>Fresh perspectives</h2><ul>';
        $items = [];
        foreach ($posts as $post) {
            if (($post['source'] ?? '') !== 'fahadalnoman' || ($post['status'] ?? '') !== 'published') { continue; }
            $url = $base.'/blog/'.rawurlencode($post['slug']);
            $body .= '<li><h2><a href="'.seoEscape($url).'">'.seoEscape($post['title']).'</a></h2><p>'.seoEscape($post['excerpt']).'</p></li>';
            $items[] = ['@type'=>'ListItem', 'position'=>count($items)+1, 'url'=>$url, 'name'=>$post['title']];
        }
        $body .= '</ul><p><a href="/contact">Discuss your website, app or growth project</a></p></main>';
        seoPage('Business Automation, Website & Growth Guides | Fahad Al Noman', 'Practical guides to business automation, websites, mobile apps, CRM/ERP and digital marketing. Clear advice to help you save time and make informed decisions.', '/blog', $body, [['@type'=>'CollectionPage', 'url'=>$base.'/blog', 'name'=>'Business Automation, Website & Growth Guides | Fahad Al Noman', 'mainEntity'=>['@type'=>'ItemList','itemListElement'=>$items]]]);
    }
    if (!preg_match('~^/blog/([a-z0-9-]+)$~', $path, $match)) { throw new RuntimeException('Not found', 404); }
    $post = seoFetch('posts/'.$match[1]);
    if (($post['source'] ?? '') !== 'fahadalnoman' || ($post['status'] ?? '') !== 'published') { throw new RuntimeException('Not found', 404); }
    if (!isset($post['content_html'])) { throw new RuntimeException('Article rendering temporarily unavailable', 503); }
    $title = $post['seo_meta']['meta_title'] ?? $post['seo_title'] ?? $post['title'];
    $desc = $post['seo_meta']['meta_description'] ?? $post['excerpt'] ?? '';
    $image = $post['cover'] ?? null;
    $author = $post['author'] ?: 'Fahad Al Noman';
    $body = '<main><article><h1>'.seoEscape($post['title']).'</h1><p>By <a href="/about">'.seoEscape($author).'</a> · <time datetime="'.seoEscape($post['published_at']).'">'.seoEscape(substr($post['published_at'], 0, 10)).'</time></p>';
    if ($image && str_starts_with($image, 'https://')) { $body .= '<img src="'.seoEscape($image).'" alt="'.seoEscape($post['title']).'" width="1536" height="1024" />'; }
    $body .= $post['content_html'].'</article></main>';
    $schema = [
        ['@type'=>'BlogPosting','@id'=>$base.$path.'#article','headline'=>$post['title'],'description'=>$desc,'url'=>$base.$path,'mainEntityOfPage'=>$base.$path,'datePublished'=>$post['published_at'],'dateModified'=>$post['updated_at'],'author'=>['@type'=>'Person','name'=>$author,'url'=>$base.'/about'],'publisher'=>['@type'=>'Person','name'=>'Fahad Al Noman','url'=>$base.'/about'],'image'=>array_values(array_filter([$image]))],
        ['@type'=>'BreadcrumbList','itemListElement'=>[['@type'=>'ListItem','position'=>1,'name'=>'Home','item'=>$base.'/'],['@type'=>'ListItem','position'=>2,'name'=>'Guides','item'=>$base.'/blog'],['@type'=>'ListItem','position'=>3,'name'=>$post['title'],'item'=>$base.$path]]],
    ];
    seoPage($title, $desc, $path, $body, $schema, $image);
} catch (Throwable $error) {
    $status = $error->getCode() === 404 ? 404 : 503;
    if ($status === 503) { header('Retry-After: 120'); }
    $title = $status === 404 ? 'Article not found' : 'Articles temporarily unavailable';
    seoPage($title.' | Fahad Al Noman', $title, $path, '<main><h1>'.$title.'</h1><p><a href="/blog">Browse guides</a> or <a href="/contact">contact Fahad</a>.</p></main>', [], null, $status);
}
