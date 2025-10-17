'use client';

import { signIn } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Facebook from '@/app/components/icons/Facebook';
import Google from '@/app/components/icons/Google';
import Apple from '@/app/components/icons/Apple';
import Logo from '@/app/components/icons/Logo';

export default function SignInPage() {
  return (
    <div className="flex items-center h-screen w-screen">
      <div className="w-full max-w-md mx-auto">
        <Card className="border-border/50 shadow-lg rounded-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-semibold text-balance">
              {"Bienvenido a tu plataforma de empleo inclusivo"}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-pretty">
              {"Conecta con oportunidades laborales que valoran la diversidad y la inclusión"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={() => signIn('google', { callbackUrl: '/jobs' })}
                variant="outline"
                className="w-full h-12 text-left justify-start gap-3 border-border bg-inherit transition-colors hover:bg-muted/50 hover:text-primary"
              >
                <Google />
                <span className="font-medium">{"Continuar con Google"}</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start gap-3 bg-inherit border-border transition-colors hover:bg-muted/50 hover:text-primary"
              >
                <Facebook />
                <span className="font-medium">{"Continuar con Facebook"}</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start gap-3 bg-inherit border-border transition-colors hover:bg-muted/50 hover:text-primary"
              >
                <Apple />
                <span className="font-medium">{"Continuar con Apple"}</span>
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{"Empleo para todos"}</span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground text-pretty">
                {"Al continuar, aceptas nuestros términos de servicio y política de privacidad"}
              </p>
              <p className="text-xs text-muted-foreground">
                {"Comprometidos con la igualdad de oportunidades laborales"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

