
'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import ImageEditModal from './ImageEditModal';

interface ImageEditProps {
  imageUrl: string | null | undefined;
  endpoint: string;
  paramName: string;
  queryToInvalidate: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ImageEdit({
  imageUrl,
  endpoint,
  paramName,
  queryToInvalidate,
  title,
  children,
  className
}: ImageEditProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ImageEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentImageUrl={imageUrl}
        endpoint={endpoint}
        paramName={paramName}
        queryToInvalidate={queryToInvalidate}
        title={title}
      />
      <div className={`relative group ${className}`}>
        {children}
        <button
          onClick={() => setIsModalOpen(true)}
          aria-label={`Editar ${title}`}
          className="absolute cursor-pointer top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
