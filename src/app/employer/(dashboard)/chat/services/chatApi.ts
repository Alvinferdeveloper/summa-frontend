import axios from '@/lib/axios';
import { Conversation, PaginatedMessages } from '../types';
import { QueryFunctionContext } from '@tanstack/react-query';

export const getConversations = async (): Promise<Conversation[]> => {
    const { data } = await axios.get('v1/chat/conversations');
    return data.data;
};

export const getMessages = async (
    { queryKey, pageParam }: QueryFunctionContext<readonly [string, number | null], number>
): Promise<PaginatedMessages> => {
    const [_key, conversationId] = queryKey;
    const { data } = await axios.get(`v1/chat/conversations/${conversationId}/messages?page=${pageParam}&limit=20`);
    return data;
};

export const createConversation = async (participantId: number): Promise<Conversation> => {
    const { data } = await axios.post(`v1/chat/conversations/with/${participantId}`);
    return data.data;
};
