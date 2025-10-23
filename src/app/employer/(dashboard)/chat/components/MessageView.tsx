'use client'

import { useEffect, useRef, useState } from 'react';
import { useMessages } from '../hooks/useMessages';
import { useWebSocket } from '../hooks/useWebSocket';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation, NewMessagePayload } from '../types';

interface MessageViewProps {
    conversation: Conversation;
}

export default function MessageView({ conversation }: MessageViewProps) {
    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useMessages(conversation.id);
    const { sendMessage } = useWebSocket();
    const { data: session } = useSession();
    const user = (session as any)?.user;
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const allMessages = data?.pages.flatMap(page => page.data).reverse() || [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [allMessages.length]);

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const otherParticipant = conversation.user.id === user.id ? conversation.employer : conversation.user;
        const recipientType = user.role === 'job_seeker' ? 'employer' : 'user';

        const messagePayload: NewMessagePayload = {
            conversation_id: conversation.id,
            recipient_id: otherParticipant.id,
            recipient_type: recipientType,
            content: newMessage,
        };

        sendMessage(messagePayload);

        setNewMessage('');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    const otherParticipant = conversation.user.id === user?.id ? conversation.employer : conversation.user;
    let otherParticipantName = '';
    if ("company_name" in otherParticipant) {
        otherParticipantName = otherParticipant.company_name;
    } else {
        otherParticipantName = `${otherParticipant.first_name} ${otherParticipant.last_name}`;
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-card">
            <div className="p-4 border-b">
                <h3 className="font-bold text-lg">{otherParticipantName}</h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {hasNextPage && (
                    <div className="text-center mb-4">
                        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                            {isFetchingNextPage ? 'Loading...' : 'Load More'}
                        </Button>
                    </div>
                )}
                {allMessages.map((msg, index) => (
                    <div
                        key={msg.id || index}
                        className={cn(
                            'flex items-end gap-2 my-2',
                            msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        )}
                    >
                        <div
                            className={cn(
                                'p-3 rounded-lg max-w-md shadow-sm',
                                msg.sender_id === user?.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                            )}
                        >
                            <p className="text-sm">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
