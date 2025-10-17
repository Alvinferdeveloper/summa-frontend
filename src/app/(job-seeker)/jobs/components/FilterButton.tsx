
'use client';

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

interface FilterButtonProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function FilterButton({ title, icon, children, className }: FilterButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" aria-label={title} className={`flex items-center gap-2 shadow-md bg-white hover:bg-primary/30 hover:text-black cursor-pointer ${className}`}>
          {icon}
          <span className="hidden sm:inline">{title}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        {children}
      </PopoverContent>
    </Popover>
  );
}
