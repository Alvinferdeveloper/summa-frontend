import api from '@/lib/api';
import { Conversation, PaginatedMessages } from '@/app/features/chat/types';
import { QueryFunctionContext } from '@tanstack/react-query';

export const getConversations = async (): Promise<Conversation[]> => {
    const { data } = await api.get('v1/chat/conversations');
    return data.data;
};

export const getMessages = async (
    { queryKey, pageParam }: QueryFunctionContext
): Promise<PaginatedMessages> => {
    const [_key, conversationId] = queryKey as readonly [string, number | null];
    const page = (pageParam as number) ?? 1;
    const { data } = await api.get(`v1/chat/conversations/${conversationId}/messages?page=${page}&limit=20`);
    return data;
};

export const createConversation = async (participantId: string): Promise<Conversation> => {
    const { data } = await api.post(`v1/chat/conversations/with/${participantId}`);
    return data.data;
};

export const markConversationAsRead = async (conversationId: number): Promise<void> => {
    await api.post(`v1/chat/conversations/${conversationId}/mark-as-read`);
};
