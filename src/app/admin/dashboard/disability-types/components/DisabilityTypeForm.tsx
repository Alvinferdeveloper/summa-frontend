"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Tag, FileText } from "lucide-react"
import type { DisabilityType } from "../hooks/useDisabilityTypes"

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface DisabilityTypeFormProps {
  onSubmit: (values: FormValues) => void
  isPending: boolean
  defaultValues?: Partial<DisabilityType>
}

export default function DisabilityTypeForm({ onSubmit, isPending, defaultValues }: DisabilityTypeFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Nombre
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Visual"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Descripción
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción del tipo de discapacidad..."
                  className="min-h-[120px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 font-medium shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  )
}
