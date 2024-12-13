import { NextResponse } from 'next/server';
import { createClient } from '@/db/supabase/client';

import { BASE_URL } from '@/lib/env';

export default async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/'); // 例如: "tools-1"
  const page = parseInt(slug.replace('tools-', ''), 10);

  if (Number.isNaN(page)) {
    return new NextResponse('Invalid sitemap page', { status: 400 });
  }

  const URLS_PER_SITEMAP = 1000;
  const start = (page - 1) * URLS_PER_SITEMAP;

  const supabase = createClient();
  const { data: tools } = await supabase
    .from('web_navigation')
    .select('name')
    .range(start, start + URLS_PER_SITEMAP - 1)
    .order('collection_time', { ascending: false });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${(tools || [])
        .map(
          (tool) => `
            <url>
              <loc>${BASE_URL}/ai/${tool.name}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>0.8</priority>
            </url>
          `,
        )
        .join('')}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      // 添加缓存控制以提高性能
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
