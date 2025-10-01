"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useDisabilityTypes } from "@/app/(job-seeker)/profile/hooks/useDisabilityTypes"
import { useCompleteOnboarding } from "@/app/(job-seeker)/profile/hooks/useCompleteOnboarding"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, Sparkles, User } from "lucide-react"

export default function OnboardingForm() {
  const { update } = useSession()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<Set<number>>(new Set())
  const [formError, setFormError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const { data: disabilityTypes, isLoading: isLoadingTypes, error: typesError } = useDisabilityTypes()
  const { mutate: completeOnboarding, isPending, error: mutationError } = useCompleteOnboarding()

  const handleTypeChange = (typeId: number) => {
    const newSelection = new Set(selectedTypes)
    if (newSelection.has(typeId)) {
      newSelection.delete(typeId)
    } else {
      newSelection.add(typeId)
    }
    setSelectedTypes(newSelection)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName || !lastName || selectedTypes.size === 0) {
      setFormError("Todos los campos son requeridos.")
      return
    }
    setFormError(null)

    completeOnboarding(
      {
        first_name: firstName,
        last_name: lastName,
        disability_type_ids: Array.from(selectedTypes),
      },
      {
        onSuccess: () => {
          setShowSuccess(true)
          setTimeout(() => {
            update({ onboardingCompleted: true })
          }, 2500)
        },
      },
    )
  }

  if (isLoadingTypes) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Cargando formulario...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto" title="any">
        {!showSuccess ? (
          <>
            <DialogHeader className="space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <DialogTitle className="text-center text-2xl font-semibold">Completa tu perfil</DialogTitle>
              <DialogDescription className="text-center text-base">
                Ayúdanos a conocerte mejor para brindarte una experiencia personalizada
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    Nombre
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Ingresa tu nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Apellido
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Ingresa tu apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Tipo de discapacidad
                    <span className="ml-1 text-xs text-muted-foreground font-normal">
                      (Selecciona todas las que apliquen)
                    </span>
                  </Label>

                  {typesError && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      No se pudieron cargar las opciones. Por favor, intenta nuevamente.
                    </div>
                  )}

                  <div className="space-y-3 rounded-lg border bg-muted/30 p-4 max-h-[200px] overflow-y-auto">
                    {disabilityTypes?.map((type) => (
                      <div key={type.ID} className="flex items-center space-x-3">
                        <Checkbox
                          id={`type-${type.ID}`}
                          checked={selectedTypes.has(type.ID)}
                          onCheckedChange={() => handleTypeChange(type.ID)}
                        />
                        <Label
                          htmlFor={`type-${type.ID}`}
                          className="text-sm font-normal cursor-pointer leading-relaxed"
                        >
                          {type.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {formError && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{formError}</div>
              )}

              {mutationError && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  Ocurrió un error. Por favor, intenta nuevamente.
                  {mutationError.message}
                </div>
              )}

              <Button type="submit" disabled={isPending} className="w-full h-11 text-base font-medium">
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Guardando...
                  </span>
                ) : (
                  "Guardar y continuar"
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="py-8 px-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">¡Perfil completado!</h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
                  Gracias por completar tu información. Esto nos ayuda a ofrecerte mejores oportunidades.
                </p>
              </div>

              <div className="mt-4 rounded-lg bg-primary/5 p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-left space-y-1">
                    <p className="text-sm font-medium">Completa tu perfil al 100%</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Añade más información para aumentar tus oportunidades y conectar con la comunidad
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
