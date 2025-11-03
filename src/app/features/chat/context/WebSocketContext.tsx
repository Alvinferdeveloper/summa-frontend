'use client'

import React, { createContext, useEffect, useRef, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { Message, NewMessagePayload, PaginatedMessages } from '@/app/features/chat/types';
import { toast } from 'sonner';
import { Notification } from '@/app/hooks/useNotifications';

interface WebSocketMessage {
    type: 'chat' | 'notification';
    payload: any;
}

interface WebSocketContextType {
    sendMessage: (message: NewMessagePayload) => void;
    isConnected: boolean;
    subscribe: (type: WebSocketMessage['type'], callback: (payload: any) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_API_URL + '/v1/ws/chat' || 'ws://localhost:8080/api/v1/ws/chat';

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const webSocket = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;
    const queryClient = useQueryClient();

    // Map to store listeners for each type of message
    const listeners = useRef<Map<WebSocketMessage['type'], Set<(payload: any) => void>>>(new Map());

    const subscribe = useCallback((type: WebSocketMessage['type'], callback: (payload: any) => void) => {
        if (!listeners.current.has(type)) {
            listeners.current.set(type, new Set());
        }
        listeners.current.get(type)?.add(callback);

        return () => {
            listeners.current.get(type)?.delete(callback);
            if (listeners.current.get(type)?.size === 0) {
                listeners.current.delete(type);
            }
        };
    }, []);

    const connect = useCallback(() => {
        if (!token || webSocket.current?.readyState === WebSocket.OPEN) return;

        const ws = new WebSocket(`${WEBSOCKET_URL}?auth=${token}`);

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);
        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
            // Try to reconnect after a delay
            setTimeout(connect, 3000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setIsConnected(false);
            ws.close(); // Close to force reconnection
        };

        ws.onmessage = (event) => {
            try {
                const parsedMessage: WebSocketMessage = JSON.parse(event.data);

                // Dispatch to listeners for the message type
                listeners.current.get(parsedMessage.type)?.forEach(callback => {
                    callback(parsedMessage.payload);
                });

                // Specific logic for chat (if needed to keep it here or move it to the chat hook)
                if (parsedMessage.type === 'chat') {
                    const message: Message = parsedMessage.payload;
                    queryClient.setQueryData(['messages', message.conversation_id], (oldData: InfiniteData<PaginatedMessages> | undefined) => {
                        if (!oldData) return oldData;
                        const newData = { ...oldData };
                        const newPages = [...newData.pages];
                        const firstPage = { ...newPages[0] };
                        firstPage.data = [message, ...firstPage.data];
                        newPages[0] = firstPage;
                        newData.pages = newPages;
                        return newData;
                    });
                    queryClient.invalidateQueries({ queryKey: ['conversations'] });
                } else if (parsedMessage.type === 'notification') {
                    const notification: Notification = parsedMessage.payload;
                    toast.info(notification.message);
                }

            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        webSocket.current = ws;
    }, [token, queryClient, subscribe]);

    useEffect(() => {
        if (token) {
            connect();
        }
        return () => {
            webSocket.current?.close();
        };
    }, [token, connect]);

    const sendMessage = (messagePayload: NewMessagePayload) => {
        if (webSocket.current?.readyState === WebSocket.OPEN) {
            console.log(messagePayload, "messagePayload")
            webSocket.current.send(JSON.stringify({ type: 'chat', payload: messagePayload }));
            queryClient.invalidateQueries({ queryKey: ['messages', messagePayload.conversation_id] });
        } else {
            console.error('WebSocket is not connected.');
            toast.error('No se pudo enviar el mensaje. WebSocket no conectado.');
        }
    };

    const value = { sendMessage, isConnected, subscribe };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketContext;