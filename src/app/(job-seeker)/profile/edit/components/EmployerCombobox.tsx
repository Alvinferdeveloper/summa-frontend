
'use client';

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSearchEmployers } from "../hooks/useSearchEmployers";

export interface EmployerOption {
  id: number;
  company_name: string;
  logo_url?: string;
  industry?: string;
  isNew?: boolean;
}

interface EmployerComboboxProps {
  selectedEmployer: EmployerOption | null;
  onSelect: (employer: EmployerOption | null) => void;
  onAddNew: () => void;
}


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
          className="w-full justify-between bg-primary hover:bg-primary/80 h-16 text-white"
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
                <p className="text-xs text-muted">Empresa • {selectedEmployer.industry}</p>
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
                  className="group flex items-center justify-between data-[selected=true]:bg-primary [&:hover]:bg-primary/80 data-[active]:bg-primary h-16"
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
                      <p>Empresa • {employer.industry}</p>
                    </div>
                  </div>
                  <Check className={cn("h-4 w-4 mr-3 text-primary [.group:hover_&]:text-muted", selectedEmployer?.id === employer.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandItem
              onSelect={() => {
                onAddNew();
                setOpen(false);
              }}
              className="font-semibold !bg-primary text-muted"
            >
              <PlusCircle className="mr-2 h-4 w-4 text-muted" />
              Añadir nueva empresa
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
