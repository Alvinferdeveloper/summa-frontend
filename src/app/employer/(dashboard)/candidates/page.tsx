"use client"

import { useState, useEffect } from "react"
import { useTalentPool } from "./hooks/useTalentPool"
import { useDisabilityTypes } from "@/app/(job-seeker)/jobs/hooks/useDisabilityTypes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination"
import { Loader2, Search, Users, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import CandidateCard from "./components/CandidateCard"
import { useSkills } from "./hooks/useSkills"

const CANDIDATES_PER_PAGE = 12

export default function TalentPoolPage() {
  const [filters, setFilters] = useState<Record<string, string>>({
    country: "",
    disability_type_id: "",
    skill_id: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  const { data: disabilityTypes = [] } = useDisabilityTypes()
  const { data: skills = [] } = useSkills()
  const { data: talentPoolData, isLoading, isError } = useTalentPool(
    currentPage,
    CANDIDATES_PER_PAGE,
    { ...filters, country: debouncedSearchTerm }
  )

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  const candidates = talentPoolData?.data || []
  const totalCandidates = talentPoolData?.total || 0
  const totalPages = Math.ceil(totalCandidates / CANDIDATES_PER_PAGE)

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilters({
      country: "",
      disability_type_id: "",
      skill_id: "",
    })
    setSearchTerm("")
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== "") || searchTerm !== ""

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card/50 max-w-7xl rounded-sm shadow-lg mx-auto backdrop-blur-sm bg-gradient-to-br from-primary/90 via-primary/70 to-primary border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-accent">Buscador de Talentos</h1>
              </div>
              <p className="text-secondary text-pretty leading-relaxed">
                Explora perfiles de candidatos talentosos que se ajustan a tus necesidades y conecta con el mejor
                talento.
              </p>
            </div>
            {totalCandidates > 0 && (
              <Badge className="text-sm px-3 py-1.5 hidden md:flex bg-accent">
                {totalCandidates} {totalCandidates === 1 ? "candidato" : "candidatos"}
              </Badge>
            )}
          </div>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-secondary">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros:</span>
            </div>
            <div className="flex flex-wrap gap-3 flex-1">
              <div className="relative w-full sm:w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por país..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 placeholder:text-black"
                />
              </div>
              <Select
                onValueChange={(value) => handleFilterChange("disability_type_id", value)}
                value={filters.disability_type_id || ""}
              >
                <SelectTrigger className="w-full sm:w-[260px] [&[data-placeholder]]:text-black">
                  <SelectValue placeholder="Tipo de Discapacidad" />
                </SelectTrigger>
                <SelectContent>
                  {disabilityTypes.map((dt) => (
                    <SelectItem key={dt.id} value={dt.id.toString()}>
                      {dt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => handleFilterChange("skill_id", value)}
                value={filters.skill_id || ""}
              >
                <SelectTrigger className="w-full sm:w-[260px] [&[data-placeholder]]:text-black">
                  <SelectValue placeholder="Habilidades" />
                </SelectTrigger>
                <SelectContent>
                  {skills.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-2">
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Results Count - Mobile */}
        {totalCandidates > 0 && (
          <div className="md:hidden mb-4">
            <Badge variant="secondary" className="text-sm px-3 py-1.5 bg-[#34CC2D]">
              {totalCandidates} {totalCandidates === 1 ? "candidato" : "candidatos"}
            </Badge>
          </div>
        )}

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full flex flex-col justify-center items-center h-64 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Cargando candidatos...</p>
            </div>
          ) : isError ? (
            <div className="col-span-full flex flex-col justify-center items-center h-64 gap-4">
              <div className="p-4 rounded-full bg-destructive/10">
                <X className="h-8 w-8 text-destructive" />
              </div>
              <div className="text-center">
                <p className="font-medium text-destructive mb-1">Error al cargar los candidatos</p>
                <p className="text-sm text-muted-foreground">Por favor, intenta de nuevo más tarde.</p>
              </div>
            </div>
          ) : candidates.length > 0 ? (
            candidates.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />)
          ) : (
            <div className="col-span-full flex flex-col justify-center items-center h-64 gap-4">
              <div className="p-4 rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-medium mb-1">No se encontraron candidatos</p>
                <p className="text-sm text-muted-foreground">
                  {hasActiveFilters
                    ? "Intenta ajustar tus filtros para ver más resultados."
                    : "No hay candidatos disponibles en este momento."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(i + 1)
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
