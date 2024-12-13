import { type MetadataRoute } from 'next';
import { createClient } from '@/db/supabase/client';

import { BASE_URL } from '@/lib/env';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // 获取工具总数
  const { count } = await supabase.from('web_navigation').select('*', { count: 'exact', head: true });

  // 主要路由
  const mainRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/startup`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // 每个文件最多包含 1000 个 URL
  const URLS_PER_SITEMAP = 1000;
  const sitemapCount = Math.ceil((count || 0) / URLS_PER_SITEMAP);

  // 如果工具数量小于1000，直接获取所有工具并返回单个sitemap
  if (count && count <= URLS_PER_SITEMAP) {
    const { data: tools } = await supabase
      .from('web_navigation')
      .select('name')
      .order('collection_time', { ascending: false });

    return [
      ...mainRoutes,
      ...(tools || []).map((tool) => ({
        url: `${BASE_URL}/ai/${tool.name}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
    ];
  }

  // 如果工具数量大于1000，返回sitemap索引
  const sitemapIndexes = Array.from({ length: sitemapCount }, (_, i) => ({
    url: `${BASE_URL}/sitemaps/tools-${i + 1}`,
    lastModified: new Date(),
  }));

  return [...mainRoutes, ...sitemapIndexes];
}
