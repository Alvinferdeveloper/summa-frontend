import { Card, CardContent } from "@/components/ui/card"
import { Shield, Heart, Zap, Award, Users, Globe } from "lucide-react"

const benefits = [
  {
    icon: Shield,
    title: "Ambiente seguro",
    description: "Plataforma diseñada con accesibilidad y privacidad como prioridades.",
  },
  {
    icon: Heart,
    title: "Empresas comprometidas",
    description: "Conecta solo con empleadores verificados y comprometidos con la inclusión.",
  },
  {
    icon: Zap,
    title: "Proceso ágil",
    description: "Postula rápidamente y recibe respuestas directas de los reclutadores.",
  },
  {
    icon: Award,
    title: "Desarrollo profesional",
    description: "Accede a recursos, capacitaciones y mentorías para impulsar tu carrera.",
  },
  {
    icon: Users,
    title: "Comunidad activa",
    description: "Únete a una red de profesionales que comparten experiencias y consejos.",
  },
  {
    icon: Globe,
    title: "Oportunidades diversas",
    description: "Desde trabajo remoto hasta presencial, en múltiples industrias y roles.",
  },
]

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            ¿Por qué elegir Summa?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Una plataforma diseñada pensando en ti y en tu éxito profesional
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-2 hover:border-accent/50 hover:shadow-lg transition-all">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <benefit.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
