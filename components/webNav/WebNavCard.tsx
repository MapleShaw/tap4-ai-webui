/* eslint-disable react/jsx-no-target-blank */

import Link from 'next/link';
import { WebNavigation } from '@/db/supabase/types';
import { CircleArrowRight, SquareArrowOutUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function WebNavCard({ name, thumbnail_url, title, url, content }: WebNavigation) {
  const t = useTranslations('Home');

  return (
    <div className='flex h-[210px] flex-col gap-2.5 rounded-lg bg-[#2C2D36] p-2 shadow-lg transition-all duration-300 hover:shadow-xl lg:h-[343px]'>
      <Link href={`/ai/${name}`} title={title} className='group relative overflow-hidden'>
        <img
          src={thumbnail_url || ''}
          alt={title}
          title={title}
          width={310}
          height={174}
          className='aspect-[310/174] w-full rounded-lg bg-white/40 object-cover transition-transform duration-300 group-hover:scale-105'
        />
        <div className='absolute inset-0 z-10 hidden items-center justify-center gap-2 bg-black/40 text-lg font-medium text-white backdrop-blur-[2px] transition-all duration-300 group-hover:flex'>
          {t('checkDetail')} <CircleArrowRight className='size-5' />
        </div>
      </Link>

      <div className='flex items-center justify-between px-2'>
        <a
          href={url}
          title={title}
          target='_blank'
          rel='nofollow'
          className='flex-1 transition-colors duration-200 hover:text-blue-400'
        >
          <h3 className='line-clamp-1 text-sm font-semibold lg:text-base'>{title}</h3>
        </a>
        <a
          href={url}
          title={title}
          target='_blank'
          rel='nofollow'
          className='ml-2 transition-colors duration-200 hover:text-blue-400'
        >
          <SquareArrowOutUpRight className='size-5' />
          <span className='sr-only'>{title}</span>
        </a>
      </div>

      <p className='line-clamp-3 px-2 text-xs text-white/80 lg:line-clamp-5 lg:text-sm'>{content}</p>
    </div>
  );
}
