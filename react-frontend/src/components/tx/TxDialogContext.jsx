import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import TransactionDialog from './TransactionDialog';
import DeleteConfirm from './DeleteConfirm';

const Ctx = createContext(null);

export function TxDialogProvider({ children }) {
  const [state, setState] = useState({ open: false, type: 'expense', record: null, key: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openNew = useCallback((type = 'expense') => setState((s) => ({ open: true, type, record: null, key: s.key + 1 })), []);
  const openEdit = useCallback((type, record) => setState((s) => ({ open: true, type, record, key: s.key + 1 })), []);
  const confirmDelete = useCallback((type, record) => setDeleteTarget({ type, record }), []);
  const value = useMemo(() => ({ openNew, openEdit, confirmDelete }), [openNew, openEdit, confirmDelete]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <TransactionDialog
        key={state.key}
        open={state.open}
        onOpenChange={(open) => setState((s) => ({ ...s, open }))}
        type={state.type}
        record={state.record}
      />
      <DeleteConfirm target={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </Ctx.Provider>
  );
}

export const useTxDialog = () => useContext(Ctx);