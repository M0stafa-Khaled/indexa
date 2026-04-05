"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Trash, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { TrashItemCard } from "./trash-item-card";
import { getTrash, restoreNode, permanentDeleteNode } from "@/lib/actions";
import type { BookmarkNode } from "@/types";

interface TrashViewProps {
  onRestored?: () => void;
}

export function TrashView({ onRestored }: TrashViewProps) {
  const [items, setItems] = React.useState<BookmarkNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [permanentDeleteId, setPermanentDeleteId] = React.useState<
    string | null
  >(null);
  const [emptyTrashOpen, setEmptyTrashOpen] = React.useState(false);
  const [isRestoring, setIsRestoring] = React.useState<string | null>(null);

  const fetchTrash = React.useCallback(async () => {
    try {
      const { nodes, error } = await getTrash();
      if (!error && nodes) {
        setItems(nodes);
      } else {
        toast.error("Failed to load trash");
      }
    } catch {
      toast.error("Failed to load trash");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  const handleRestore = async (id: string) => {
    setIsRestoring(id);
    try {
      const { node, error } = await restoreNode(id);
      if (!error && node) {
        toast.success("Item restored successfully");
        await fetchTrash();
        onRestored?.();
      } else {
        toast.error("Failed to restore item");
      }
    } catch {
      toast.error("Failed to restore item");
    } finally {
      setIsRestoring(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!permanentDeleteId) return;
    try {
      const { success, error } = await permanentDeleteNode(permanentDeleteId);
      if (!error && success) {
        toast.success("Permanently deleted");
        setItems((prev) =>
          prev.filter((item) => item.id !== permanentDeleteId),
        );
      } else {
        toast.error("Failed to delete item");
      }
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setPermanentDeleteId(null);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await Promise.all(items.map((item) => permanentDeleteNode(item.id)));
      toast.success("Trash emptied");
      setItems([]);
      onRestored?.();
    } catch {
      toast.error("Failed to empty trash");
    } finally {
      setEmptyTrashOpen(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground">
          Loading trash...
        </div>
      </div>
    );
  }

  return (
    <div className="size-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
      <motion.div
        className="p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
              <Trash2 className="size-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Trash</h2>
              <p className="text-xs text-muted-foreground">
                {items.length} item{items.length !== 1 ? "s" : ""} in trash
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 text-destructive hover:text-destructive"
              onClick={() => setEmptyTrashOpen(true)}
            >
              <Trash className="size-3.5" />
              Empty Trash
            </Button>
          )}
        </motion.div>

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="py-12 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                  <Trash2 className="size-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Trash is empty
                </h3>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Deleted items will appear here. You can restore or permanently
                  delete them.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Trash Items */}
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-0 divide-y">
                  {items.map((item) => (
                    <TrashItemCard
                      key={item.id}
                      item={item}
                      onRestore={handleRestore}
                      onDelete={setPermanentDeleteId}
                      isRestoring={isRestoring === item.id}
                    />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog
        open={!!permanentDeleteId}
        onOpenChange={(open) => {
          if (!open) setPermanentDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-destructive" />
              Permanently delete?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The item and all its children will
              be permanently removed from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              className="bg-destructive! text-destructive-foreground! hover:bg-destructive/90!"
            >
              Delete forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty Trash Confirmation Dialog */}
      <AlertDialog open={emptyTrashOpen} onOpenChange={setEmptyTrashOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-destructive" />
              Empty trash?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {items.length} item
              {items.length !== 1 ? "s" : ""} in the trash. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmptyTrash}
              className="bg-destructive! text-destructive-foreground! hover:bg-destructive/90!"
            >
              Empty trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
