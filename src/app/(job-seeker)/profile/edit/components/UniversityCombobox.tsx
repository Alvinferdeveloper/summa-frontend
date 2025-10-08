
'use client';

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSearchUniversities } from '../hooks/useSearchUniversities';

export interface UniversityOption {
  id: number;
  name: string;
  logo_url?: string;
  isNew?: boolean;
}

interface UniversityComboboxProps {
  selectedUniversity: UniversityOption | null;
  onSelect: (university: UniversityOption | null) => void;
  onAddNew: () => void;
}

export function UniversityCombobox({ selectedUniversity, onSelect, onAddNew }: UniversityComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { data: universities, isLoading } = useSearchUniversities(searchQuery);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-16 text-base"
        >
          {selectedUniversity ? (
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                {selectedUniversity.logo_url ? (
                  <img src={selectedUniversity.logo_url} alt={selectedUniversity.name} className="w-full h-full object-contain rounded-md" />
                ) : (
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-semibold">{selectedUniversity.name}</p>
                <p className="text-xs text-muted-foreground">Universidad</p>
              </div>
            </div>
          ) : (
            "Selecciona una universidad..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput 
            placeholder="Busca una universidad..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading && <CommandItem>Buscando...</CommandItem>}
            <CommandEmpty>No se encontró la universidad.</CommandEmpty>
            <CommandGroup>
              {universities?.map((university) => (
                <CommandItem
                  key={university.id}
                  value={university.name}
                  onSelect={() => {
                    onSelect(university);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                      {university.logo_url ? (
                        <img src={university.logo_url} alt={university.name} className="w-full h-full object-contain rounded-md" />
                      ) : (
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p>{university.name}</p>
                  </div>
                  <Check className={cn("h-4 w-4", selectedUniversity?.id === university.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandItem 
              onSelect={() => {
                onAddNew();
                setOpen(false);
              }}
              className="text-primary font-semibold"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir nueva universidad
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
