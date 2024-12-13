import Link from 'next/link';

export function TagItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      className='flex h-[42px] items-center justify-center gap-[2px] whitespace-nowrap rounded-full
    border border-gray-700/50 bg-[#2C2D36] px-4 text-sm font-medium
    transition-colors hover:bg-[#3A3B45]'
    >
      {children}
    </div>
  );
}

export function TagLink({ name, href }: { name: string; href: string }) {
  return (
    <Link href={href} title={name}>
      <TagItem>{name}</TagItem>
    </Link>
  );
}

export function TagList({ data }: { data: { name: string; href: string; id: string }[] }) {
  return (
    <ul className='no-scrollbar flex max-w-full flex-1 items-center gap-3 overflow-auto'>
      {data.map((item) => (
        <li key={item.href}>
          <TagLink name={item.name} href={item.href} />
        </li>
      ))}
    </ul>
  );
}
