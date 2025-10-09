"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProfileData } from "../../hooks/useMyProfile"
import { useUpdateContactInfo } from "../hooks/useUpdateContactInfo"
import { Loader2, Save, Phone, MapPin, Globe, Home, Linkedin, FileText, User } from "lucide-react"
import CountrySelector, { SelectMenuOption } from "@/app/components/shared/CountrySelector"
import { useState } from "react"
import { COUNTRIES } from "@/app/data/countries"

const contactInfoSchema = z.object({
  phone_number: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  linked_in: z.string().url("Debe ser una URL válida").or(z.literal("")).optional(),
  resume_url: z.string().url("Debe ser una URL válida").or(z.literal("")).optional(),
  profile_picture: z.string().url("Debe ser una URL válida").or(z.literal("")).optional(),
})

export type ContactInfoFormValues = z.infer<typeof contactInfoSchema>

interface ContactInfoFormProps {
  profile: ProfileData
}

export default function ContactInfoForm({ profile }: ContactInfoFormProps) {
  const updateContactInfoMutation = useUpdateContactInfo()
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      phone_number: profile.phone_number || "",
      city: profile.city || "",
      country: COUNTRIES.find(option => option.title === profile.country)?.value || "NI",
      address: profile.address || "",
      linked_in: profile.linked_in || "",
      resume_url: profile.resume_url || "",
      profile_picture: profile.profile_picture || "",
    },
  })

  function onSubmit(values: ContactInfoFormValues) {
    updateContactInfoMutation.mutate({
      ...values,
      country: COUNTRIES.find(option => option.value === values.country)?.title || "",
    })
  }

  return (
    <Card className="rounded-lg border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-b border-border/50">
        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Información de Contacto
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <Phone className="h-4 w-4" />
                <span>Contacto Directo</span>
              </div>

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Número de Teléfono</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ej: +505 8888-8888"
                          {...field}
                          className="pl-10 border-primary focus:border-primary transition-colors rounded-lg"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <MapPin className="h-4 w-4" />
                <span>Ubicación</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Ciudad</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Ej: Managua"
                            {...field}
                            className="pl-10 border-primary focus:border-primary transition-colors rounded-lg"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">País</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <CountrySelector
                            id="country"
                            open={isOpen}
                            onToggle={() => setIsOpen(!isOpen)}
                            onChange={(val) => field.onChange(val)}
                            selectedValue={COUNTRIES.find(option => option.value === field.value) as SelectMenuOption}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Dirección</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ej: 123 Calle Principal"
                          {...field}
                          className="pl-10 border-primary focus:border-primary transition-colors rounded-lg"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <Globe className="h-4 w-4" />
                <span>Presencia en Línea</span>
              </div>

              <FormField
                control={form.control}
                name="linked_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Perfil de LinkedIn</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="https://linkedin.com/in/tuperfil"
                          {...field}
                          className="pl-10 border-primary focus:border-primary transition-colors rounded-lg"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resume_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">URL del Currículum</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="https://tuweb.com/curriculum.pdf"
                          {...field}
                          className="pl-10 border-primary focus:border-primary transition-colors rounded-lg"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile_picture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">URL de la Foto de Perfil</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="https://ejemplo.com/tu_foto.jpg"
                          {...field}
                          className="pl-10 border-primary focus:border-primary transition-colors rounded-lg"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 border-t border-border/50">
              <Button
                type="submit"
                disabled={updateContactInfoMutation.isPending}
                className="w-full md:w-auto cursor-pointer bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm hover:shadow-md transition-all duration-200"
              >
                {updateContactInfoMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
