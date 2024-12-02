import { type MetadataRoute } from 'next';
import { locales } from '@/i18n';

import { BASE_URL } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapRoutes: MetadataRoute.Sitemap = [
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

  const sitemapData = sitemapRoutes.flatMap((route) =>
    locales.map((locale) => {
      // 移除开头的斜杠，并正确处理空字符串情况
      const lang = locale === 'en' ? '' : locale;
      const routeUrl = route.url;

      // 构建完整URL，处理各种组合情况
      const fullPath = [BASE_URL.replace(/\/$/, ''), lang, routeUrl]
        .filter(Boolean) // 移除空字符串
        .join('/'); // 用单个斜杠连接

      return {
        ...route,
        url: fullPath,
      };
    }),
  );

  return sitemapData;
}
