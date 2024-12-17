import * as React from 'react';
import { ChevronsUpDown, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export function MultiSelect({ options, value = [], onChange, className }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const t = useTranslations('Common');

  const filteredOptions = React.useMemo(() => {
    return options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [options, searchQuery]);

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <div className='flex flex-1 flex-wrap gap-1'>
            {value.length > 0 ? (
              value.map((item) => (
                <Badge key={item} variant='secondary' className='hover:bg-secondary'>
                  {options.find((option) => option.value === item)?.label}
                  <button
                    className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(item);
                    }}
                  >
                    <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                  </button>
                </Badge>
              ))
            ) : (
              <span className='text-muted-foreground'>{t('select')}</span>
            )}
          </div>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0' align='start'>
        <div className='p-2'>
          <input
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea className='h-[200px]'>
          <div className='p-2'>
            {filteredOptions.length === 0 ? (
              <div className='py-2 text-center text-sm text-muted-foreground'>{t('noResults')}</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground',
                    value.includes(option.value) && 'bg-accent',
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      'h-4 w-4 rounded-sm border',
                      value.includes(option.value) && 'flex items-center justify-center border-primary bg-primary',
                    )}
                  >
                    {value.includes(option.value) && <span className='text-[10px] text-primary-foreground'>✓</span>}
                  </div>
                  {option.label}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
