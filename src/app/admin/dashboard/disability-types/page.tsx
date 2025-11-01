'use client';

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, PlusCircle, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "../components/data-table"
import DisabilityTypeForm from "./components/DisabilityTypeForm"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import {
  useAdminDisabilityTypes,
  useCreateDisabilityType,
  useUpdateDisabilityType,
  useDeleteDisabilityType,
  type DisabilityType,
} from "./hooks/useDisabilityTypes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DisabilityTypesPage() {
  const { data: disabilityTypes, isLoading } = useAdminDisabilityTypes()
  const createMutation = useCreateDisabilityType()
  const updateMutation = useUpdateDisabilityType()
  const deleteMutation = useDeleteDisabilityType()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDisabilityType, setSelectedDisabilityType] = useState<DisabilityType | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DisabilityType | null>(null);

  const handleCreate = () => {
    setSelectedDisabilityType(null)
    setIsModalOpen(true)
  }

  const handleEdit = (disabilityType: DisabilityType) => {
    setSelectedDisabilityType(disabilityType)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (disabilityType: DisabilityType) => {
    setItemToDelete(disabilityType);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }
      });
    }
  };

  const handleSubmit = (values: { name: string; description?: string }) => {
    if (selectedDisabilityType) {
      updateMutation.mutate({ ...selectedDisabilityType, ...values }, { onSuccess: () => setIsModalOpen(false) })
    } else {
      createMutation.mutate(values, { onSuccess: () => setIsModalOpen(false) })
    }
  }

  const columns: ColumnDef<DisabilityType>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ row }) => <div className="text-muted-foreground max-w-md">{row.getValue("description")}</div>,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => {
        const disabilityType = row.original
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent cursor-pointer">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => handleEdit(disabilityType)} className="cursor-pointer ">
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteClick(disabilityType)}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando tipos de discapacidad...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Card className="shadow-md border-border/50 rounded-md">
        <CardHeader className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold tracking-tight">Tipos de Discapacidad</CardTitle>
              <CardDescription className="text-base">
                Gestiona y administra los diferentes tipos de discapacidad del sistema
              </CardDescription>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} size="lg" className="shadow-sm gap-2 cursor-pointer">
                  <PlusCircle className="h-5 w-5" />
                  <span>Crear Nuevo</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {selectedDisabilityType ? "Editar" : "Crear"} Tipo de Discapacidad
                  </DialogTitle>
                </DialogHeader>
                <DisabilityTypeForm
                  onSubmit={handleSubmit}
                  isPending={createMutation.isPending || updateMutation.isPending}
                  defaultValues={selectedDisabilityType || {}}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={disabilityTypes || []} />
        </CardContent>
      </Card>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
        itemName={itemToDelete?.name || ''}
      />
    </div>
  )
}