"use client";

import { motion } from "framer-motion";
import { FolderOpen, Globe, RotateCcw, Trash, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import type { BookmarkNode } from "@/types";

interface TrashItemCardProps {
  item: BookmarkNode;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  isRestoring?: boolean;
}

export function TrashItemCard({
  item,
  onRestore,
  onDelete,
  isRestoring = false,
}: TrashItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 px-4 py-3"
    >
      <div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0">
        {item.type === "FOLDER" ? (
          <FolderOpen className="size-4 text-amber-500" />
        ) : (
          <Globe className="size-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{item.title}</div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
          <Clock className="size-3" />
          <span>
            Deleted{" "}
            {item.deletedAt
              ? formatDistanceToNow(new Date(item.deletedAt), {
                  addSuffix: true,
                })
              : "unknown"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() => onRestore(item.id)}
          disabled={isRestoring}
        >
          <RotateCcw className="size-3" />
          Restore
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-destructive hover:text-destructive!"
          onClick={() => onDelete(item.id)}
        >
          <Trash className="size-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
