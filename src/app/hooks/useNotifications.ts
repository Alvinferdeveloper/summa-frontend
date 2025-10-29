'use client';

import { useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useWebSocket } from '@/app/features/chat/hooks/useWebSocket'; 

export interface Notification {
  id: number;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}


const fetchNotifications = async (): Promise<Notification[]> => {
  const { data } = await api.get('/v1/notifications');
  return data;
};

const markAsRead = async (ids: number[]) => {
  await api.post('/v1/notifications/mark-as-read', { ids });
};

export const useNotifications = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { subscribe } = useWebSocket(); 

  const { data: notifications = [], ...queryInfo } = useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: !!session, 
  });

  const markAsReadMutation = useMutation<void, Error, number[]>({ 
    mutationFn: markAsRead, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  useEffect(() => {
    if (!session) return;

    const unsubscribe = subscribe('notification', (newNotification: Notification) => {
      queryClient.setQueryData<Notification[]>(['notifications'], (oldData = []) => [
        newNotification,
        ...oldData,
      ]);
      toast.info(newNotification.message);
    });

    return () => {
      unsubscribe();
    };
  }, [session, queryClient, subscribe]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllAsRead = useCallback(() => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length > 0) {
      markAsReadMutation.mutate(unreadIds);
    }
  }, [notifications, markAsReadMutation]);

  return { notifications, unreadCount, markAllAsRead, ...queryInfo };
};