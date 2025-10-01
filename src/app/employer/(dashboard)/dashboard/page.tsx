"use client"
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Bell, PlusCircle } from "lucide-react";
import Link from 'next/link';

const stats = [
  { title: "Empleos Activos", value: "5", icon: <Briefcase className="h-6 w-6 text-primary" /> },
  { title: "Nuevos Candidatos", value: "12", icon: <Users className="h-6 w-6 text-green-500" /> },
  { title: "Notificaciones", value: "3", icon: <Bell className="h-6 w-6 text-yellow-500" /> },
];

export default function EmployerDashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
    </div>
  );
}
