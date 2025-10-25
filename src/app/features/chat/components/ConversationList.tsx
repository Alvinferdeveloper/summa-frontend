"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import type { Conversation } from "@/app/features/chat/types"

interface ConversationListProps {
  conversations: Conversation[] | undefined
  isLoading: boolean
  activeConversation: Conversation | null
  setActiveConversation: (conversation: Conversation) => void
}

export default function ConversationList({
  conversations,
  isLoading,
  setActiveConversation,
  activeConversation,
}: ConversationListProps) {
  const { data: session } = useSession()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-5 border-b bg-card">
        <h2 className="text-xl font-bold text-foreground">Mensajes</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{conversations?.length || 0} conversaciones</p>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            {conversations?.map((conv) => {
              if (!conv.user || !conv.employer) return null

              const otherParticipant = conv.user.id === session?.userId ? conv.employer : conv.user
              let otherParticipantName = ""
              let otherParticipantImage = ""
              if ("company_name" in otherParticipant) {
                otherParticipantName = otherParticipant.company_name
                otherParticipantImage = otherParticipant.logo_url
              } else {
                otherParticipantName = otherParticipant.first_name
                otherParticipantImage = otherParticipant.profile_picture_url
              }

              const isActive = activeConversation?.id === conv.id

              return (
                <div
                  key={conv.id}
                  className={cn(
                    "relative p-4 flex items-center gap-3 cursor-pointer border-b transition-all duration-200 rounded-lg mb-1",
                    "hover:bg-muted/50 active:scale-[0.98]",
                    isActive && "bg-primary/5 border-l-4 border-l-primary",
                  )}
                  onClick={() => setActiveConversation(conv)}
                >
                  <div className="relative">
                    <Avatar
                      className={cn(
                        "h-12 w-12 ring-2 transition-all duration-200",
                        isActive ? "ring-primary/30" : "ring-transparent",
                      )}
                    >
                      <AvatarImage src={otherParticipantImage} alt={otherParticipantName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {otherParticipantName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-background" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-semibold truncate text-sm transition-colors duration-200",
                        isActive ? "text-primary" : "text-foreground",
                      )}
                    >
                      {otherParticipantName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">Toca para abrir el chat</p>
                  </div>

                  {isActive && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
