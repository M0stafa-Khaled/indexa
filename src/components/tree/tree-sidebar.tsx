"use client";

import * as React from "react";
import {
  FolderPlus,
  BookmarkPlus,
  ChevronsUpDown,
  ChevronsDownUp,
} from "lucide-react";
import { useTreeStore } from "@/store/tree-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TreeNodeItem } from "@/components/tree/tree-node-item";
import { CreateNodeDialog } from "@/components/tree/create-node-dialog";
import { EditNodeDialog } from "@/components/tree/edit-node-dialog";
import { DeleteNodeDialog } from "@/components/tree/delete-node-dialog";
import { MoveNodeDialog } from "@/components/tree/move-node-dialog";
import { Inbox } from "lucide-react";
import type { TreeNode } from "@/types";

interface TreeSidebarProps {
  onCreateDialogChange?: (open: boolean) => void;
}

export function TreeSidebar({ onCreateDialogChange }: TreeSidebarProps) {
  const { tree, flatNodes, expandedNodeIds, setSelectedNode, setExpanded } =
    useTreeStore();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createType, setCreateType] = React.useState<"folder" | "bookmark">(
    "folder",
  );
  const [createParentId, setCreateParentId] = React.useState<string | null>(
    null,
  );
  const [editNode, setEditNode] = React.useState<TreeNode | null>(null);
  const [deleteNode, setDeleteNode] = React.useState<TreeNode | null>(null);
  const [moveNode, setMoveNode] = React.useState<TreeNode | null>(null);

  const handleNodeSelect = (id: string) => {
    setSelectedNode(id);
  };

  const handleNodeEdit = (node: TreeNode) => {
    setEditNode(node);
  };

  const handleNodeDelete = (node: TreeNode) => {
    setDeleteNode(node);
  };

  const handleNodeMove = (node: TreeNode) => {
    setMoveNode(node);
  };

  const handleNewFolder = () => {
    setCreateType("folder");
    setCreateParentId(null);
    setCreateOpen(true);
  };

  const handleNewBookmark = () => {
    setCreateType("bookmark");
    setCreateParentId(null);
    setCreateOpen(true);
  };

  const handleCreateBookmarkIn = (parentId: string) => {
    setCreateType("bookmark");
    setCreateParentId(parentId);
    setCreateOpen(true);
  };

  const handleCreateFolderIn = (parentId: string) => {
    setCreateType("folder");
    setCreateParentId(parentId);
    setCreateOpen(true);
  };

  const expandAll = () => {
    flatNodes.forEach((node, id) => {
      if (node.type === "FOLDER") {
        setExpanded(id, true);
      }
    });
  };

  const collapseAll = () => {
    flatNodes.forEach((_, id) => {
      setExpanded(id, false);
    });
  };

  const allExpanded = React.useMemo(() => {
    for (const [id, node] of flatNodes) {
      if (node.type === "FOLDER" && !expandedNodeIds.has(id)) {
        return false;
      }
    }
    return true;
  }, [flatNodes, expandedNodeIds]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 justify-start gap-2 text-xs h-8"
            onClick={handleNewFolder}
          >
            <FolderPlus className="size-3.5 text-amber-500" />
            New Folder
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 justify-start gap-2 text-xs h-8"
            onClick={handleNewBookmark}
          >
            <BookmarkPlus className="size-3.5 text-primary" />
            New Bookmark
          </Button>
        </div>

        {tree.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-xs h-7 text-muted-foreground"
            onClick={allExpanded ? collapseAll : expandAll}
          >
            {allExpanded ? (
              <>
                <ChevronsDownUp className="size-3.5" />
                Collapse all
              </>
            ) : (
              <>
                <ChevronsUpDown className="size-3.5" />
                Expand all
              </>
            )}
          </Button>
        )}
      </div>

      <Separator />

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2" role="tree" aria-label="Bookmark tree">
          {tree.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Inbox className="size-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  No bookmarks yet
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Create your first folder or bookmark to get started.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={handleNewFolder}
                >
                  <FolderPlus className="mr-1.5 size-3" />
                  Folder
                </Button>
                <Button
                  size="sm"
                  className="text-xs h-7"
                  onClick={handleNewBookmark}
                >
                  <BookmarkPlus className="mr-1.5 size-3" />
                  Bookmark
                </Button>
              </div>
            </div>
          ) : (
            tree.map((node) => (
              <TreeNodeItem
                key={node.id}
                node={node}
                depth={0}
                onSelect={handleNodeSelect}
                onEdit={handleNodeEdit}
                onDelete={handleNodeDelete}
                onMove={handleNodeMove}
                onCreateBookmark={handleCreateBookmarkIn}
                onCreateFolder={handleCreateFolderIn}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Dialogs */}
      <CreateNodeDialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          onCreateDialogChange?.(open);
        }}
        defaultType={createType}
        parentId={createParentId}
      />
      {editNode && (
        <EditNodeDialog
          node={editNode}
          open={!!editNode}
          onOpenChange={(open) => {
            if (!open) setEditNode(null);
          }}
        />
      )}
      {deleteNode && (
        <DeleteNodeDialog
          node={deleteNode}
          open={!!deleteNode}
          onOpenChange={(open) => {
            if (!open) setDeleteNode(null);
          }}
        />
      )}
      {moveNode && (
        <MoveNodeDialog
          node={moveNode}
          open={!!moveNode}
          onOpenChange={(open) => {
            if (!open) setMoveNode(null);
          }}
        />
      )}
    </div>
  );
}
