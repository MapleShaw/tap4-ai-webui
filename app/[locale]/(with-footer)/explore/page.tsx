import { RevalidateOneHour } from '@/lib/constants';

import ExploreList from './ExploreList';

export const revalidate = RevalidateOneHour * 6;

export default function Page({ searchParams }: { searchParams?: { [key: string]: string } }) {
  return <ExploreList searchParams={searchParams} />;
}
