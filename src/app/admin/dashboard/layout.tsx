
'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  Loader2,
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  GraduationCap,
  Accessibility,
  Tag,
  FileText,
  Settings,
  LogOut,
  Star,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Usuarios', href: '/admin/users', icon: Users },
  { name: 'Empleadores', href: '/admin/employers', icon: Building2 },
  { name: 'Empleos', href: '/admin/job-posts', icon: Briefcase },
  { name: 'Discapacidades', href: '/admin/disability-types', icon: Accessibility },
  { name: 'Necesidades Acc.', href: '/admin/accessibility-needs', icon: Tag },
  { name: 'Categorías', href: '/admin/categories', icon: FileText },
  { name: 'Universidades', href: '/admin/universities', icon: GraduationCap },
  { name: 'Tipos Contrato', href: '/admin/contract-types', icon: Briefcase },
  { name: 'Niveles Exp.', href: '/admin/experience-levels', icon: Star },
  { name: 'Modelos Trabajo', href: '/admin/work-models', icon: Briefcase },
  { name: 'Jornadas', href: '/admin/work-schedules', icon: Clock },
  { name: 'Utilidades', href: '/admin/utilities', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return; 

    if (!session || session.role !== 'admin') {
      router.push('/'); 
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col">
        <div className="text-2xl font-bold text-primary mb-8">Admin Panel</div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {adminNavItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={cn(
                  "flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-100",
                  pathname === item.href && "bg-gray-100 font-semibold text-primary"
                )}>
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/' })} className="w-full justify-start text-red-500 hover:bg-red-50">
          <LogOut className="h-5 w-5 mr-2" />
          Cerrar Sesión
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
