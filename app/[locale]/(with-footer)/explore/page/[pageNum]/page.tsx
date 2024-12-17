import { RevalidateOneHour } from '@/lib/constants';

import ExploreList from '../../ExploreList';

export const revalidate = RevalidateOneHour * 6;

export default function Page({
  params: { pageNum },
  searchParams,
}: {
  params: { pageNum: string };
  searchParams?: { [key: string]: string };
}) {
  return <ExploreList pageNum={pageNum} searchParams={searchParams} />;
}
