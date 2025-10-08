
'use client';

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface EmployerOption {
  id: number;
  company_name: string;
  logo_url: string;
  industry: string;
  isNew?: boolean; // Para diferenciar una empresa nueva de una existente
}

interface EmployerComboboxProps {
  selectedEmployer: EmployerOption | null;
  onSelect: (employer: EmployerOption | null) => void;
  onAddNew: () => void;
}

const useSearchEmployers = (query: string) => {
  return useQuery<EmployerOption[], Error>({
    queryKey: ['employers', query],
    queryFn: async () => {
      const { data } = await api.get(`/v1/employers/search?q=${query}`);
      return data;
    },
    enabled: query.length > 1,
  });
};

export function EmployerCombobox({ selectedEmployer, onSelect, onAddNew }: EmployerComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { data: employers, isLoading } = useSearchEmployers(searchQuery);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-16 text-base"
        >
          {selectedEmployer ? (
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                {selectedEmployer.logo_url ? (
                  <img src={selectedEmployer.logo_url} alt={selectedEmployer.company_name} className="w-full h-full object-contain rounded-md" />
                ) : (
                  <Building2 className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-semibold">{selectedEmployer.company_name}</p>
                <p className="text-xs text-muted-foreground">Empresa • {selectedEmployer.industry}</p>
              </div>
            </div>
          ) : (
            "Selecciona una empresa..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0">
        <Command>
          <CommandInput 
            placeholder="Busca una empresa..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading && <CommandItem>Buscando...</CommandItem>}
            <CommandEmpty>No se encontró la empresa.</CommandEmpty>
            <CommandGroup>
              {employers?.map((employer) => (
                <CommandItem
                  key={employer.id}
                  value={employer.company_name}
                  onSelect={() => {
                    onSelect(employer);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between data-[selected=true]:bg-gray-100 data-[selected=true]:text-black"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                      {employer.logo_url ? (
                        <img src={employer.logo_url} alt={employer.company_name} className="w-full h-full object-contain rounded-md" />
                      ) : (
                        <Building2 className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p>{employer.company_name}</p>
                      <p className="text-xs text-muted-foreground">Empresa • {employer.industry}</p>
                    </div>
                  </div>
                  <Check className={cn("h-4 w-4", selectedEmployer?.id === employer.id ? "opacity-100" : "opacity-0")} />
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
              Añadir nueva empresa
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
