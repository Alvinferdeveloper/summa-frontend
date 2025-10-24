'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ConversationList from '@/app/features/chat/components/ConversationList';
import MessageView from '@/app/features/chat/components/MessageView';
import { useConversations } from '@/app/features/chat/hooks/useConversations';
import { Conversation } from '@/app/features/chat/types';

function ChatPageContent() {
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const { conversations, isLoading } = useConversations();
    const searchParams = useSearchParams();
    const conversationToOpen = searchParams.get('open');

    useEffect(() => {
        if (conversationToOpen && !isLoading && conversations) {
            const foundConversation = conversations.find(c => c.id.toString() === conversationToOpen);
            if (foundConversation) {
                setActiveConversation(foundConversation);
            }
        }
    }, [conversationToOpen, conversations, isLoading]);

    console.log(conversations, "conversations")

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col bg-background">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 overflow-hidden">
                <div className="col-span-1 border-r h-full overflow-y-auto bg-card/50">
                    <ConversationList 
                        conversations={conversations}
                        isLoading={isLoading}
                        setActiveConversation={setActiveConversation} 
                        activeConversation={activeConversation}
                    />
                </div>
                <div className="col-span-3 flex flex-col h-full">
                    {activeConversation ? (
                        <MessageView conversation={activeConversation} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatPageContent />
        </Suspense>
    );
}
