
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { Heart, Users, Zap } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
};

const points = [
  {
    icon: <Heart className="h-6 w-6 text-primary" />,
    title: "Genera un Impacto Real",
    description: "Al unirte, te comprometes con la diversidad y creas oportunidades reales para profesionales cualificados con discapacidad.",
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Accede a un Diverso Grupo de Talentos",
    description: "Descubre una comunidad de candidatos talentosos, motivados y a menudo pasados por alto, listos para contribuir al éxito de tu empresa.",
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Contratación Simplificada y Accesible",
    description: "Nuestra plataforma está diseñada para que el proceso de contratación sea transparente y accesible tanto para empleadores como para candidatos.",
  },
];

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-8">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <DialogHeader className="text-center">
            <motion.div variants={itemVariants} className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <DialogTitle className="text-2xl font-bold mt-4">Bienvenido a una Plataforma de Contratación Inclusiva</DialogTitle>
              <DialogDescription className="mt-2 text-muted-foreground">
                Gracias por tu interés en construir una fuerza laboral más diversa e inclusiva. Esto es de lo que trata nuestra plataforma.
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <motion.div className="mt-8 space-y-6" variants={containerVariants}>
            {points.map((point, index) => (
              <motion.div key={index} className="flex items-start space-x-4" variants={itemVariants}>
                <div className="flex-shrink-0">{point.icon}</div>
                <div>
                  <h3 className="font-semibold">{point.title}</h3>
                  <p className="text-sm text-muted-foreground">{point.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="mt-8 text-center" variants={itemVariants}>
            <Button onClick={onClose} className="w-full h-11 text-base">
              Estoy Listo para Unirme
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
