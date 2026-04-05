"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FolderOpen,
  ChevronRight,
  Pencil,
  Trash2,
  GripVertical,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TreeNode } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { getHostname } from "@/lib/url-utils";

interface TreeNodeDisplayProps {
  node: TreeNode;
  depth: number;
  isSelected: boolean;
  isExpanded: boolean;
  isHovered: boolean;
  isRenaming: boolean;
  renameValue: string;
  onRenameChange: (value: string) => void;
  onRenameSubmit: () => void;
  onRenameKeyDown: (e: React.KeyboardEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggleExpanded: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onToggleFavorite?: () => void;
}

export function TreeNodeDisplay({
  node,
  depth,
  isSelected,
  isExpanded,
  isHovered,
  isRenaming,
  renameValue,
  onRenameChange,
  onRenameSubmit,
  onRenameKeyDown,
  onDoubleClick,
  onClick,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onToggleExpanded,
  onEditClick,
  onDeleteClick,
  onToggleFavorite,
}: TreeNodeDisplayProps) {
  const renameInputRef = React.useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const isFolder = node.type === "FOLDER";
  const childrenCount = node.children?.length ?? 0;

  // Focus rename input when entering rename mode
  React.useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  // Show actions on mobile always, or on hover/selected for larger screens
  const showActions = isMobile || isHovered || isSelected;

  const hostname = getHostname(node.url || "");

  return (
    <div
      className={cn(
        "group flex items-center gap-1 rounded-md px-1 py-1 cursor-pointer text-sm relative",
        "transition-all duration-150 ease-out",
        "hover:bg-accent",
        isSelected
          ? "bg-primary/10 text-primary font-medium hover:bg-primary/15"
          : "",
        // Left border accent for folders vs bookmarks
        isSelected &&
          isFolder &&
          "border-l-2 border-l-amber-500/70 -ml-px pl-1.25",
        isSelected &&
          !isFolder &&
          "border-l-2 border-l-primary/70 -ml-px pl-1.25",
        // Subtle left border hint on hover for non-selected items
        !isSelected &&
          isHovered &&
          isFolder &&
          "border-l-2 border-l-amber-500/30 -ml-px pl-1.25",
        !isSelected &&
          isHovered &&
          !isFolder &&
          "border-l-2 border-l-primary/20 -ml-px pl-1.25",
      )}
      style={{ paddingLeft: `${depth * 16 + 4}px` }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={0}
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={isFolder ? isExpanded : undefined}
    >
      {/* Drag handle - visible on hover */}
      <AnimatePresence>
        {isHovered && !isRenaming && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 14 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex items-center justify-center shrink-0 text-muted-foreground/40 cursor-grab"
          >
            <GripVertical className="size-3" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand/Collapse Chevron */}
      <button
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-sm transition-all duration-200 ease-out",
          isFolder ? "hover:bg-accent-foreground/10" : "invisible",
        )}
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpanded();
        }}
        tabIndex={-1}
      >
        <ChevronRight
          className={cn(
            "size-3.5 text-muted-foreground transition-transform duration-200 ease-out",
            isExpanded && "rotate-90",
          )}
        />
      </button>

      {/* Icon */}
      <div className="shrink-0 mr-1 transition-transform duration-150">
        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="size-4 text-amber-500" />
          ) : (
            <Folder className="size-4 text-amber-500" />
          )
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Image
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                className="size-4 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                alt={node.title || "Bookmark"}
                height={16}
                width={16}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {node.url || "No URL"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Title */}
      {isRenaming ? (
        <input
          ref={renameInputRef}
          value={renameValue}
          onChange={(e) => onRenameChange(e.target.value)}
          onBlur={onRenameSubmit}
          onKeyDown={onRenameKeyDown}
          className="flex-1 min-w-0 text-sm bg-background border border-primary rounded px-1.5 py-0.5 outline-none input-glow transition-shadow duration-200"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span data-node-title className="flex-1 truncate select-none">
          {node.title}
        </span>
      )}

      {/* Children count badge for folders */}
      {isFolder && childrenCount > 0 && !isRenaming && (
        <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 min-w-4.5 text-center shrink-0 tabular-nums group-hover:bg-muted/80 transition-colors duration-150">
          {childrenCount}
        </span>
      )}

      {/* Hover actions - fade in */}
      <AnimatePresence>
        {showActions && !isRenaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex items-center gap-0.5 shrink-0"
          >
            {onToggleFavorite && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "size-6 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-amber-500/10 transition-all duration-150",
                      node.isFavorite && "opacity-100",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite();
                    }}
                    tabIndex={-1}
                  >
                    <Star
                      className={cn(
                        "size-3",
                        node.isFavorite
                          ? "fill-amber-500 text-amber-500"
                          : "text-muted-foreground",
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {node.isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </TooltipContent>
              </Tooltip>
            )}
            {onEditClick && (
              <Button
                variant="ghost"
                size="icon"
                className="size-6 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-primary/10 hover:text-primary transition-all duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick();
                }}
                tabIndex={-1}
              >
                <Pencil className="size-3" />
              </Button>
            )}
            {onDeleteClick && (
              <Button
                variant="ghost"
                size="icon"
                className="size-6 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-destructive/10 transition-all duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick();
                }}
                tabIndex={-1}
              >
                <Trash2 className="size-3 text-destructive" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
