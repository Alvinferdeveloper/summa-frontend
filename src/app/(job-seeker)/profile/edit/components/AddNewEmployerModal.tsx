
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateNewEmployer } from '../hooks/useCreateNewEmployer';

interface AddNewEmployerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newEmployer: { id: number; company_name: string }) => void;
}

export default function AddNewEmployerModal({ isOpen, onClose, onSuccess }: AddNewEmployerModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const mutation = useCreateNewEmployer();

  const handleSubmit = () => {
    mutation.mutate({ company_name: companyName, website }, {
      onSuccess: (data) => {
        onSuccess({ id: data.ID, company_name: data.CompanyName });
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Nueva Empresa</DialogTitle>
          <DialogDescription>
            La empresa que buscas no está en nuestra lista. Por favor, añade sus detalles aquí.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-company-name">Nombre de la Empresa</Label>
            <Input id="new-company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-company-website">Sitio Web (Opcional)</Label>
            <Input id="new-company-website" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : 'Guardar Empresa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
