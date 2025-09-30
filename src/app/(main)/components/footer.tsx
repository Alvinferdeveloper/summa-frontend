import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-bold text-foreground">Summa</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Conectando talento con oportunidades para construir un futuro laboral más inclusivo.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Para candidatos</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/buscar-empleo"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Buscar empleo
                </Link>
              </li>
              <li>
                <Link
                  href="/recursos"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Recursos
                </Link>
              </li>
              <li>
                <Link
                  href="/consejos"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Consejos de carrera
                </Link>
              </li>
              <li>
                <Link
                  href="/comunidad"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Comunidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Para empresas</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/publicar-vacante"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Publicar vacante
                </Link>
              </li>
              <li>
                <Link href="/planes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Planes y precios
                </Link>
              </li>
              <li>
                <Link
                  href="/guia-inclusion"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Guía de inclusión
                </Link>
              </li>
              <li>
                <Link
                  href="/casos-exito"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Casos de éxito
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Compañía</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/nosotros"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/ayuda" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Centro de ayuda
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Summa. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Términos
            </Link>
            <Link
              href="/accesibilidad"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Accesibilidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
