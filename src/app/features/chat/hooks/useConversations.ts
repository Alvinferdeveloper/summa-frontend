import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversations, createConversation, markConversationAsRead } from '@/app/features/chat/services/chatApi';
import { useRouter } from 'next/navigation';
import { Conversation } from '@/app/features/chat/types';

export const useConversations = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data: conversations, isLoading } = useQuery<Conversation[], Error>({
        queryKey: ['conversations'],
        queryFn: getConversations,
    });

    const { mutate: openConversation } = useMutation<Conversation, Error, string>({
        mutationFn: createConversation,
        onSuccess: (newConversation) => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            router.push(`/employer/chat?open=${newConversation.id}`);
        },
    });

    const { mutate: markAsRead } = useMutation<void, Error, number>({
        mutationFn: markConversationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });

    const totalUnreadCount = conversations?.reduce((sum, conv) => sum + (conv.unread_count || 0), 0) || 0;

    return { conversations, isLoading, openConversation, markAsRead, totalUnreadCount };
};
