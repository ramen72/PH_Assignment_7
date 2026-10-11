// const page = () => {
  
//   return (
//     <div>
//       <h1>Asset Categories</h1>
//     </div>
//   );
// };

// export default page;



"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Tags,
  Package,
  ClipboardList,
  Loader2,
} from "lucide-react";

import {
  useCreateAssetCategory,
  useDeleteAssetCategory,
  useGetAllAssetCategories,
  useUpdateAssetCategory,
} from "@/hooks";

// import type {
//   AssetCategory,
//   AssetCategoryPayload,
// } from "@/api/assetCategories.api";

// import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AssetCategory, AssetCategoryPayload, AssetCategoryResponse } from "@/types";
import { toast } from "@/components/ui/toast";


export default function AssetCategoriesPage() {
  // const { toast } = useToast();

  const { data, isLoading, isError, error } =
    useGetAllAssetCategories();

  const createMutation = useCreateAssetCategory();
  const updateMutation = useUpdateAssetCategory();
  const deleteMutation = useDeleteAssetCategory();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<AssetCategory | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<AssetCategory | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");

  // Adjust this extraction if apiClient returns a
  // different response shape.
  const response = data as AssetCategoryResponse | undefined;
  const categories = response?.data ?? [];

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        (category.description ?? "")
          .toLowerCase()
          .includes(term),
    );
  }, [categories, search]);

  const totalAssets = categories.reduce(
    (total, category) =>
      total + (category._count?.assets ?? 0),
    0,
  );

  const totalRequests = categories.reduce(
    (total, category) =>
      total + (category._count?.assetRequests ?? 0),
    0,
  );

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingCategory(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (category: AssetCategory) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description ?? "");
    setDialogOpen(true);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.add({
        type:"error",
        title: "Category name is required",
      });
      return;
    }

    const payload: AssetCategoryPayload = {
      name: trimmedName,
      description: description.trim() || undefined,
    };

    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          payload,
        });

        toast.add({
          type:"success",
          title: "Category updated successfully",
        });
      } else {
        await createMutation.mutateAsync(payload);

        toast.add({
          type:"success",
          title: "Category created successfully",
        });
      }

      setDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.add({
        type:"error",
        title: "Operation failed",
        description:
          err instanceof Error
            ? err.message
            : "Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);

      toast.add({
          type:"success",
        title: "Category deleted successfully",
      });

      setDeleteTarget(null);
    } catch (err) {
      toast.add({
        type:"error",
        title: "Unable to delete category",
        description:
          err instanceof Error
            ? err.message
            : "The category may have associated assets or requests.",
      });
    }
  };

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Tags className="size-6 text-[#f15825]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Asset Categories
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage and organize your company asset categories.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-[#0d719e] hover:bg-[#095b80]"
        >
          <Plus className="mr-2 size-4" />
          Add Category
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Categories
              </p>
              <p className="mt-2 text-2xl font-bold">
                {categories.length}
              </p>
            </div>
            <Tags className="size-8 text-[#0d719e]" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Associated Assets
              </p>
              <p className="mt-2 text-2xl font-bold">
                {totalAssets}
              </p>
            </div>
            <Package className="size-8 text-emerald-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Asset Requests
              </p>
              <p className="mt-2 text-2xl font-bold">
                {totalRequests}
              </p>
            </div>
            <ClipboardList className="size-8 text-amber-600" />
          </CardContent>
        </Card>
      </div>

      {/* Categories table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-7 animate-spin text-[#0d719e]" />
            </div>
          ) : isError ? (
            <div className="py-10 text-center">
              <p className="font-medium text-destructive">
                Failed to load categories
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Please try again later."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">
                      Assets
                    </TableHead>
                    <TableHead className="text-center">
                      Requests
                    </TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-muted-foreground"
                      >
                        {search
                          ? "No matching categories found."
                          : "No categories available. Add your first category."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0d719e]/10">
                              <Tags className="size-4 text-[#0d719e]" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {category.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {category.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="max-w-xs">
                          <p className="truncate text-sm text-muted-foreground">
                            {category.description || "—"}
                          </p>
                        </TableCell>

                        <TableCell className="text-center">
                          {category._count?.assets ?? 0}
                        </TableCell>

                        <TableCell className="text-center">
                          {category._count?.assetRequests ?? 0}
                        </TableCell>

                        <TableCell>
                          {new Date(
                            category.createdAt,
                          ).toLocaleDateString("en-GB")}
                        </TableCell>

                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              aria-label={`Edit ${category.name}`}
                              onClick={() =>
                                openEditDialog(category)
                              }
                            >
                              <Pencil className="size-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              aria-label={`Delete ${category.name}`}
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() =>
                                setDeleteTarget(category)
                              }
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && !isError && (
            <p className="mt-4 text-sm text-muted-foreground">
              Showing {filteredCategories.length} of{" "}
              {categories.length} categories
            </p>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? "Edit Category"
                : "Create Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="category-name"
                className="text-sm font-medium"
              >
                Category Name *
              </label>
              <Input
                id="category-name"
                placeholder="e.g. Laptop"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                maxLength={100}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category-description"
                className="text-sm font-medium"
              >
                Description
              </label>
              <Textarea
                id="category-description"
                placeholder="Describe this category..."
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving || !name.trim()}
                className="bg-[#0d719e] hover:bg-[#095b80]"
              >
                {isSaving && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this category?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete{" "}
              <strong>{deleteTarget?.name}</strong>. This action
              cannot be undone. Categories linked to assets or
              asset requests cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
