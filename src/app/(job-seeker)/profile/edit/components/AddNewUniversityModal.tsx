
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateNewUniversity } from '../hooks/useCreateNewUniversity';

interface AddNewUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUniversity: { id: number; name: string }) => void;
}

export default function AddNewUniversityModal({ isOpen, onClose, onSuccess }: AddNewUniversityModalProps) {
  const [suggestedName, setSuggestedName] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');

  const mutation = useCreateNewUniversity();

  const handleSubmit = () => {
    mutation.mutate({ suggested_name: suggestedName, country, website }, {
      onSuccess: (data) => {
        onSuccess({ id: data.ID, name: data.suggested_name });
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white'>
        <DialogHeader>
          <DialogTitle>Añadir Nueva Universidad</DialogTitle>
          <DialogDescription>
            La universidad que buscas no está en nuestra lista. Por favor, añade sus detalles aquí.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-university-name">Nombre de la Universidad</Label>
            <Input id="new-university-name" className='border-primary' value={suggestedName} onChange={(e) => setSuggestedName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-university-country">País (Opcional)</Label>
            <Input id="new-university-country" className='border-primary' value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-university-website">Sitio Web (Opcional)</Label>
            <Input id="new-university-website" className='border-primary' value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className='bg-secondary border-primary hover:bg-primary/70 cursor-pointer' onClick={onClose}>Cancelar</Button>
          <Button className='cursor-pointer' onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : 'Guardar Universidad'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
