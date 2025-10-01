
'use client';

import { useSession } from 'next-auth/react';
import OnboardingForm from './components/OnboardingForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session && !session.onboardingCompleted) {
    return <OnboardingForm />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <Link href="/profile/edit">
          <Button variant="outline">Editar Perfil</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Nombre</h3>
            <p className="text-muted-foreground">{session?.user?.name || 'No especificado'}</p>
          </div>
          <div>
            <h3 className="font-semibold">Correo Electrónico</h3>
            <p className="text-muted-foreground">{session?.user?.email}</p>
          </div>
          {/* Aquí se mostraría más información del perfil del usuario */}
        </CardContent>
      </Card>
    </div>
  );
}
