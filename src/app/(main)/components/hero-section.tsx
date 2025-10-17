import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Briefcase } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-10 md:py-10 mx-6">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col gap-8 z h-full">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm w-fit">
              <span className="text-accent font-semibold">✨ Nuevo</span>
              <span className="text-muted-foreground">Más de 500 empresas inclusivas</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Conectamos talento con <span className="text-primary">oportunidades</span> reales
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Summa es la plataforma que une a personas con discapacidad y empleadores comprometidos con la inclusión
              laboral. Construyamos juntos un futuro más equitativo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="text-base" asChild>
                <Link href="/auth/signin">
                  Buscar empleo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent text-white" asChild>
                <Link href="/employer/login">Soy empleador</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-white">12,000+</p>
                  <p className="text-sm text-muted-foreground">Candidatos</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-sm text-muted-foreground">Empresas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative md:h-[600px] mx-7 aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 p-8">
              <div className="absolute inset-0 rounded-2xl bg-grid-pattern opacity-10 " />
              <img
                src="/diverse-team-of-professionals-working-together-in-.png"
                alt="Equipo diverso trabajando juntos"
                className="relative z-10 h-full  w-full rounded-xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
