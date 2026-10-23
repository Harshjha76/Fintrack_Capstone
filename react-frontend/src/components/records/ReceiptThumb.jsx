import React, { useState } from 'react';
import { Receipt, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Lazily opens a signed URL for a privately stored receipt on click.
export default function ReceiptThumb({ uri }) {
  const [loading, setLoading] = useState(false);
  if (!uri) return null;
  const open = async () => {
    try {
      setLoading(true);
      const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: uri });
      window.open(signed_url, '_blank', 'noopener');
    } catch { /* ignore */ } finally { setLoading(false); }
  };
  return (
    <button type="button" onClick={open} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Receipt className="h-3 w-3" />}
      Receipt
    </button>
  );
}