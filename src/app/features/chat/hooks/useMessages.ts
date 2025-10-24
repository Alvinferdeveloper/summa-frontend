import { useInfiniteQuery } from '@tanstack/react-query';
import { getMessages } from '@/app/features/chat/services/chatApi';
import { PaginatedMessages } from '@/app/features/chat/types';

export const useMessages = (conversationId: number | null) => {
    return useInfiniteQuery<PaginatedMessages, Error>({
        queryKey: ['messages', conversationId] as const,
        queryFn: getMessages,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < Math.ceil(lastPage.total / lastPage.limit)) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!conversationId,
    });
};
