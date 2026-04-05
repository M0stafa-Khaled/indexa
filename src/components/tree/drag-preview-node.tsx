"use client";

import * as React from "react";
import { Folder, Bookmark, GripVertical } from "lucide-react";
import type { BookmarkNode } from "@/types";
import { cn } from "@/lib/utils";

interface DragPreviewNodeProps {
  node: BookmarkNode;
}

export function DragPreviewNode({ node }: DragPreviewNodeProps) {
  const icon =
    node.type === "FOLDER" ? (
      <Folder className="size-4 shrink-0 text-amber-500" />
    ) : (
      <Bookmark className="size-4 shrink-0 text-primary" />
    );

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm bg-background border shadow-lg"
      )}
    >
      <GripVertical className="size-4 text-muted-foreground shrink-0" />
      {icon}
      <span className="truncate font-medium">{node.title}</span>
    </div>
  );
}
