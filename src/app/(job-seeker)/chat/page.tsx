"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ConversationList from "@/app/features/chat/components/ConversationList"
import MessageView from "@/app/features/chat/components/MessageView"
import { useConversations } from "@/app/features/chat/hooks/useConversations"
import type { Conversation } from "@/app/features/chat/types"
import { MessageSquare } from "lucide-react"

function ChatPageContent() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const { conversations, isLoading, markAsRead } = useConversations()
  const searchParams = useSearchParams()
  const conversationToOpen = searchParams.get("open")

  useEffect(() => {
    if (conversationToOpen && !isLoading && conversations) {
      const foundConversation = conversations.find((c) => c.id.toString() === conversationToOpen)
      if (foundConversation) {
        setActiveConversation(foundConversation)
        if (foundConversation.unread_count > 0) {
          markAsRead(foundConversation.id)
        }
      }
    }
  }, [conversationToOpen, conversations, isLoading, markAsRead])

  const handleSetActiveConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    if (conversation.unread_count > 0) {
      markAsRead(conversation.id);
    }
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col overflow-hidden bg-background border-2 rounded-md">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="w-full md:w-80 lg:w-96 border-r flex flex-col bg-card overflow-hidden">
          <ConversationList
            conversations={conversations}
            isLoading={isLoading}
            setActiveConversation={handleSetActiveConversation}
            activeConversation={activeConversation}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {activeConversation ? (
            <MessageView conversation={activeConversation} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/5">
              <MessageSquare className="h-20 w-20 text-primary/30 mb-4" strokeWidth={1.5} />
              <p className="text-lg font-semibold text-foreground">Selecciona una conversación</p>
              <p className="text-sm text-muted-foreground mt-1">Elige un chat de la lista para comenzar a conversar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <MessageSquare className="h-8 w-8 text-primary animate-pulse" />
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  )
}
