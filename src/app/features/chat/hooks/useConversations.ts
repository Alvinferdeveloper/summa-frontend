import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversations, createConversation } from '@/app/features/chat/services/chatApi';
import { useRouter } from 'next/navigation';
import { Conversation } from '@/app/features/chat/types';

export const useConversations = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data: conversations, isLoading } = useQuery<Conversation[], Error>({
        queryKey: ['conversations'],
        queryFn: getConversations,
    });

    const { mutate: openConversation } = useMutation<Conversation, Error, number>({
        mutationFn: createConversation,
        onSuccess: (newConversation) => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            router.push(`/employer/chat?open=${newConversation.id}`);
        },
    });

    return { conversations, isLoading, openConversation };
};
