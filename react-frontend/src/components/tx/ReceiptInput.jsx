import React, { useEffect, useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Uploads a receipt photo privately and keeps a signed-URL preview in the form.
export default function ReceiptInput({ value, onChange }) {
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    if (!value) { setPreview(''); return; }
    (async () => {
      try {
        const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: value });
        if (active) setPreview(signed_url);
      } catch { if (active) setPreview(''); }
    })();
    return () => { active = false; };
  }, [value]);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setBusy(true);
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      onChange(file_uri);
    } catch { /* ignore */ } finally { setBusy(false); }
  };

  if (preview) {
    return (
      <div className="relative inline-block">
        <img src={preview} alt="Receipt" className="h-24 w-auto rounded-md border border-border object-cover" />
        <button type="button" onClick={() => onChange('')} className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground" aria-label="Remove receipt">
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }
  return (
    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground hover:bg-accent/40">
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
      {busy ? 'Uploading…' : 'Attach receipt photo'}
      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
    </label>
  );
}