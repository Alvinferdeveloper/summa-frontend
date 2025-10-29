
'use client';

import { Bell, CheckCheck } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications } from '@/app/hooks/useNotifications';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 86400;
  if (interval > 1) return `hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `hace ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
  return `hace unos segundos`;
};

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  return (
    <Popover onOpenChange={(isOpen) => {
      if (isOpen && unreadCount > 0) {
        markAllAsRead();
      }
    }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
        </div>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center p-8">No tienes notificaciones.</p>
          ) : (
            <div className="divide-y">
              {notifications.map(notification => (
                <Link key={notification.id} href={notification.link || '#'} className={`block p-4 hover:bg-blue-300 ${!notification.is_read ? 'bg-blue-50' : ''}`}>
                  <p className="text-sm mb-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(notification.created_at)}</p>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
        {unreadCount > 0 && (
          <div className="p-2 border-t">
            <Button variant="link" size="sm" onClick={() => markAllAsRead()} className="w-full">
              <CheckCheck className="mr-2 h-4 w-4" /> Marcar todas como leídas
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
