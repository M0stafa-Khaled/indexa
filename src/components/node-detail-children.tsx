"use client";

import {
  FolderOpen,
  Bookmark,
  Layers,
  BookmarkPlus,
  FolderPlus,
  ArrowRight,
} from "lucide-react";
import { useTreeStore } from "@/store/tree-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TreeNode } from "@/types";

interface NodeDetailChildrenProps {
  node: TreeNode;
  childrenCount: number;
  onNewFolder?: () => void;
  onNewBookmark?: () => void;
}

export function NodeDetailChildren({
  node,
  childrenCount,
  onNewFolder,
  onNewBookmark,
}: NodeDetailChildrenProps) {
  const { setSelectedNode } = useTreeStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Layers className="size-4" />
          Contents
        </div>
        <div className="flex items-center gap-1.5">
          {onNewBookmark && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors duration-150"
              onClick={onNewBookmark}
            >
              <BookmarkPlus className="size-3" />
              Bookmark
            </Button>
          )}
          {onNewFolder && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/30 transition-colors duration-150"
              onClick={onNewFolder}
            >
              <FolderPlus className="size-3" />
              Folder
            </Button>
          )}
        </div>
      </div>

      {childrenCount === 0 ? (
        <div className="text-center py-8 rounded-lg border border-dashed">
          <FolderOpen className="size-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">Empty folder</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Create a bookmark or folder inside this folder
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold tabular-nums">
              {childrenCount}
            </div>
            <div className="text-xs text-muted-foreground">
              item{childrenCount !== 1 ? "s" : ""} in this folder
            </div>
          </div>

          <Card>
            <CardContent className="p-0 divide-y">
              {node.children?.slice(0, 8).map((child) => (
                <button
                  key={child.id}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-accent/50 transition-all duration-150 group"
                  onClick={() => setSelectedNode(child.id)}
                >
                  <div className="flex size-7 items-center justify-center rounded-md bg-muted shrink-0 group-hover:scale-105 transition-transform duration-150">
                    {child.type === "FOLDER" ? (
                      <FolderOpen className="size-3.5 text-amber-500" />
                    ) : (
                      <Bookmark className="size-3.5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{child.title}</div>
                    {child.url && (
                      <div className="text-xs text-muted-foreground truncate">
                        {(() => {
                          try {
                            return new URL(child.url).hostname;
                          } catch {
                            return child.url;
                          }
                        })()}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-150 group-hover:translate-x-0.5" />
                </button>
              ))}
              {childrenCount > 8 && (
                <div className="px-3 py-2.5 text-center">
                  <span className="text-xs text-muted-foreground">
                    + {childrenCount - 8} more item
                    {childrenCount - 8 !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
