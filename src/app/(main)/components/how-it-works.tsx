import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, Search, Handshake, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Crea tu perfil",
    description:
      "Regístrate y completa tu perfil destacando tus habilidades, experiencia y aspiraciones profesionales.",
  },
  {
    icon: Search,
    title: "Explora oportunidades",
    description:
      "Navega por cientos de ofertas de empresas comprometidas con la inclusión y encuentra tu match perfecto.",
  },
  {
    icon: Handshake,
    title: "Conecta con empleadores",
    description: "Postula a las vacantes que te interesan y conecta directamente con reclutadores inclusivos.",
  },
  {
    icon: TrendingUp,
    title: "Crece profesionalmente",
    description: "Desarrolla tu carrera en un ambiente inclusivo que valora tu talento y potencial único.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-10 md:py-20 bg-primary/30 px-6">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-muted">
            ¿Cómo funciona Summa?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Cuatro pasos simples para conectar con tu próxima oportunidad laboral
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={index} className="relative border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-12 pb-8 px-6">
                <div className="absolute -top-6 left-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="absolute top-6 right-6 text-6xl font-bold text-muted/20">{index + 1}</div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
