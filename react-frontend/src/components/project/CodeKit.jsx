import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Panel from '@/components/common/Panel';
import { CODE_FILES } from '@/lib/codeKit';

export default function CodeKit() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const file = CODE_FILES[active];

  const copy = async () => {
    await navigator.clipboard.writeText(file.content);
    setCopied(true);
    toast.success(`${file.name} copied`);
    setTimeout(() => setCopied(false), 1500);
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([file.content], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url; a.download = file.name; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Panel title="Flask + MySQL Code Kit" subtitle="Complete runnable backend. Put all files in one folder and follow README.md.">
      <div className="no-scrollbar -mx-1 mb-3 flex gap-2 overflow-x-auto px-1">
        {CODE_FILES.map((f, i) => (
          <button key={f.name} onClick={() => setActive(i)} className={cn('h-10 shrink-0 rounded-lg border px-3 font-mono text-xs transition-colors', i === active ? 'border-primary bg-primary/15 text-foreground' : 'border-border text-muted-foreground hover:text-foreground')}>
            {f.name}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
          <span className="truncate text-xs text-muted-foreground">{file.desc}</span>
          <div className="flex shrink-0 gap-1">
            <Button size="sm" variant="ghost" onClick={copy} className="h-9">{copied ? <Check className="mr-1 h-4 w-4 text-success" /> : <Copy className="mr-1 h-4 w-4" />}Copy</Button>
            <Button size="sm" variant="ghost" onClick={download} className="h-9"><Download className="mr-1 h-4 w-4" />Download</Button>
          </div>
        </div>
        <pre className="max-h-[560px] overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground/90">{file.content}</pre>
      </div>
    </Panel>
  );
}