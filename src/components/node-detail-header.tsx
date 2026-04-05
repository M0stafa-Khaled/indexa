"use client";

import * as React from "react";
import { FolderOpen, Globe, Pencil, Trash2, Star, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { BookmarkNode } from "@/types";
import { useTreeStore } from "@/store/tree-store";

interface NodeDetailHeaderProps {
  node: BookmarkNode;
  childrenCount?: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function NodeDetailHeader({
  node,
  childrenCount = 0,
  onEdit,
  onDelete,
  onToggleFavorite,
}: NodeDetailHeaderProps) {
  const isFolder = node.type === "FOLDER";
  const { setSelectedNode } = useTreeStore();

  return (
    <>
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`flex size-10 sm:size-12 items-center justify-center rounded-xl shrink-0 mt-0.5 transition-transform duration-200 ${
            isFolder ? "bg-amber-500/10" : "bg-primary/10"
          }`}
        >
          {isFolder ? (
            <FolderOpen className="size-5 sm:size-6 text-amber-500" />
          ) : (
            <Globe className="size-5 sm:size-6 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h2 className="text-lg sm:text-xl font-semibold leading-tight wrap-break-word">
            {node.title}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={isFolder ? "secondary" : "default"}
              className="text-xs"
            >
              {isFolder ? "Folder" : "Bookmark"}
            </Badge>
            {isFolder && (
              <span className="text-xs text-muted-foreground">
                {childrenCount} item{childrenCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 sm:size-8 hover:bg-primary/10 hover:text-primary transition-colors duration-150"
            onClick={() => setSelectedNode(null)}
            title="Go to home"
          >
            <Home className="size-3.5 sm:size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 sm:size-8 hover:bg-amber-500/10 transition-colors duration-150"
            onClick={onToggleFavorite}
            title={node.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className={`size-3.5 sm:size-4 ${
                node.isFavorite
                  ? "fill-amber-500 text-amber-500"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 sm:size-8 hover:bg-primary/10 hover:text-primary transition-colors duration-150"
            onClick={onEdit}
          >
            <Pencil className="size-3.5 sm:size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 sm:size-8 hover:bg-destructive/10 hover:text-destructive transition-colors duration-150"
            onClick={onDelete}
          >
            <Trash2 className="size-3.5 sm:size-4 text-destructive" />
          </Button>
        </div>
      </div>

      <Separator className="transition-opacity" />
    </>
  );
}
