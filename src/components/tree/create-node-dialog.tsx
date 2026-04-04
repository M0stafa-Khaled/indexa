"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, FolderPlus, BookmarkPlus } from "lucide-react";
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
import { createFolderSchema, createBookmarkSchema } from "@/lib/schemas";
import { useTreeStore } from "@/store/tree-store";
import { createNode } from "@/lib/actions";
import type { BookmarkNode } from "@/types";

interface CreateNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: "folder" | "bookmark";
  parentId?: string | null;
}

type FolderFormValues = {
  title: string;
  description?: string;
  parentId?: string;
};

type BookmarkFormValues = {
  title: string;
  description?: string;
  url?: string;
  parentId?: string;
};

export function CreateNodeDialog({
  open,
  onOpenChange,
  defaultType = "folder",
  parentId: propParentId,
}: CreateNodeDialogProps) {
  const [type, setType] = React.useState<"folder" | "bookmark">(defaultType);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { selectedNodeId, addNode } = useTreeStore();

  React.useEffect(() => {
    if (open) setType(defaultType);
  }, [open, defaultType]);

  const folderForm = useForm<FolderFormValues>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      title: "",
      description: "",
      parentId: propParentId ?? selectedNodeId ?? undefined,
    },
  });

  const bookmarkForm = useForm<BookmarkFormValues>({
    resolver: zodResolver(createBookmarkSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      parentId: propParentId ?? selectedNodeId ?? undefined,
    },
  });

  const handleClose = () => {
    folderForm.reset();
    bookmarkForm.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: FolderFormValues | BookmarkFormValues) => {
    setIsSubmitting(true);
    try {
      const { node, error } = await createNode({
        type,
        parentId:
          values.parentId || propParentId || selectedNodeId || undefined,
        title: values.title,
        description: values.description || undefined,
        url:
          type === "bookmark" && "url" in values
            ? values.url || undefined
            : undefined,
      });

      if (error) {
        throw new Error(error);
      }

      if (!node) {
        throw new Error("Failed to create node");
      }

      addNode(
        node as BookmarkNode,
        values.parentId || propParentId || selectedNodeId || null,
      );
      toast.success(
        `${type === "folder" ? "Folder" : "Bookmark"} created successfully`,
      );
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentForm = type === "folder" ? folderForm : bookmarkForm;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "folder" ? (
              <FolderPlus className="size-5 text-amber-500" />
            ) : (
              <BookmarkPlus className="size-5 text-primary" />
            )}
            New {type === "folder" ? "Folder" : "Bookmark"}
          </DialogTitle>
          <DialogDescription>
            {type === "folder"
              ? "Create a new folder to organize your bookmarks."
              : "Add a new bookmark to your collection."}
          </DialogDescription>
        </DialogHeader>

        {/* Type Toggle */}
        <div className="flex rounded-lg border bg-muted p-1">
          <button
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              type === "folder"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setType("folder")}
          >
            <FolderPlus className="size-4" />
            Folder
          </button>
          <button
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              type === "bookmark"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setType("bookmark")}
          >
            <BookmarkPlus className="size-4" />
            Bookmark
          </button>
        </div>

        <Form {...currentForm}>
          <form
            onSubmit={
              type === "folder"
                ? folderForm.handleSubmit(onSubmit)
                : bookmarkForm.handleSubmit(onSubmit)
            }
            className="space-y-4"
          >
            <FormField
              control={currentForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        type === "folder" ? "My Folder" : "My Bookmark"
                      }
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={currentForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === "bookmark" && (
              <FormField
                control={bookmarkForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        type="url"
                        {...field}
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
                  <Plus className="mr-2 size-4" />
                )}
                Create {type === "folder" ? "Folder" : "Bookmark"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
