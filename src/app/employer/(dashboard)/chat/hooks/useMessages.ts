import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { getMessages } from '../services/chatApi';
import { PaginatedMessages } from '../types';

export const useMessages = (conversationId: number | null) => {
    return useInfiniteQuery<
        PaginatedMessages,
        Error,
        InfiniteData<PaginatedMessages>,
        readonly [string, number | null],
        number
    >({
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
