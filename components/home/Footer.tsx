import { HTMLAttributeAnchorTarget } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { CONTACT_US_EMAIL } from '@/lib/env';

function InfoLink({
  href,
  title,
  target,
  type,
}: {
  href: string;
  title: string;
  target?: HTMLAttributeAnchorTarget;
  type?: string;
}) {
  return (
    <Link
      href={href}
      title={title}
      className='whitespace-nowrap text-xs hover:opacity-70 lg:text-sm'
      target={target}
      type={type}
    >
      {title}
    </Link>
  );
}

export default function Footer() {
  const t = useTranslations('Footer');

  const INFO_LIST = [
    {
      title: t('privacy'),
      href: '/privacy-policy',
    },
    {
      title: t('termsConditions'),
      href: '/terms-of-service',
    },
  ];

  return (
    <footer className='w-full bg-[#15141A]'>
      <div className='mx-auto flex min-h-[180px] max-w-pc flex-col items-center justify-between p-10 pb-5 lg:flex-row lg:px-0 lg:pb-10'>
        {/* 左侧标题部分 */}
        <div className='flex flex-col items-center lg:items-stretch'>
          <p className='text-xl font-bold text-white lg:h-8 lg:text-[32px]'>{t('title')}</p>
          <p className='text-xs'>{t('subTitle')}</p>
        </div>

        {/* 右侧链接部分 */}
        <div className='mt-5 flex flex-col items-center gap-5 lg:mt-0 lg:flex-row lg:items-start lg:gap-10'>
          {/* 社交媒体链接 */}
          <a
            href='https://x.com/msjiaozhu' // 替换成你的 Twitter 链接
            target='_blank'
            rel='noreferrer'
            className='flex items-center gap-2 text-xs hover:opacity-70 lg:text-sm'
          >
            <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor'>
              <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
            </svg>
            {/* <span>Twitter</span> */}
          </a>

          {/* 信息链接和联系方式 */}
          <div className='flex flex-row gap-3'>
            {INFO_LIST.map((item) => (
              <InfoLink key={item.href} href={item.href} title={item.title} />
            ))}
            <a
              href={`mailto:${CONTACT_US_EMAIL}`}
              className='whitespace-nowrap text-xs hover:opacity-70 lg:text-sm'
              title={t('contactUs')}
              type='email'
            >
              {t('contactUs')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
