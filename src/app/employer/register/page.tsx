"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { useEmployerRegistration } from "@/app/employer/hooks/useEmployerRegistration"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Building2,
    Loader2,
    Mail,
    Lock,
    Phone,
    Globe,
    Calendar,
    Briefcase,
    Users,
    MapPin,
    FileText,
    Sparkles,
} from "lucide-react"
import Link from "next/link"
import WelcomeModal from "../components/WelcomeModal"

export default function EmployerRegister() {
    const [companyName, setCompanyName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [country, setCountry] = useState("")
    const [foundationDate, setFoundationDate] = useState("")
    const [industry, setIndustry] = useState("")
    const [size, setSize] = useState("")
    const [description, setDescription] = useState("")
    const [address, setAddress] = useState("")
    const [website, setWebsite] = useState("");
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);

    const router = useRouter()
    const { data: session, status } = useSession()

    const { mutate, isPending, isSuccess, error } = useEmployerRegistration()

    useEffect(() => {
        if (isSuccess) {
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
    }, [isSuccess, email, password, router])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutate({
            company_name: companyName,
            email,
            password,
            phone_number: phoneNumber,
            country,
            foundation_date: foundationDate,
            industry,
            size,
            description,
            address,
            website,
        })
    }

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <>
            <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
            <div className="min-h-screen p-4 py-12 md:p-8 md:py-16">
                <div className="mx-auto w-full max-w-6xl">
                    {/* Hero Header */}
                    <div className="mb-12 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                <div className="absolute -inset-2 animate-pulse rounded-3xl bg-primary/20 blur-xl" />
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
                                    <Building2 className="h-8 w-8 text-primary-foreground" />
                                </div>
                            </div>
                        </div>
                        <h1 className="mb-4 text-xl font-bold tracking-tight text-balance md:text-2xl">Únete a Nuestra Plataforma</h1>
                        <p className="mx-auto max-w-xl text-lg text-muted-foreground text-pretty md:text-xl">
                            Conecta con el mejor talento y construye el equipo de tus sueños. El registro toma menos de 2 minutos.
                        </p>
                    </div>

                    {/* Main Form Card */}
                    <Card className="overflow-hidden border-2 border-border shadow-xl">
                        <CardContent className="p-6 md:p-10">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Essential Information Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                            <Sparkles className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Información Esencial</h2>
                                            <p className="text-sm text-muted-foreground">Empecemos con lo básico</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Company Name */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="companyName" className="flex items-center gap-2 text-base font-medium">
                                                <Building2 className="h-4 w-4 text-primary" />
                                                Nombre de la Empresa <span className="text-secondary">*</span>
                                            </Label>
                                            <Input
                                                id="companyName"
                                                type="text"
                                                placeholder="Acme Corporation"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                required
                                                className="h-12 border-2 text-base transition-all focus:border-primary focus:ring-4 focus:ring-primary/20"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="flex items-center gap-2 text-base font-medium">
                                                <Mail className="h-4 w-4 text-primary" />
                                                Correo Electrónico <span className="text-secondary">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="hola@empresa.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="h-12 border-2 text-base transition-all focus:border-primary focus:ring-4 focus:ring-primary/20"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="flex items-center gap-2 text-base font-medium">
                                                <Lock className="h-4 w-4 text-primary" />
                                                Contraseña <span className="text-secondary">*</span>
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Crea una contraseña segura"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="h-12 border-2 text-base transition-all focus:border-primary focus:ring-4 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Divider */}
                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t-2 border-dashed border-border" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-card px-4 text-sm font-medium text-muted-foreground">
                                            Detalles Adicionales (Opcional)
                                        </span>
                                    </div>
                                </div>

                                {/* Company Details Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                                            <Briefcase className="h-5 w-5 text-secondary" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Detalles de la Empresa</h2>
                                            <p className="text-sm text-muted-foreground">Ayuda a los candidatos a conocerte mejor</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-3">
                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-base font-medium">
                                                <Phone className="h-4 w-4 text-secondary" />
                                                Número de Teléfono
                                            </Label>
                                            <Input
                                                id="phoneNumber"
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="h-12 border-2 text-base transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/20"
                                            />
                                        </div>

                                        {/* Country */}
                                        <div className="space-y-2">
                                            <Label htmlFor="country" className="flex items-center gap-2 text-base font-medium">
                                                <Globe className="h-4 w-4 text-secondary" />
                                                País
                                            </Label>
                                            <Input
                                                id="country"
                                                type="text"
                                                placeholder="Estados Unidos"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                className="h-12 border-2 text-base transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/20"
                                            />
                                        </div>

                                        {/* Foundation Date */}
                                        <div className="space-y-2">
                                            <Label htmlFor="foundationDate" className="flex items-center gap-2 text-base font-medium">
                                                <Calendar className="h-4 w-4 text-secondary" />
                                                Fundada en
                                            </Label>
                                            <Input
                                                id="foundationDate"
                                                type="date"
                                                value={foundationDate}
                                                onChange={(e) => setFoundationDate(e.target.value)}
                                                className="h-12 border-2 text-base transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/20"
                                            />
                                        </div>

                                        {/* Industry */}
                                        <div className="space-y-2">
                                            <Label htmlFor="industry" className="flex items-center gap-2 text-base font-medium">
                                                <Briefcase className="h-4 w-4 text-secondary" />
                                                Industria
                                            </Label>
                                            <Input
                                                id="industry"
                                                type="text"
                                                placeholder="Tecnología, Salud, etc."
                                                value={industry}
                                                onChange={(e) => setIndustry(e.target.value)}
                                                className="h-12 border-2 text-base transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/20"
                                            />
                                        </div>

                                        {/* Size */}
                                        <div className="space-y-2">
                                            <Label htmlFor="size" className="flex items-center gap-2 text-base font-medium">
                                                <Users className="h-4 w-4 text-secondary" />
                                                Tamaño de la Empresa
                                            </Label>
                                            <Input
                                                id="size"
                                                type="text"
                                                placeholder="1-10, 11-50, 51-200..."
                                                value={size}
                                                onChange={(e) => setSize(e.target.value)}
                                                className="h-12 border-2 text-base transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/20"
                                            />
                                        </div>

                                        {/* Website */}
                                        <div className="space-y-2">
                                            <Label htmlFor="website" className="flex items-center gap-2 text-base font-medium">
                                                <Globe className="h-4 w-4 text-secondary" />
                                                Sitio Web
                                            </Label>
                                            <Input
                                                id="website"
                                                type="url"
                                                placeholder="https://tuempresa.com"
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                                className="h-12 border-2 text-base transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/20"
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="space-y-2 md:col-span-3">
                                            <Label htmlFor="address" className="flex items-center gap-2 text-base font-medium">
                                                <MapPin className="h-4 w-4 text-secondary" />
                                                Dirección
                                            </Label>
                                            <Input
                                                id="address"
                                                type="text"
                                                placeholder="123 Calle Principal, Ciudad, Estado, C.P."
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="h-12 border-2 text-base transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/20"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2 md:col-span-3">
                                            <Label htmlFor="description" className="flex items-center gap-2 text-base font-medium">
                                                <FileText className="h-4 w-4 text-secondary" />
                                                Descripción de la Empresa
                                            </Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Cuéntanos sobre la misión, cultura y qué hace única a tu empresa..."
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                rows={4}
                                                className="resize-none border-2 text-base transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <Alert variant="destructive" className="border-2">
                                        <AlertDescription className="text-base">{error.message}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Submit Button */}
                                <div className="space-y-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="h-12 w-full text-lg font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                                        size="lg"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Creando tu cuenta...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-5 w-5" />
                                                Crear Mi Cuenta
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-center text-sm text-muted-foreground">
                                        ¿Ya tienes una cuenta?{" "}
                                        <Link
                                            href="/employer/login"
                                            className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                                        >
                                            Inicia sesión aquí
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Trust Badge */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            🔒 Tu información está segura y nunca será compartida con terceros
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
