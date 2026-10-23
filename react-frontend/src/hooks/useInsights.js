import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { sumAmounts, groupSum, monthlySeries, formatINR } from '@/lib/finance';

const SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    flags: {
      type: 'array',
      items: {
        type: 'object',
        properties: { title: { type: 'string' }, detail: { type: 'string' } },
        required: ['title', 'detail'],
      },
    },
    prediction: { type: 'string' },
    suggestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'flags', 'prediction', 'suggestions'],
};

// Builds a compact summary of the student's money and asks the LLM for a
// short weekly insight: unusual spending, a next-month call, and tips.
export function useInsights() {
  return useMutation({
    mutationFn: async ({ income, expenses }) => {
      const ti = sumAmounts(income);
      const te = sumAmounts(expenses);
      const byCat = groupSum(expenses, 'category').slice(0, 5).map((c) => `${c.name}: ${formatINR(c.value)}`);
      const bySit = groupSum(expenses, 'situation').map((s) => `${s.name}: ${formatINR(s.value)}`);
      const trend = monthlySeries(income, expenses, 3).map((m) => `${m.label} in ${formatINR(m.income)}, out ${formatINR(m.expense)}`);

      const prompt = `You are a student finance assistant for an Indian college student (all amounts in INR).
Overall income ${formatINR(ti)}; expenses ${formatINR(te)}; balance ${formatINR(ti - te)}.
Top expense categories: ${byCat.join(', ') || 'none'}.
Spend by situation (Necessary/Casual/Emergency/Entertainment/Time Pass/Other): ${bySit.join(', ') || 'none'}.
Recent months: ${trend.join(' | ') || 'none'}.

Write a short, friendly weekly insight for the student. Flag any unusual spending, predict whether next month may fall short, and give 3 practical savings tips suited to a college student. Be specific and concise.`;

      const res = await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: SCHEMA });
      return res;
    },
  });
}