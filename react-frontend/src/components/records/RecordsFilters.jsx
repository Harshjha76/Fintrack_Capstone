import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, INCOME_SOURCES, SITUATIONS, SORTS, monthLabel } from '@/lib/finance';

function FilterSelect({ value, onChange, all, options, labels }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11 w-full bg-card lg:w-44"><SelectValue /></SelectTrigger>
      <SelectContent>
        {all && <SelectItem value="all">{all}</SelectItem>}
        {options.map((o) => <SelectItem key={o} value={o}>{labels ? labels(o) : o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export default function RecordsFilters({ type, state, setState, months, onClear, active }) {
  const set = (k) => (v) => setState((s) => ({ ...s, [k]: v }));
  return (
    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
      <div className="relative flex-1 lg:min-w-[220px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={state.query} onChange={(e) => set('query')(e.target.value)} placeholder="Search by name, amount or date" className="h-11 bg-card pl-9 text-base md:text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:flex">
        {type === 'income' ? (
          <FilterSelect value={state.source} onChange={set('source')} all="All sources" options={INCOME_SOURCES} />
        ) : (
          <>
            <FilterSelect value={state.category} onChange={set('category')} all="All categories" options={CATEGORIES} />
            <FilterSelect value={state.situation} onChange={set('situation')} all="All situations" options={SITUATIONS} />
          </>
        )}
        <FilterSelect value={state.month} onChange={set('month')} all="All months" options={months} labels={monthLabel} />
        <FilterSelect value={state.sort} onChange={set('sort')} options={Object.keys(SORTS)} labels={(k) => SORTS[k]} />
      </div>
      {active && (
        <Button variant="ghost" onClick={onClear} className="h-11 text-muted-foreground"><X className="mr-1 h-4 w-4" />Clear</Button>
      )}
    </div>
  );
}