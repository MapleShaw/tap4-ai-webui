import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { createClient } from '@/db/supabase/client';
import { CircleChevronRight, Flame, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { RevalidateOneHour } from '@/lib/constants';
import Faq from '@/components/Faq';
import SearchForm from '@/components/home/SearchForm';
import WebNavCardList from '@/components/webNav/WebNavCardList';

import { TagList } from './Tag';

const ScrollToTop = dynamic(() => import('@/components/page/ScrollToTop'), { ssr: false });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.home',
  });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: './',
    },
  };
}

export const revalidate = RevalidateOneHour;

export default async function Page() {
  const supabase = createClient();
  const t = await getTranslations('Home');

  // 使用 Promise.all 并行获取三组数据
  const [{ data: categoryList }, { data: hotList }, { data: newList }] = await Promise.all([
    supabase.from('navigation_category').select(),
    supabase
      .from('web_navigation')
      .select()
      .order('star_rating', { ascending: false }) // 最热排序
      .limit(8),
    supabase
      .from('web_navigation')
      .select()
      .order('collection_time', { ascending: false }) // 最新排序
      .limit(8),
  ]);

  return (
    <div className='relative w-full'>
      {/* 添加渐变背景 */}
      <div className='absolute inset-0 h-[600px] bg-gradient-to-b from-[#2C2D36] via-[#2d1b42] to-transparent opacity-50' />
      <div className='relative mx-auto w-full max-w-pc flex-1 px-3 lg:px-0'>
        <div className='my-10 flex flex-col text-center lg:mx-auto lg:my-20 lg:max-w-[800px]'>
          <h1 className='bg-gradient-to-r from-[#FF8BFF] via-[#89C4FF] to-[#7AFFAF] bg-clip-text text-3xl font-bold text-transparent lg:text-6xl'>
            {t('title')}
          </h1>
          <h2 className='mt-4 text-balance text-sm font-medium text-white/80 lg:text-xl'>{t('subTitle')}</h2>
        </div>
        <div className='mx-auto mb-16 flex w-full max-w-[600px] items-center justify-center px-4'>
          <SearchForm />
        </div>
        <div className='mb-10 mt-5'>
          <TagList
            data={categoryList!.map((item) => ({
              id: String(item.id),
              name: item.name,
              title: item.title,
              href: `/category/${item.name}`,
            }))}
          />
        </div>
        <section className='flex flex-col gap-5'>
          <h2 className='flex items-center gap-2 text-[18px] lg:text-2xl'>
            <Flame className='size-5 text-orange-500' />
            {t('hotTools')}
          </h2>
          <WebNavCardList dataList={hotList!} />
        </section>

        <section className='mt-10 flex flex-col gap-5'>
          <h2 className='flex items-center gap-2 text-[18px] lg:text-2xl'>
            <Sparkles className='size-5 text-blue-500' />
            {t('newTools')}
          </h2>
          <WebNavCardList dataList={newList!} />
        </section>

        <Link
          href='/explore'
          className='mx-auto mb-5 mt-10 flex w-fit items-center justify-center gap-5 rounded-[9px] border border-white p-[10px] text-sm leading-4 hover:opacity-70'
        >
          {t('exploreMore')}
          <CircleChevronRight className='mt-[0.5] h-[20px] w-[20px]' />
        </Link>

        <div className='mt-16 lg:mt-24'>
          <Faq />
        </div>

        <ScrollToTop />
      </div>
    </div>
  );
}
