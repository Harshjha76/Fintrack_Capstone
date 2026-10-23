import React, { useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { useTxDialog } from '@/components/tx/TxDialogContext';
import TxSummary from './TxSummary';

const OPEN_X = -112;

export default function SwipeRow({ tx }) {
  const { openEdit, confirmDelete } = useTxDialog();
  const controls = useAnimationControls();
  const [open, setOpen] = useState(false);

  const snap = (next) => {
    setOpen(next);
    controls.start({ x: next ? OPEN_X : 0, transition: { type: 'spring', stiffness: 420, damping: 36 } });
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      <div className="absolute inset-y-0 right-0 flex">
        <button onClick={() => { snap(false); openEdit(tx.type, tx); }} aria-label="Edit" className="flex w-14 items-center justify-center bg-primary/20 text-primary">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={() => { snap(false); confirmDelete(tx.type, tx); }} aria-label="Delete" className="flex w-14 items-center justify-center bg-destructive/20 text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: OPEN_X, right: 0 }}
        dragElastic={0.05}
        animate={controls}
        onDragEnd={(_, info) => snap(open ? info.offset.x < 40 : info.offset.x < -40)}
        className="relative flex items-center bg-card px-4 py-3"
      >
        <TxSummary tx={tx} />
      </motion.div>
    </div>
  );
}