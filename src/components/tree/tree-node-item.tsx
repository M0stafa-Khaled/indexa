"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTreeStore } from "@/store/tree-store";
import { updateNode } from "@/lib/actions";
import type { TreeNode } from "@/types";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { TreeNodeDisplay } from "./tree-node-display";
import { TreeNodeActions } from "./tree-node-actions";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface TreeNodeItemProps {
  node: TreeNode;
  depth: number;
  onSelect: (id: string) => void;
  onEdit: (node: TreeNode) => void;
  onDelete: (node: TreeNode) => void;
  onMove: (node: TreeNode) => void;
  onCreateBookmark?: (parentId: string) => void;
  onCreateFolder?: (parentId: string) => void;
}

export function TreeNodeItem({
  node,
  depth,
  onSelect,
  onEdit,
  onDelete,
  onMove,
  onCreateBookmark,
  onCreateFolder,
}: TreeNodeItemProps) {
  const { selectedNodeId, expandedNodeIds, toggleExpanded, updateNodeInTree } =
    useTreeStore();
  const isExpanded = expandedNodeIds.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const isFolder = node.type === "FOLDER";
  const [isHovered, setIsHovered] = React.useState(false);
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState(node.title);
  const renameInputRef = React.useRef<HTMLInputElement>(null);
  const childrenCount = node.children?.length ?? 0;

  // Focus rename input when entering rename mode
  React.useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  const handleClick = () => {
    if (isRenaming) return;
    onSelect(node.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    // Only rename when double-clicking directly on the title text
    if (isRenaming) return;
    if (isFolder && (e.target as HTMLElement).closest("[data-node-title]")) {
      setIsRenaming(true);
      setRenameValue(node.title);
      return;
    }
    if (isFolder) {
      toggleExpanded(node.id);
    }
  };

  const handleRenameChange = (value: string) => {
    setRenameValue(value);
  };

  const handleRenameSubmit = async () => {
    if (!renameValue.trim() || renameValue === node.title) {
      setIsRenaming(false);
      return;
    }
    try {
      const { node: updated, error } = await updateNode(node.id, {
        title: renameValue.trim(),
      });
      if (error) {
        throw new Error(error);
      }
      if (updated) {
        updateNodeInTree(updated);
        toast.success("Renamed successfully");
      } else {
        toast.error("Failed to rename");
      }
    } catch {
      toast.error("Failed to rename");
    }
    setIsRenaming(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRenameSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setIsRenaming(false);
      setRenameValue(node.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isRenaming) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(node.id);
    }
    if (e.key === "Delete") {
      onDelete(node);
    }
    if (e.key === "ArrowRight" && isFolder && !isExpanded) {
      e.preventDefault();
      toggleExpanded(node.id);
    }
    if (e.key === "ArrowLeft" && isFolder && isExpanded) {
      e.preventDefault();
      toggleExpanded(node.id);
    }
    if (e.key === "F2") {
      e.preventDefault();
      setIsRenaming(true);
      setRenameValue(node.title);
    }
  };

  const handleRenameStart = () => {
    setIsRenaming(true);
    setRenameValue(node.title);
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
          updated.isFavorite ? "Added to favorites" : "Removed from favorites",
        );
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  // Drag-and-drop
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging,
  } = useDraggable({
    id: node.id,
    data: node,
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: node.id,
    data: node,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            ref={(el) => {
              setDraggableRef(el);
              setDroppableRef(el);
            }}
            className={cn(isOver && "bg-accent/50", isDragging && "opacity-50")}
            onContextMenu={handleContextMenu}
            {...attributes}
            {...listeners}
          >
            <TreeNodeDisplay
              node={node}
              depth={depth}
              isSelected={isSelected}
              isExpanded={isExpanded}
              isHovered={isHovered}
              isRenaming={isRenaming}
              renameValue={renameValue}
              onRenameChange={handleRenameChange}
              onRenameSubmit={handleRenameSubmit}
              onRenameKeyDown={handleRenameKeyDown}
              onDoubleClick={handleDoubleClick}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onToggleExpanded={() => toggleExpanded(node.id)}
              onEditClick={() => onEdit(node)}
              onDeleteClick={() => onDelete(node)}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </ContextMenuTrigger>
        <TreeNodeActions
          node={node}
          isFolder={isFolder}
          isRenaming={isRenaming}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
          onRename={handleRenameStart}
          onCreateBookmark={onCreateBookmark}
          onCreateFolder={onCreateFolder}
        />
      </ContextMenu>

      {/* Children - with animation */}
      <AnimatePresence initial={false}>
        {isFolder && isExpanded && childrenCount > 0 && (
          <motion.div
            role="group"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <TreeNodeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
                onCreateBookmark={onCreateBookmark}
                onCreateFolder={onCreateFolder}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
