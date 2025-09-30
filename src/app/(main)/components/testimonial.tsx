import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "María González",
    role: "Desarrolladora Frontend",
    company: "TechCorp",
    image: "/professional-woman-smiling.png",
    quote:
      "Summa me ayudó a encontrar una empresa que realmente valora la diversidad. Ahora trabajo en un equipo increíble que respeta mis necesidades.",
  },
  {
    name: "Carlos Ramírez",
    role: "Analista de Datos",
    company: "DataInsights",
    image: "/professional-man-smiling.png",
    quote:
      "Después de meses buscando, encontré en Summa la oportunidad perfecta. El proceso fue transparente y accesible desde el inicio.",
  },
  {
    name: "Ana Martínez",
    role: "Diseñadora UX",
    company: "CreativeStudio",
    image: "/professional-woman-designer.png",
    quote:
      "La plataforma es intuitiva y las empresas están genuinamente comprometidas con la inclusión. Recomiendo Summa a todos mis colegas.",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Historias de éxito
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Conoce a profesionales que encontraron su lugar gracias a Summa
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-8 pb-6 px-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-foreground leading-relaxed mb-6 text-pretty">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} en {testimonial.company}
                    </p>
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
