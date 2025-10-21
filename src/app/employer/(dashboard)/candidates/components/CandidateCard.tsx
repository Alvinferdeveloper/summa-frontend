"use client"

import type { Candidate } from "../hooks/useTalentPool"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, FileText, Linkedin, Phone, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface CandidateCardProps {
  candidate: Candidate
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`candidates/${candidate.id}`)
  }

  return (
    <div onClick={handleCardClick} className="block cursor-pointer">
      <Card className="overflow-hidden flex flex-col h-[460px] hover:shadow-lg transition-shadow duration-300 border-border/50">
        <CardHeader className="p-0 relative flex-shrink-0">
          {/* Banner Background */}
          <div className="h-24 bg-gradient-to-br from-primary/20 via-primary/5 to-background relative overflow-hidden">
            {candidate.banner_url ? (
              <img
                src={candidate.banner_url || "/placeholder.svg"}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
            )}
          </div>

          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-4">
            <div className="w-24 h-24 rounded-full border-4 border-background bg-muted overflow-hidden shadow-md">
              {candidate.profile_picture_url ? (
                <img
                  src={candidate.profile_picture_url || "/placeholder.svg"}
                  alt={`${candidate.first_name} ${candidate.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <User className="h-10 w-10 text-primary/40" />
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-14 px-4 pb-4 flex-1 min-h-0 space-y-3 overflow-hidden">
          {/* Name and Location */}
          <div>
            <h3 className="font-bold text-lg leading-tight mb-1 truncate">
              {candidate.first_name} {candidate.last_name}
            </h3>
            {(candidate.city || candidate.country) && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{[candidate.city, candidate.country].filter(Boolean).join(", ")}</span>
              </p>
            )}
          </div>

          {/* Description */}
          {candidate.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{candidate.description}</p>
          )}

          {/* Contact Info */}
          <div className="flex flex-wrap gap-2 pt-1">
            {candidate.linked_in && (
              <a
                href={candidate.linked_in}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
            {candidate.phone_number && (
              <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span className="truncate max-w-[120px]">{candidate.phone_number}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 gap-2 flex-shrink-0">
          {candidate.resume_url ? (
            <a
              href={candidate.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="default" className="w-full cursor-pointer" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Ver CV
              </Button>
            </a>
          ) : (
            <Button variant="outline" className="flex-1 bg-transparent border-2 border-black/20" size="sm" disabled>
              <FileText className="h-4 w-4 mr-2" />
              Sin CV
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
