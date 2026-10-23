import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['notification', user?.id],
    enabled: !!user,
    queryFn: () => base44.entities.Notification.filter({ created_by_id: user.id }, '-created_date', 100),
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, read }) => base44.entities.Notification.update(id, { read }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notification'] }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids) => base44.entities.Notification.bulkUpdate(ids.map((id) => ({ id, read: true }))),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notification'] }),
  });
}

export function useClearNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids) => base44.entities.Notification.deleteMany({ id: { $in: ids } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notification'] }),
  });
}