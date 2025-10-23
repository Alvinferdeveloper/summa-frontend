'use client'

import React, { createContext, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';

interface WebSocketContextType {
    sendMessage: (message: any) => void;
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const WEBSOCKET_URL = 'ws://localhost:8080/api/v1/ws/chat';

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const webSocket = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = React.useState(false);
    const { data: session } = useSession();
    const token = session?.accessToken;
    const queryClient = useQueryClient();

    const connect = useCallback(() => {
        if (!token || webSocket.current?.readyState === WebSocket.OPEN) return;

        const ws = new WebSocket(`${WEBSOCKET_URL}?auth=${token}`);

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);
        }
        ws.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
        }
        ws.onerror = (error) => console.error('WebSocket Error:', error);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);

            queryClient.setQueryData(['messages', message.conversation_id], (oldData: any) => {
                if (!oldData) return oldData;
                const newData = { ...oldData };
                newData.pages[0].data = [message, ...newData.pages[0].data];
                return newData;
            });

            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        };

        webSocket.current = ws;
    }, [token, queryClient]);

    useEffect(() => {
        if (token) {
            connect();
        }
        return () => {
            webSocket.current?.close();
        };
    }, [token, connect]);

    const sendMessage = (messagePayload: any) => {
        if (webSocket.current?.readyState === WebSocket.OPEN) {
            webSocket.current.send(JSON.stringify(messagePayload));
            queryClient.invalidateQueries({ queryKey: ['messages', messagePayload.conversation_id] });
        } else {
            console.error('WebSocket is not connected.');
        }
    };

    return (
        <WebSocketContext.Provider value={{ sendMessage, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketContext;
