
import FloatingNav from '@/app/employer/components/FloatingNav';

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <FloatingNav />
      <main className="pt-24 px-4 md:px-8">
        {children}
      </main>
    </div>
  );
}
