"use client";

import * as React from "react";
import { Loader2, ArrowRightLeft, FolderOpen, Folder } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTreeStore } from "@/store/tree-store";
import { moveNode, getTreeStructure } from "@/lib/actions";
import type { TreeNode } from "@/types";

interface MoveNodeDialogProps {
  node: TreeNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MoveNodeDialog({
  node,
  open,
  onOpenChange,
}: MoveNodeDialogProps) {
  const [selectedParent, setSelectedParent] = React.useState<string | null>(
    null,
  );
  const [filter, setFilter] = React.useState("");
  const [isMoving, setIsMoving] = React.useState(false);
  const { tree, flatNodes } = useTreeStore();

  React.useEffect(() => {
    if (open) {
      setSelectedParent(node.parentId || null);
      setFilter("");
    }
  }, [open, node]);

  // Collect all folders (except the node being moved and its descendants)
  const collectFolders = React.useCallback(
    (nodes: TreeNode[], excludeIds: Set<string>): TreeNode[] => {
      const result: TreeNode[] = [];
      for (const n of nodes) {
        if (n.type === "FOLDER" && !excludeIds.has(n.id)) {
          result.push(n);
          result.push(...collectFolders(n.children, excludeIds));
        }
      }
      return result;
    },
    [],
  );

  // Build set of node IDs that are descendants of the node being moved
  const getDescendantIds = React.useCallback((n: TreeNode): Set<string> => {
    const ids = new Set<string>();
    ids.add(n.id);
    for (const child of n.children) {
      for (const id of getDescendantIds(child)) {
        ids.add(id);
      }
    }
    return ids;
  }, []);

  const excludeIds = getDescendantIds(node);
  const allFolders = collectFolders(tree, excludeIds);

  const filteredFolders = React.useMemo(() => {
    if (!filter.trim()) return allFolders;
    const lower = filter.toLowerCase();
    return allFolders.filter((f) => f.title.toLowerCase().includes(lower));
  }, [allFolders, filter]);

  // Build path string for a folder
  const getFolderPath = (folderId: string): string => {
    const parts: string[] = [];
    let current = flatNodes.get(folderId);
    while (current) {
      parts.unshift(current.title);
      if (current.parentId) {
        current = flatNodes.get(current.parentId);
      } else {
        break;
      }
    }
    return parts.join(" / ");
  };

  const handleMove = async () => {
    setIsMoving(true);
    try {
      const { node: movedNode, error: moveError } = await moveNode(
        node.id,
        selectedParent || undefined,
      );

      if (moveError) {
        throw new Error(moveError);
      }

      if (!movedNode) {
        throw new Error("Failed to move node");
      }

      // Refresh the tree
      const { tree, error: treeError } = await getTreeStructure();
      if (!treeError && tree) {
        const store = useTreeStore.getState();
        store.setTree(tree);
      }

      toast.success(`"${node.title}" moved successfully`);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="size-5" />
            Move &ldquo;{node.title}&rdquo;
          </DialogTitle>
          <DialogDescription>
            {node.parentId
              ? `Currently in "${flatNodes.get(node.parentId)?.title || "Unknown"}". Select a new location.`
              : "Currently at root level. Select a new location."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Search folders..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
          />

          <ScrollArea className="h-60 rounded-lg border">
            <div className="p-1">
              {/* Root option */}
              <button
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left",
                  selectedParent === null
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-accent",
                )}
                onClick={() => setSelectedParent(null)}
              >
                <Folder className="size-4 text-muted-foreground" />
                <span className="font-medium">Root</span>
                <span className="text-xs text-muted-foreground">
                  — Top level
                </span>
              </button>

              <div className="my-1 h-px bg-border" />

              {filteredFolders.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {filter
                    ? "No folders match your search."
                    : "No folders available."}
                </div>
              )}

              {filteredFolders.map((folder) => (
                <button
                  key={folder.id}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left",
                    selectedParent === folder.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-accent",
                  )}
                  onClick={() => setSelectedParent(folder.id)}
                >
                  <FolderOpen className="size-4 shrink-0 text-amber-500" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{folder.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {getFolderPath(folder.id)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isMoving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            disabled={isMoving || selectedParent === node.parentId}
          >
            {isMoving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <ArrowRightLeft className="mr-2 size-4" />
            )}
            Move Here
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
