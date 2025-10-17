'use client'

import { Briefcase, Building2, Calendar, FileText, Globe, Loader2, Lock, Mail, MapPin, Phone, Sparkles } from "lucide-react"
import Link from "next/link"
import WelcomeModal from "../components/WelcomeModal"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEmployerRegistration } from "@/app/employer/hooks/useEmployerRegistration"
import { employerRegisterSchema, type EmployerRegisterSchema } from "./validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import IndustrySelect from "./components/IndustrySelect"
import CompanySizeSelect from "./components/CompanySizeSelect"
import CountrySelector, { SelectMenuOption } from "@/app/components/shared/CountrySelector"
import { COUNTRIES } from "@/app/data/countries"
import FileUpload from "@/app/components/shared/FileUpload"
import CheckboxGroup from "./components/CheckboxGroup"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

const fetchInfrastructures = async () => {
    const { data } = await api.get<{ id: number; name: string }[]>("/v1/infrastructures");
    return data.map(item => ({ ...item, id: String(item.id) }));
};

const fetchPrograms = async () => {
    const { data } = await api.get<{ id: number; name: string }[]>("/v1/programs");
    return data.map(item => ({ ...item, id: String(item.id) }));
};

export default function EmployerRegister() {
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);
    const router = useRouter()
    const { status } = useSession()

    const { data: infrastructureOptions = [] } = useQuery({ queryKey: ['infrastructures'], queryFn: fetchInfrastructures });
    const { data: programOptions = [] } = useQuery({ queryKey: ['programs'], queryFn: fetchPrograms });

    const form = useForm<EmployerRegisterSchema>({
        resolver: zodResolver(employerRegisterSchema),
        defaultValues: {
            company_name: "",
            email: "",
            password: "",
            phone_number: "",
            country: "NI",
            foundation_date: "",
            industry: "",
            size: "",
            description: "",
            address: "",
            website: "",
            dedication: "",
            accessible_infrastructure_ids: [],
            inclusive_program_ids: [],
        },
    })

    const { mutate, isPending, isSuccess, error } = useEmployerRegistration()
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            const { email, password } = form.getValues()
            signIn("credentials", {
                email,
                password,
                redirect: false,
            }).then((result) => {
                if (result?.error) {
                    console.error("Auto-login after registration failed:", result.error)
                    router.push("/employer/login?error=AutoLoginFailed")
                } else if (result?.ok) {
                    console.log("Auto-login after registration successful.")
                    router.push("/employer/dashboard")
                }
            })
        }
    }, [isSuccess, form, router])

    function onSubmit(values: EmployerRegisterSchema) {
        const { logo, ...rest } = values;

        mutate({
            values: rest,
            logo: logo,
        });
    }

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen lg:grid lg:grid-cols-[70%_30%]">
            <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
            <div className="min-h-screen p-4 py-12 md:p-8 md:py-16">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="mb-12 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                <Image
                                    src="/logo3.png"
                                    alt="logo"
                                    width={300}
                                    height={300}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Form Card */}
                    <Card className="overflow-hidden border-2 border-border shadow-xl rounded-sm">
                        <CardContent className="p-6 md:p-10">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                                    {/* Essential Information Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                                <Sparkles className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold">Información Esencial</h2>
                                                <p className="text-sm text-muted-foreground">Comienza con la información básica de tu empresa</p>
                                            </div>
                                        </div>
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="company_name"
                                                render={({ field }) => (
                                                    <FormItem className="md:col-span-2">
                                                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                                                            <Building2 className="h-4 w-4 text-primary" />
                                                            Nombre de la Empresa <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Acme Corporation" {...field} className="h-12 border-2 text-base transition-all focus:border-none focus:ring-4 focus:ring-primary/20" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FileUpload
                                                label="Logo de la empresa (opcional)"
                                                value={form.watch("logo")}
                                                onChange={(file: File | null) => form.setValue("logo", file)}
                                                accept="image/*"
                                                maxSizeMB={5}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                                                            <Mail className="h-4 w-4 text-primary" />
                                                            Correo Electrónico <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="hola@empresa.com" {...field} className="h-12 border-2 text-base transition-all focus:border-none focus:ring-4 focus:ring-primary/20" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                                                            <Lock className="h-4 w-4 text-primary" />
                                                            Contraseña <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder="Crea una contraseña segura" {...field} className="h-12 border-2 text-base transition-all focus:border-none focus:ring-4 focus:ring-primary/20" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t-2 border-dashed border-border" />
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-card px-4 text-sm font-medium text-muted-foreground">
                                                Detalles de la Empresa
                                            </span>
                                        </div>
                                    </div>

                                    {/* Company Details Section */}
                                    <div className="space-y-6">
                                        <div className="grid gap-6 md:grid-cols-3">
                                            <FormField
                                                control={form.control}
                                                name="phone_number"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                                                            <Phone className="h-4 w-4 text-primary" />
                                                            Número de Teléfono <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="+1 (555) 000-0000" {...field} className="h-12 border-2 text-base transition-all focus:border-none focus:ring-4 !focus:ring-primary" />
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
                                                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                                                            <Globe className="h-4 w-4 text-primary" />
                                                            País <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <CountrySelector
                                                                id="country"
                                                                className="h-12 border-2"
                                                                open={isOpen}
                                                                onToggle={() => setIsOpen(!isOpen)}
                                                                onChange={(val) => field.onChange(val)}
                                                                selectedValue={COUNTRIES.find(option => option.value === field.value) as SelectMenuOption}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                                                            <MapPin className="h-4 w-4 text-primary" />
                                                            Dirección <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="123 Calle Principal, Ciudad" {...field} className="h-12 border-2 text-base transition-all focus:border-none focus:ring-4 focus:ring-primary/20" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="industry"
                                                render={({ field }) => (
                                                    <IndustrySelect field={field} />
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="size"
                                                render={({ field }) => (
                                                    <CompanySizeSelect field={field} />
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="dedication"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                                                            <Briefcase className="h-4 w-4 text-primary" />
                                                            Dedicación <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Ej: Desarrollo de Software" {...field} className="h-12 border-2 text-base transition-all focus:border-none focus:ring-4 focus:ring-primary/20" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="website"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                                                            <Globe className="h-4 w-4 text-primary" />
                                                            Sitio Web (Opcional)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input type="url" placeholder="https://tuempresa.com" {...field} className="h-12 border-2 text-base transition-all focus:border-none focus:ring-4 focus:ring-primary/20" />
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
                                                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                                                            <Calendar className="h-4 w-4 text-primary" />
                                                            Fundada en (Opcional)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input type="date" {...field} className="h-12 border-2 text-base transition-all focus:border-none focus:ring-primary/20" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem className="md:col-span-3">
                                                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                                                            <FileText className="h-4 w-4 text-primary" />
                                                            Descripción de la Empresa (Opcional)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Cuéntanos sobre la misión, cultura y qué hace única a tu empresa..." {...field} rows={4} className="resize-none border-2 text-base transition-all focus:border-none focus:ring-4 focus:ring-primary/20" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t-2 border-dashed border-border" />
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-card px-4 text-sm font-medium text-muted-foreground">
                                                Compromiso con la Inclusión (Opcional)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <CheckboxGroup
                                            control={form.control}
                                            name="accessible_infrastructure_ids"
                                            options={infrastructureOptions}
                                            label="Infraestructura Accesible en Oficinas"
                                        />
                                        <CheckboxGroup
                                            control={form.control}
                                            name="inclusive_program_ids"
                                            options={programOptions}
                                            label="Programas o Beneficios Inclusivos"
                                        />
                                    </div>


                                    {/* Error Message */}
                                    {error && (
                                        <Alert variant="destructive" className="border-2">
                                            <AlertDescription className="text-base">{error.message}</AlertDescription>
                                        </Alert>
                                    )}


                                    {/* Submit Button */}
                                    <div className="space-y-4 pt-4">
                                        <Button type="submit" disabled={isPending} className="h-12 w-full text-lg font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl" size="lg">
                                            {isPending ? (
                                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Creando tu cuenta...</>
                                            ) : (
                                                <><Sparkles className="mr-2 h-5 w-5" />Crear Mi Cuenta</>
                                            )}
                                        </Button>
                                        <p className="text-center text-sm text-muted-foreground">
                                            ¿Ya tienes una cuenta?{" "}
                                            <Link href="/employer/login" className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline">
                                                Inicia sesión aquí
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Trust Badge */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            🔒 Tu información es segura y nunca será compartida con terceros
                        </p>
                    </div>
                </div>
            </div>
            <div className="relative hidden lg:block">
                <div className="sticky top-0 h-screen overflow-hidden">
                    {/* Gradient Overlay Effect */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/20 via-primary/20 to-primary/30 mix-blend-overlay" />

                    {/* Animated Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-green-300 to-primary animate-gradient-shift" />

                    {/* Decorative Shapes */}
                    <div className="absolute inset-0 z-20">
                        <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-float rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 animate-float-delayed rounded-full bg-white/10 blur-3xl" />
                    </div>

                    {/* Main Illustration */}
                    <div className="relative z-30 flex h-full items-center justify-center p-12">
                        <div className="text-center">
                            <h2 className="mb-4 text-4xl font-bold text-white text-balance">Unete a nuestra plataforma</h2>
                            <div className="mb-8 flex justify-center">
                                <div className="relative">
                                    <div className="absolute -inset-4 animate-pulse rounded-full bg-white/20 blur-2xl" />
                                    <img
                                        src="/carnival.svg"
                                        alt="Team Collaboration"
                                        className="relative h-96 w-96 rounded-3xl object-cover shadow-2xl"
                                    />
                                </div>
                            </div>
                            <h3 className="mb-4 text-3xl font-bold text-white text-balance">Arma el equipo de tus sueños</h3>
                            <p className="text-md text-white/90 text-pretty">
                                Encuentra talento excepcional para construir una fuerza laboral diversa e inclusiva.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}