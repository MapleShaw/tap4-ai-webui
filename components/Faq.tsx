'use client';

import { useState } from 'react';
import { ChevronDown, CircleHelp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

function FaqItem({ question, answers }: { question: string; answers: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='w-full rounded-xl border border-white/10 bg-[#2C2D36]/50 backdrop-blur-sm transition-all duration-300 hover:border-white/20'>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-between p-6 text-left'
      >
        <h3 className='flex items-center gap-3 text-lg font-medium lg:text-xl'>
          <CircleHelp className='size-6 text-blue-400' />
          {question}
        </h3>
        <span className={cn('transform transition-transform duration-300', isOpen ? 'rotate-180' : '')}>
          <ChevronDown className='size-5 text-white/60' />
        </span>
      </button>
      {isOpen && (
        <div className='border-t border-white/10 px-6 py-4'>
          {answers.map((answer) => (
            <p
              key={`faq-answer-${answer.slice(0, 20)}`}
              className='mt-3 text-base leading-relaxed text-white/70 first:mt-0'
            >
              {answer}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Faq() {
  const t = useTranslations('Faq');

  const faqItems = [
    /* {
      question: t('1.question'),
      answers: [t('1.answer')],
    }, */
    {
      question: t('2.question'),
      answers: [t('2.answer-1'), t('2.answer-2'), t('2.answer-3')],
    },
    {
      question: t('3.question'),
      answers: [t('3.answer-1'), t('3.answer-2')],
    },
    {
      question: t('4.question'),
      answers: [t('4.answer')],
    },
    {
      question: t('5.question'),
      answers: [t('5.answer')],
    },
    {
      question: t('6.question'),
      answers: [t('6.answer')],
    },
    {
      question: t('7.question'),
      answers: [t('7.answer')],
    },
    {
      question: t('8.question'),
      answers: [t('8.answer')],
    },
    {
      question: t('9.question'),
      answers: [t('9.answer')],
    },
    {
      question: t('10.question'),
      answers: [t('10.answer')],
    },
    /* {
      question: t('11.question'),
      answers: [t('11.answer')],
    } */
  ];

  return (
    <div className='mx-auto flex max-w-4xl flex-col items-center space-y-8 px-4 pb-10'>
      <h2 className='text-center text-3xl font-bold text-white lg:text-4xl'>{t('title')}</h2>
      {faqItems.map((item) => (
        <FaqItem key={`faq-item-${item.question}`} question={item.question} answers={item.answers} />
      ))}
    </div>
  );
}
