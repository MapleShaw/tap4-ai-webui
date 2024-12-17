'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ExploreParams } from '@/types/explore';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterSortProps {
  tagOptions: { value: string; label: string }[];
  defaultValues?: ExploreParams;
}

export default function FilterSort({ tagOptions, defaultValues }: FilterSortProps) {
  const t = useTranslations('Explore');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagsChange = (values: string[]) => {
    const params = new URLSearchParams(searchParams);
    if (values.length) {
      params.set('tags', values.join(','));
    } else {
      params.delete('tags');
    }
    router.push(`/explore?${params.toString()}`);
  };

  const handleSortChange = (field: string, order: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sortField', field);
    params.set('sortOrder', order);
    router.push(`/explore?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/explore');
  };

  return (
    <div className='mb-6 flex items-center justify-end gap-4'>
      <MultiSelect
        options={tagOptions}
        value={defaultValues?.tags ?? []}
        onChange={handleTagsChange}
        placeholder={t('filterByTags')}
        className='w-[200px]'
      />

      <Select
        onValueChange={(value) => {
          const [field, order] = value.split('-');
          handleSortChange(field, order);
        }}
        defaultValue={`${defaultValues?.sortField || 'star_rating'}-${defaultValues?.sortOrder || 'desc'}`}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder={t('sortBy')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='star_rating-desc'>{t('hotDesc')}</SelectItem>
          <SelectItem value='star_rating-asc'>{t('hotAsc')}</SelectItem>
          <SelectItem value='collection_time-desc'>{t('timeDesc')}</SelectItem>
          <SelectItem value='collection_time-asc'>{t('timeAsc')}</SelectItem>
        </SelectContent>
      </Select>

      <Button variant='outline' onClick={handleReset}>
        {t('reset')}
      </Button>
    </div>
  );
}
