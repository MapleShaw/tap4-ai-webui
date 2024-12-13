import { type MetadataRoute } from 'next';
import { createClient } from '@/db/supabase/client';

// import { locales } from '@/i18n';

import { BASE_URL } from '@/lib/env';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // 获取所有工具数据
  const { data: tools } = await supabase
    .from('web_navigation')
    .select('name')
    .order('collection_time', { ascending: false });

  // 计算需要多少个子 sitemap
  const { count } = await supabase.from('web_navigation').select('*', { count: 'exact', head: true });

  // 主要路由
  const mainRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: '', // home
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'explore',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'submit',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'startup',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 每个文件最多包含 1000 个 URL
  const URLS_PER_SITEMAP = 1000;
  const sitemapCount = Math.ceil((count || 0) / URLS_PER_SITEMAP);

  // 如果工具数量小于1000,直接返回单个sitemap
  if (!tools || tools.length <= URLS_PER_SITEMAP) {
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

  // 生成子 sitemap 引用
  const sitemapIndexes = Array.from({ length: sitemapCount }, (_, i) => ({
    url: `${BASE_URL}/sitemaps/tools-${i + 1}`,
    lastModified: new Date(),
  }));

  return [...mainRoutes, ...sitemapIndexes];

  // const sitemapData = sitemapRoutes.flatMap((route) =>
  //   locales.map((locale) => {
  //     // 移除开头的斜杠，并正确处理空字符串情况
  //     const lang = locale === 'en' ? '' : locale;
  //     const routeUrl = route.url;

  //     // 构建完整URL，处理各种组合情况
  //     const fullPath = [BASE_URL.replace(/\/$/, ''), lang, routeUrl]
  //       .filter(Boolean) // 移除空字符串
  //       .join('/'); // 用单个斜杠连接

  //     return {
  //       ...route,
  //       url: fullPath,
  //     };
  //   }),
  // );

  // return sitemapData;
}
