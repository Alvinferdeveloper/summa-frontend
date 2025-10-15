"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useUpdateEmployerProfile, type EmployerProfileData } from "../hooks/useEmployerProfile"
import { useUpload } from "@/app/hooks/useUpload"
import ImageUpload from "@/app/components/shared/ImageUpload"
import { Loader2 } from "lucide-react"

const profileSchema = z.object({
  company_name: z.string().min(3, "El nombre de la empresa es requerido."),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  phone_number: z.string().optional(),
  country: z.string().optional(),
  foundation_date: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
})
type ProfileFormValues = z.infer<typeof profileSchema>

interface EditEmployerProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile: EmployerProfileData
}

export default function EditEmployerProfileModal({ isOpen, onClose, profile }: EditEmployerProfileModalProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateEmployerProfile()
  const { mutate: uploadLogo, isPending: isUploading } = useUpload()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      company_name: profile.company_name || "",
      website: profile.website || "",
      phone_number: profile.phone_number || "",
      country: profile.country || "",
      foundation_date: profile.foundation_date?.split("T")[0] || "",
      industry: profile.industry || "",
      size: profile.size || "",
      description: profile.description || "",
      address: profile.address || "",
    },
  })

  useEffect(() => {
    form.reset(profile)
  }, [profile, form])

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile(values, {
      onSuccess: () => {
        if (logoFile) {
          uploadLogo(
            { file: logoFile, endpoint: "/v1/employer/logo", paramName: "logo" },
            {
              onSuccess: onClose,
            },
          )
        } else {
          onClose()
        }
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6 border-b">
          <DialogTitle className="text-2xl font-light tracking-tight">Editar Perfil de la Empresa</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Actualiza la información de tu empresa para mantener tu perfil al día.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-6">
            <div className="space-y-2">
              <ImageUpload onFileChange={setLogoFile} label="Logo de la Empresa" />
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-normal text-foreground">Nombre de la Empresa</FormLabel>
                      <FormControl>
                        <Input className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-foreground">Industria</FormLabel>
                      <FormControl>
                        <Input className="h-11" placeholder="Ej: Tecnología" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-foreground">Tamaño de la Empresa</FormLabel>
                      <FormControl>
                        <Input className="h-11" placeholder="Ej: 1-10 empleados" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="foundation_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-foreground">Fecha de Fundación</FormLabel>
                      <FormControl>
                        <Input className="h-11" type="date" {...field} />
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
                      <FormLabel className="text-sm font-normal text-foreground">País</FormLabel>
                      <FormControl>
                        <Input className="h-11" placeholder="Ej: Estados Unidos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Información de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-foreground">Sitio Web</FormLabel>
                      <FormControl>
                        <Input className="h-11" type="url" placeholder="https://tuempresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-foreground">Número de Teléfono</FormLabel>
                      <FormControl>
                        <Input className="h-11" placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-normal text-foreground">Dirección</FormLabel>
                      <FormControl>
                        <Input className="h-11" placeholder="123 Calle Principal, Ciudad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Descripción</h3>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal text-foreground">Acerca de la Empresa</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe tu empresa, su misión y valores..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-6 border-t gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="h-11 px-6 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating || isUploading} className="h-11 px-6">
                {(isUpdating || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
