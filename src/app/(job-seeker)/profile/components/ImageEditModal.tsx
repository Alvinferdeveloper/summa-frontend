
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/app/components/shared/ImageUpload";
import { useUpload } from "@/app/hooks/useUpload";
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl: string | null | undefined;
  endpoint: string;
  paramName: string;
  queryToInvalidate: string;
  title: string;
}

export default function ImageEditModal({
  isOpen,
  onClose,
  currentImageUrl,
  endpoint,
  paramName,
  queryToInvalidate,
  title
}: ImageEditModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { mutate: uploadImage, isPending } = useUpload();

  const handleSave = () => {
    if (!file) return;

    uploadImage({ file, endpoint, paramName }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryToInvalidate] });
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-secondary'>
        <DialogHeader>
          <DialogTitle>Editar {title}</DialogTitle>
          <DialogDescription>
            Sube una nueva imagen. La imagen actual será reemplazada.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Imagen Actual</h3>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              {currentImageUrl ? (
                <img src={currentImageUrl} alt="Imagen actual" className="object-contain h-full w-full rounded-lg" />
              ) : (
                <p className="text-muted-foreground">No hay imagen actual</p>
              )}
            </div>
          </div>
          <ImageUpload onFileChange={setFile} label="Nueva Imagen" />
        </div>
        <DialogFooter>
          <Button className='bg-accent hover:bg-accent/80 cursor-pointer' onClick={onClose}>Cancelar</Button>
          <Button className='cursor-pointer' onClick={handleSave} disabled={!file || isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
