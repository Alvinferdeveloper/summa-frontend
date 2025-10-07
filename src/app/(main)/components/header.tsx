import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky px-6 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-xl font-bold text-foreground">Summa</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#como-funciona"
            className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
          >
            Cómo funciona
          </Link>
          <Link
            href="#beneficios"
            className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
          >
            Beneficios
          </Link>
          <Link
            href="#testimonios"
            className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
          >
            Testimonios
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="text-foreground">
            <Link href="/auth/signin">Iniciar sesión</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Comenzar</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
