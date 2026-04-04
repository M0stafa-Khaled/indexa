"use client";

import * as React from "react";
import {
  FolderOpen,
  Bookmark,
  Pencil,
  Trash2,
  ArrowRightLeft,
  BookmarkPlus,
  FolderPlus,
  Copy,
  ExternalLink,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import type { TreeNode } from "@/types";
import { updateNode } from "@/lib/actions";
import { useTreeStore } from "@/store/tree-store";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

interface TreeNodeActionsProps {
  node: TreeNode;
  isFolder: boolean;
  isRenaming: boolean;
  onSelect: (id: string) => void;
  onEdit: (node: TreeNode) => void;
  onDelete: (node: TreeNode) => void;
  onMove: (node: TreeNode) => void;
  onRename: () => void;
  onCreateBookmark?: (parentId: string) => void;
  onCreateFolder?: (parentId: string) => void;
}

export function TreeNodeActions({
  node,
  isFolder,
  isRenaming,
  onSelect,
  onEdit,
  onDelete,
  onMove,
  onRename,
  onCreateBookmark,
  onCreateFolder,
}: TreeNodeActionsProps) {
  const { updateNodeInTree } = useTreeStore();

  const handleCopyUrl = () => {
    if (node.url) {
      navigator.clipboard.writeText(node.url).then(() => {
        toast.success("URL copied to clipboard");
      });
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const { node: updated, error } = await updateNode(node.id, {
        isFavorite: !node.isFavorite,
      });
      if (error) {
        throw new Error(error);
      }
      if (updated) {
        updateNodeInTree(updated);
        toast.success(
          updated.isFavorite
            ? "Added to favorites"
            : "Removed from favorites"
        );
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  if (isRenaming) {
    return null;
  }

  return (
    <ContextMenuContent>
      {/* Navigation */}
      <ContextMenuItem onClick={() => onSelect(node.id)}>
        {isFolder ? (
          <FolderOpen className="mr-2 size-4" />
        ) : (
          <Bookmark className="mr-2 size-4" />
        )}
        Open
      </ContextMenuItem>

      {/* Edit */}
      <ContextMenuItem onClick={onRename}>
        <Pencil className="mr-2 size-4" />
        Rename
      </ContextMenuItem>

      <ContextMenuItem onClick={() => onEdit(node)}>
        <Pencil className="mr-2 size-4" />
        Edit Details...
      </ContextMenuItem>

      <ContextMenuItem onClick={() => onMove(node)}>
        <ArrowRightLeft className="mr-2 size-4" />
        Move to...
      </ContextMenuItem>

      {/* Toggle Favorite */}
      <ContextMenuItem onClick={handleToggleFavorite}>
        <Star
          className={`mr-2 size-4 ${
            node.isFavorite ? "fill-amber-500 text-amber-500" : ""
          }`}
        />
        {node.isFavorite ? "Remove from favorites" : "Add to favorites"}
      </ContextMenuItem>

      <ContextMenuSeparator />

      {/* Copy URL for bookmarks */}
      {!isFolder && node.url && (
        <ContextMenuItem onClick={handleCopyUrl}>
          <Copy className="mr-2 size-4" />
          Copy URL
        </ContextMenuItem>
      )}

      {!isFolder && node.url && (
        <ContextMenuItem
          onClick={() =>
            window.open(node.url!, "_blank", "noopener,noreferrer")
          }
        >
          <ExternalLink className="mr-2 size-4" />
          Open in Browser
        </ContextMenuItem>
      )}

      <ContextMenuSeparator />

      {/* Create actions */}
      {isFolder && (
        <>
          <ContextMenuItem onClick={() => onCreateBookmark?.(node.id)}>
            <BookmarkPlus className="mr-2 size-4" />
            New Bookmark here
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onCreateFolder?.(node.id)}>
            <FolderPlus className="mr-2 size-4" />
            New Folder here
          </ContextMenuItem>
          <ContextMenuSeparator />
        </>
      )}

      {/* Destructive */}
      <ContextMenuItem variant="destructive" onClick={() => onDelete(node)}>
        <Trash2 className="mr-2 size-4" />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
