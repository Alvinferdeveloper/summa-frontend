"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useMessages } from "@/app/features/chat/hooks/useMessages"
import { useWebSocket } from "@/app/features/chat/hooks/useWebSocket"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Loader2, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Conversation, NewMessagePayload } from "@/app/features/chat/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MessageViewProps {
  conversation: Conversation
  onBack?: () => void;
}

export default function MessageView({ conversation, onBack }: MessageViewProps) {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useMessages(conversation.id)
  const { sendMessage } = useWebSocket()
  const { data: session } = useSession()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const allMessages = data?.pages.flatMap((page) => page.data).reverse() || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 10)
    return () => clearTimeout(timer)
  }, [data])

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newMessage.trim() || !session?.user) return

    const otherParticipant = conversation.user.id === session?.userId ? conversation.employer : conversation.user
    const recipientType = session.role === "job_seeker" ? "employer" : "user"

    const messagePayload: NewMessagePayload = {
      conversation_id: conversation.id,
      recipient_id: otherParticipant.id,
      recipient_type: recipientType,
      content: newMessage,
    }

    sendMessage(messagePayload)

    setNewMessage("")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full bg-muted/5">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  const otherParticipant = conversation.user.id === session?.userId ? conversation.employer : conversation.user
  let otherParticipantName = ""
  let otherParticipantImage = ""
  if ("company_name" in otherParticipant) {
    otherParticipantName = otherParticipant.company_name
    otherParticipantImage = otherParticipant.logo_url
  } else {
    otherParticipantName = `${otherParticipant.first_name} ${otherParticipant.last_name}`
    otherParticipantImage = otherParticipant.profile_picture_url
  }

  const sessionId = session?.role === "job_seeker" ? session?.userId : session?.employerId

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b bg-card shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button onClick={onBack} variant="ghost" size="icon" className="md:hidden mr-2">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            )}
            <div className="relative">
              <Avatar className="h-11 w-11 ring-2 ring-primary/10">
                <AvatarImage src={otherParticipantImage} alt={otherParticipantName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {otherParticipantName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-card" />
            </div>
            <div>
              <h3 className="font-semibold text-base">{otherParticipantName}</h3>
              <span className="text-xs text-emerald-600 font-medium">En línea</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <div
          className="absolute inset-0 bg-[url('/chat_background.png')] bg-no-repeat bg-center bg-contain opacity-90"
          style={{
            backgroundSize: onBack ? "230%" : "100%",
          }}
        ></div>
        <div className="absolute inset-0 bg-white/30 pointer-events-none"></div>
        <ScrollArea className="h-full absolute">
          <div
            className=" top-5"
          >
            {hasNextPage && (
              <div className="text-center mt-2">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  size="sm"
                  className="rounded-full cursor-pointer"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    "Cargar más mensajes"
                  )}
                </Button>
              </div>
            )}

            {allMessages.map((msg, index) => {
              const isOwn = msg.sender_id === sessionId

              return (
                <div
                  key={msg.id || index}
                  className={cn(
                    "flex items-end gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                    isOwn ? "justify-end slide-in-from-right-4" : "justify-start slide-in-from-left-4 pl-3",
                  )}
                  style={{ animationDelay: `${index < allMessages.length - 1 ? index * 30 : 1}ms` }}
                >
                  {!isOwn && (
                    <Avatar className="h-8 w-8 mb-0.5 ring-2 ring-background shadow-sm">
                      <AvatarImage src={otherParticipantImage} alt={otherParticipantName} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                        {otherParticipantName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className="flex flex-col gap-1 max-w-[75%] sm:max-w-md">
                    <div
                      className={cn(
                        "px-4 py-2.5 rounded-2xl shadow-md transition-all duration-200",
                        "hover:shadow-lg hover:scale-[1.02]",
                        isOwn
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-card border border-border/50 rounded-bl-sm",
                      )}
                    >
                      <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    <div className={cn("flex items-center gap-1.5 px-2", isOwn ? "justify-end" : "justify-start")}>
                      <span className="text-[11px] text-black font-medium">
                        {new Date(msg.created_at).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {isOwn && (
                        <svg
                          className="w-3.5 h-3.5 text-muted-foreground/60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {isOwn && <div className="w-8" />}
                </div>
              )
            })}
          </div>
          <div className="flex-shrink-0 p-4 sticky bottom-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                autoComplete="off"
                className="flex-1 h-12 rounded-full bg-white border-2 border-black focus-visible:ring-1 focus-visible:ring-primary/20"
              />

              <Button
                type="submit"
                size="icon"
                disabled={!newMessage.trim()}
                className="rounded-full h-12 w-12 shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
    </div>
  )
}
