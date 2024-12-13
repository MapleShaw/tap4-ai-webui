'use client';

/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const FormSchema = z.object({
  search: z.string(),
});

export default function SearchForm({ defaultSearch }: { defaultSearch?: string }) {
  const t = useTranslations('Home');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: defaultSearch || '',
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!data.search.trim()) return;
    router.push(`/query/${data.search}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='search'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative flex w-full items-center text-white/70'>
                  <Input
                    placeholder={t('search')}
                    {...field}
                    ref={inputRef}
                    className='h-10 w-full rounded-full border-2 border-white/60 !bg-transparent pr-10 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-colors placeholder:text-white/50 hover:border-white/80 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] focus:border-white lg:h-12 lg:w-[500px] lg:pr-12'
                  />
                  <Separator
                    className='absolute right-8 h-7 w-px bg-white/60 lg:right-10 lg:h-8'
                    orientation='vertical'
                  />
                  <button type='submit' className='absolute right-2 transition-colors hover:text-white lg:right-3'>
                    <Search className='size-5 lg:size-6' />
                    <span className='sr-only'>search</span>
                  </button>
                  <span className='absolute right-14 text-sm text-white/40'>Press /</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
