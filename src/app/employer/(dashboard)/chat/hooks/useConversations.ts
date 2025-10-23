import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversations, createConversation } from '../services/chatApi';
import { useRouter } from 'next/navigation';

export const useConversations = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data: conversations, isLoading, isError } = useQuery({
        queryKey: ['conversations'],
        queryFn: getConversations,
    });

    const { mutate: openConversation } = useMutation({
        mutationFn: createConversation,
        onSuccess: (newConversation) => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            router.push(`/employer/chat?open=${newConversation.id}`);
        },
    });

    return { conversations, isLoading, openConversation };
};
