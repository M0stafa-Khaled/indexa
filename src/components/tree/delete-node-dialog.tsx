"use client";

import * as React from "react";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
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
import { useTreeStore } from "@/store/tree-store";
import { deleteNode } from "@/lib/actions";
import type { TreeNode } from "@/types";

interface DeleteNodeDialogProps {
  node: TreeNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteNodeDialog({
  node,
  open,
  onOpenChange,
}: DeleteNodeDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { removeNode } = useTreeStore();

  const countDescendants = (n: TreeNode): number => {
    let count = n.children.length;
    for (const child of n.children) {
      count += countDescendants(child);
    }
    return count;
  };

  const descendantCount = node.type === "FOLDER" ? countDescendants(node) : 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { success, error } = await deleteNode(node.id);

      if (error) {
        throw new Error(error);
      }

      if (!success) {
        throw new Error("Failed to delete node");
      }

      removeNode(node.id);
      toast.success(`"${node.title}" has been deleted`);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            Delete {node.type === "FOLDER" ? "Folder" : "Bookmark"}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  &ldquo;{node.title}&rdquo;
                </span>
                ? This action cannot be undone.
              </p>
              {node.type === "FOLDER" && descendantCount > 0 && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <AlertTriangle className="size-4 shrink-0 text-destructive mt-0.5" />
                  <p className="text-sm text-destructive">
                    <span className="font-medium">Warning:</span> This folder
                    contains {descendantCount} item
                    {descendantCount !== 1 ? "s" : ""} that will also be
                    deleted.
                  </p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            variant="outline"
            size="default"
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            size="default"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-white hover:bg-destructive/90 focus-visible:ring-destructive/20"
          >
            {isDeleting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 size-4" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
