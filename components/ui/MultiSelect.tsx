'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export type GroupedOption = {
  continent: string;
  countries: string[];
};

interface MultiSelectProps {
  options: GroupedOption[];
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ options, selected, onChange, className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (country: string) => {
      if (selected.includes(country)) {
        onChange(selected.filter((item) => item !== country));
      } else {
        onChange([...selected, country]);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between h-auto min-h-10 ${selected.length > 0 ? 'h-full' : 'h-10'}`}
            onClick={() => setOpen(!open)}
          >
            <div className="flex gap-1 flex-wrap">
              {selected.length > 0 ? (
                selected.map((item) => (
                  <Badge
                    variant="secondary"
                    key={item}
                    className="mr-1 mb-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(item);
                    }}
                  >
                    {item}
                    <X className="border-2 border-muted-foreground/20 h-4 w-4 ml-1 rounded-full cursor-pointer" />
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">国を選択...</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <div className="max-h-[300px] overflow-y-auto">
            {options.map((group) => (
              <div key={group.continent}>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">{group.continent}</div>
                <div className="grid grid-cols-1 gap-1 p-1">
                  {group.countries.map((country) => {
                    const isSelected = selected.includes(country);
                    return (
                      <Button
                        key={country}
                        variant="ghost"
                        className={cn(
                          'w-full justify-start',
                          isSelected && 'bg-accent text-accent-foreground'
                        )}
                        onClick={() => handleSelect(country)}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {country}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';

export { MultiSelect };
