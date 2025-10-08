
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

interface AddNewUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUniversity: { id: number; name: string }) => void;
}

const createNewUniversity = async (data: { suggested_name: string; country?: string; website?: string }) => {
  const response = await api.post('/v1/university-suggestions', data);
  return response.data;
};

export default function AddNewUniversityModal({ isOpen, onClose, onSuccess }: AddNewUniversityModalProps) {
  const [suggestedName, setSuggestedName] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');

  const mutation = useMutation({ 
    mutationFn: createNewUniversity,
    onSuccess: (data) => {
      onSuccess({ id: data.ID, name: data.SuggestedName });
      onClose();
    }
  });

  const handleSubmit = () => {
    mutation.mutate({ suggested_name: suggestedName, country, website });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Nueva Universidad</DialogTitle>
          <DialogDescription>
            La universidad que buscas no está en nuestra lista. Por favor, añade sus detalles aquí.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-university-name">Nombre de la Universidad</Label>
            <Input id="new-university-name" value={suggestedName} onChange={(e) => setSuggestedName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-university-country">País (Opcional)</Label>
            <Input id="new-university-country" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-university-website">Sitio Web (Opcional)</Label>
            <Input id="new-university-website" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : 'Guardar Universidad'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
