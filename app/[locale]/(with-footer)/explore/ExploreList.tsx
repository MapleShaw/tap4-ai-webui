import { createClient } from '@/db/supabase/client';

import type { ExploreParams } from '@/types/explore';
import SearchForm from '@/components/home/SearchForm';
import BasePagination from '@/components/page/BasePagination';
import WebNavCardList from '@/components/webNav/WebNavCardList';

import FilterSort from './FilterSort';

const WEB_PAGE_SIZE = 12;

export default async function ExploreList({
  pageNum,
  searchParams,
}: {
  pageNum?: string;
  searchParams?: { [key: string]: string };
}) {
  const supabase = createClient();
  const currentPage = pageNum ? Number(pageNum) : 1;
  const start = (currentPage - 1) * WEB_PAGE_SIZE;
  const end = start + WEB_PAGE_SIZE - 1;

  // 解析过滤和排序参数
  const params: ExploreParams = {
    tags: searchParams?.tags?.split(','),
    sortField: (searchParams?.sortField || 'star_rating') as 'star_rating' | 'collection_time',
    sortOrder: (searchParams?.sortOrder || 'desc') as 'asc' | 'desc',
  };

  // 构建查询
  let query = supabase.from('web_navigation').select('*', { count: 'exact' });

  // 添加标签过滤
  if (params.tags?.length) {
    query = query.in('tag_name', params.tags);
  }
  // 添加排序
  query = query.order(params.sortField || 'star_rating', { ascending: params.sortOrder === 'asc' });

  // 添加分页
  query = query.range(start, end);

  // 获取唯一标签列表
  const [{ data: navigationList, count }, { data: tagList }] = await Promise.all([
    query,
    supabase.from('web_navigation').select('tag_name'),
  ]);

  const tagOptions = Array.from(new Set(tagList?.map((item) => item.tag_name)))
    .filter(Boolean) // 过滤掉 null/undefined
    .map((tag_name) => ({
      value: tag_name,
      label: tag_name,
    }));

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-center'>
        <SearchForm />
      </div>
      <div className='mt-8 w-full'>
        <FilterSort tagOptions={tagOptions} defaultValues={params} />
      </div>
      <WebNavCardList dataList={navigationList!} />
      <div className='flex justify-end'>
        <BasePagination
          currentPage={currentPage}
          pageSize={WEB_PAGE_SIZE}
          total={count!}
          route='/explore'
          subRoute='/page'
          className='my-5 lg:my-10'
          searchParamsKeys={['tags', 'sortField', 'sortOrder']}
        />
      </div>
    </div>
  );
}
