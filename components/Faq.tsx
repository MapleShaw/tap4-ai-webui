'use client';

import { useState } from 'react';
import { CircleHelp } from 'lucide-react';
import { useTranslations } from 'next-intl';

function FaqItem({ question, answers }: { question: string; answers: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='w-full max-w-2xl border-b border-white/10'>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-between py-4 text-left'
      >
        <h3 className='flex items-center gap-2 text-xl'>
          <CircleHelp /> {question}
        </h3>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className='pb-4'>
          {answers.map((answer) => (
            <p key={`faq-answer-${answer.slice(0, 20)}`} className='mt-2 text-white/60'>
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
    <div className='mx-auto flex max-w-2xl flex-col items-center space-y-4 pb-5'>
      <h2 className='mb-8 text-center text-2xl font-bold lg:text-3xl'>{t('title')}</h2>
      {faqItems.map((item) => (
        <FaqItem key={`faq-item-${item.question}`} question={item.question} answers={item.answers} />
      ))}
    </div>
  );
}
