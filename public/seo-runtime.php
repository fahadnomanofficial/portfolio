<?php
declare(strict_types=1);

function seoEscape(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Fetch only public portfolio content; never cache errors as empty results. */
function seoFetch(string $endpoint): array
{
    $url = 'https://admin.zurvix.com/api/'.$endpoint.(str_contains($endpoint, '?') ? '&' : '?').'source=fahadalnoman';
    $cache = sys_get_temp_dir().'/fahadalnoman-seo-'.hash('sha256', __DIR__.$url).'.json';
    if (is_file($cache) && time() - filemtime($cache) < 120) {
        $cached = json_decode((string) file_get_contents($cache), true);
        if (is_array($cached)) { return $cached; }
    }
    $curl = curl_init($url);
    curl_setopt_array($curl, [CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_TIMEOUT => 15, CURLOPT_HTTPHEADER => ['Accept: application/json'], CURLOPT_USERAGENT => 'FahadPortfolioRenderer/1.0']);
    $raw = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    if ($status === 404) { throw new RuntimeException('Not found', 404); }
    $data = is_string($raw) ? json_decode($raw, true) : null;
    if ($status !== 200 || !is_array($data)) { throw new RuntimeException('Content temporarily unavailable', 503); }
    file_put_contents($cache, json_encode($data, JSON_UNESCAPED_SLASHES), LOCK_EX);
    return $data;
}

function seoPage(string $title, string $description, string $path, string $body, array $schema = [], ?string $image = null, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-cache, max-age=0, must-revalidate');
    if ($status !== 200) { header('X-Robots-Tag: noindex'); }
    $url = 'https://fahadalnoman.com'.$path;
    $html = (string) file_get_contents(__DIR__.'/index.html');
    $html = preg_replace('~<title>.*?</title>~s', '<title>'.seoEscape($title).'</title>', $html);
    foreach (['description' => $description, 'og:title' => $title, 'og:description' => $description, 'og:url' => $url, 'twitter:title' => $title, 'twitter:description' => $description, 'og:type' => str_starts_with($path, '/blog/') ? 'article' : 'website'] as $key => $value) {
        $html = preg_replace_callback('~(<meta (?:name|property)="'.preg_quote($key, '~').'" content=")[^"]*~', fn ($match) => $match[1].seoEscape($value), $html);
    }
    if ($image && str_starts_with($image, 'https://')) {
        foreach (['og:image', 'twitter:image'] as $key) {
            $html = preg_replace_callback('~(<meta (?:name|property)="'.$key.'" content=")[^"]*~', fn ($match) => $match[1].seoEscape($image), $html);
        }
    }
    $html = preg_replace('~<link rel="canonical" href="[^"]*"\s*/?>~', '<link rel="canonical" href="'.seoEscape($url).'" />', $html);
    $html = preg_replace('~<script[^>]*type="application/ld\+json"[^>]*>.*?</script>~s', '', $html);
    $html = preg_replace('~<noscript>.*?</noscript>~s', '', $html);
    $nav = '<header><nav><a href="/">Fahad Al Noman</a> · <a href="/services">Services</a> · <a href="/pricing">Pricing</a> · <a href="/blog">Guides</a> · <a href="/contact">Discuss your project</a></nav></header>';
    $fallback = '<div id="root"><div class="seo-document">'.$nav.$body.'</div></div>';
    $html = str_replace('<div id="root"></div>', $fallback, $html);
    $json = json_encode(['@context' => 'https://schema.org', '@graph' => $schema], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES);
    $html = str_replace('</head>', '<script id="seo-jsonld" type="application/ld+json">'.$json.'</script><style>.seo-document{max-width:850px;margin:3rem auto;padding:1.5rem;color:#eee;background:#151515;font:18px/1.7 system-ui}.seo-document h1{font-size:2.4rem;line-height:1.2}.seo-document h2{font-size:1.7rem;margin-top:2rem}.seo-document h3{font-size:1.2rem;margin-top:1.5rem}.seo-document p,.seo-document ul,.seo-document ol{margin:1rem 0}.seo-document ul,.seo-document ol{padding-left:1.5rem}.seo-document a{color:#e2b86d;text-decoration:underline}.seo-document img{max-width:100%;height:auto}.seo-document td,.seo-document th{border:1px solid #555;padding:.6rem}.seo-document table{display:block;overflow:auto}.seo-document li{margin:.5rem 0}</style></head>', $html);
    echo $html;
    exit;
}
