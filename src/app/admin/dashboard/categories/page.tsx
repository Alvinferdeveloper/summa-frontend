
'use client';

import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from "../components/data-table";
import CategoryForm from "./components/CategoryForm";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  type Category,
} from "./hooks/useCategories";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Category | null>(null);

  const handleCreate = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Category) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: Category) => {
    setItemToDelete(item);
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

  const handleSubmit = (values: { name: string }) => {
    if (selectedItem) {
      updateMutation.mutate({ ...selectedItem, ...values }, { onSuccess: () => setIsModalOpen(false) });
    } else {
      createMutation.mutate(values, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  const columns: ColumnDef<Category>[] = [
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
      id: "actions",
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => {
        const item = row.original;
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
                <DropdownMenuItem onClick={() => handleEdit(item)} className='cursor-pointer'>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteClick(item)} className="text-red-500 cursor-pointer">Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
        itemName={itemToDelete?.name || ''}
      />
      <Card className="shadow-md border-border/50 rounded-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">Categorías</CardTitle>
              <CardDescription>Gestiona las categorías de empleo del sistema.</CardDescription>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} size="lg" className='cursor-pointer'><PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedItem ? 'Editar' : 'Crear'} Categoría</DialogTitle>
                </DialogHeader>
                <CategoryForm
                  onSubmit={handleSubmit}
                  isPending={createMutation.isPending || updateMutation.isPending}
                  defaultValues={selectedItem || {}}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={categories || []} />
        </CardContent>
      </Card>
    </div>
  );
}
