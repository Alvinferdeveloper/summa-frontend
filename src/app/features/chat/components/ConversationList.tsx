'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Conversation } from '@/app/features/chat/types';

interface ConversationListProps {
    conversations: Conversation[] | undefined;
    isLoading: boolean;
    activeConversation: Conversation | null;
    setActiveConversation: (conversation: Conversation) => void;
}

export default function ConversationList({ conversations, isLoading, setActiveConversation, activeConversation }: ConversationListProps) {
    const { data: session } = useSession();

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    return (
        <div className="h-[calc(100vh-120px)]">
            <h2 className="p-4 text-xl font-bold border-b">Chats</h2>
            {conversations?.map((conv) => {
                if (!conv.user || !conv.employer) return null;

                const otherParticipant = conv.user.id === session?.userId ? conv.employer : conv.user;
                let otherParticipantName = '';
                let otherParticipantImage = '';
                if ("company_name" in otherParticipant) {
                    otherParticipantName = otherParticipant.company_name;
                    otherParticipantImage = otherParticipant.logo_url;
                } else {
                    otherParticipantName = otherParticipant.first_name;
                    otherParticipantImage = otherParticipant.profile_picture_url;
                }

                return (
                    <div
                        key={conv.id}
                        className={cn(
                            'p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 border-b',
                            activeConversation?.id === conv.id && 'bg-muted'
                        )}
                        onClick={() => setActiveConversation(conv)}
                    >
                        <Avatar>
                            <AvatarImage src={otherParticipantImage} alt={otherParticipantName} />
                            <AvatarFallback>{otherParticipantName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold truncate">{otherParticipantName}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
