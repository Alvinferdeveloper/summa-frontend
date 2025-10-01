
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, PlusCircle, Users, UserCircle } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/employer/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: 'Publicar Empleo', href: '/employer/jobs/create', icon: <PlusCircle className="h-5 w-5" /> },
  { name: 'Candidatos', href: '/employer/applicants', icon: <Users className="h-5 w-5" /> },
  { name: 'Perfil', href: '/employer/profile', icon: <UserCircle className="h-5 w-5" /> },
];

export default function FloatingNav() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <nav className="flex items-center gap-2 rounded-full border border-black/10 bg-white/50 p-2 shadow-lg backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 
                ${isActive ? 'text-white' : 'text-gray-600 hover:text-black'}`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  style={{ borderRadius: 9999 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10 hidden sm:inline">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
