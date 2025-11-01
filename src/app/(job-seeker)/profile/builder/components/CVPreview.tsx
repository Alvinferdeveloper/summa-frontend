
'use client';

import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { CVDocument } from './CVDocument';
import { ProfileData } from '../../hooks/useMyProfile';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface CVPreviewProps {
  profile: ProfileData;
  prevStep: () => void;
}

export default function CVPreview({ profile, prevStep }: CVPreviewProps) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Vista Previa y Descarga</h2>
        <p className="text-muted-foreground">Así se verá tu perfil profesional. Puedes descargarlo como un PDF accesible.</p>

        <div className="h-[500px] border rounded-lg bg-gray-50">
          <PDFViewer width="100%" height="100%">
            <CVDocument profile={profile} />
          </PDFViewer>
        </div>

        <div className="flex justify-between mt-8">
          <PDFDownloadLink document={<CVDocument profile={profile} />} fileName="CV.pdf">
            {({ blob, url, loading, error }) =>
              loading ? 'Generando PDF...' : <Button onClick={() => router.push('/profile')}>Descargar CV en PDF</Button>
            }
          </PDFDownloadLink>
        </div>
      </div>
    </motion.div>
  );
}
