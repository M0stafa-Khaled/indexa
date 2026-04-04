"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, FolderOpen, Bookmark } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateNodeSchema } from "@/lib/schemas";
import { useTreeStore } from "@/store/tree-store";
import { updateNode } from "@/lib/actions";
import type { TreeNode, BookmarkNode } from "@/types";

interface EditNodeDialogProps {
  node: TreeNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type EditFormValues = {
  title?: string;
  description?: string | null;
  url?: string | null;
};

export function EditNodeDialog({
  node,
  open,
  onOpenChange,
}: EditNodeDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { updateNodeInTree } = useTreeStore();

  const form = useForm<EditFormValues>({
    resolver: zodResolver(updateNodeSchema),
    defaultValues: {
      title: node.title,
      description: node.description || "",
      url: node.url || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        title: node.title,
        description: node.description || "",
        url: node.url || "",
      });
    }
  }, [open, node, form]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: EditFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {};
      if (values.title) payload.title = values.title;
      if (values.description !== undefined)
        payload.description = values.description || undefined;
      if (node.type === "BOOKMARK" && values.url !== undefined) {
        payload.url = values.url || undefined;
      }

      const { node: updatedNode, error } = await updateNode(node.id, payload);

      if (error) {
        throw new Error(error);
      }

      if (!updatedNode) {
        throw new Error("Failed to update node");
      }

      updateNodeInTree(updatedNode as BookmarkNode);
      toast.success("Updated successfully");
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {node.type === "FOLDER" ? (
              <FolderOpen className="size-5 text-amber-500" />
            ) : (
              <Bookmark className="size-5 text-primary" />
            )}
            Edit {node.type === "FOLDER" ? "Folder" : "Bookmark"}
          </DialogTitle>
          <DialogDescription>
            Update the details of &ldquo;{node.title}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {node.type === "BOOKMARK" && (
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        type="url"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Pencil className="mr-2 size-4" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
