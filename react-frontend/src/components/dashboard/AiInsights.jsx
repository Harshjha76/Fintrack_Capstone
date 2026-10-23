import React from 'react';
import { Sparkles, Loader2, AlertTriangle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Panel from '@/components/common/Panel';
import { useInsights } from '@/hooks/useInsights';

export default function AiInsights({ income, expenses }) {
  const insight = useInsights();
  const data = insight.data;

  return (
    <Panel title="AI spending insights" subtitle="A smart read on your week" action={<Sparkles className="h-4 w-4 text-primary" />}>
      {!data ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Generate a quick smart summary that flags unusual spending, predicts a possible shortfall, and suggests student-friendly savings tips.
          </p>
          <Button onClick={() => insight.mutate({ income, expenses })} disabled={insight.isPending} className="h-10">
            {insight.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {insight.isPending ? 'Analyzing…' : 'Generate insights'}
          </Button>
          {insight.isError && <p className="text-sm text-destructive">Could not generate insights. Try again.</p>}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm">{data.summary}</p>
          {data.flags?.length > 0 && (
            <div className="space-y-2">
              {data.flags.map((f, i) => (
                <div key={i} className="flex gap-2 rounded-md border border-border bg-background p-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <div className="text-sm"><span className="font-medium">{f.title}</span> <span className="text-muted-foreground">— {f.detail}</span></div>
                </div>
              ))}
            </div>
          )}
          {data.prediction && (
            <p className="text-sm"><span className="font-medium">Next month: </span><span className="text-muted-foreground">{data.prediction}</span></p>
          )}
          {data.suggestions?.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm font-medium"><Lightbulb className="h-4 w-4 text-primary" /> Suggestions</div>
              <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
                {data.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => insight.mutate({ income, expenses })} disabled={insight.isPending} className="h-9">
            {insight.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Refresh
          </Button>
        </div>
      )}
    </Panel>
  );
}