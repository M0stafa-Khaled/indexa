"use client";

import { FolderPlus, BookmarkPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Variants, motion } from "framer-motion";

interface EmptyStateProps {
  onNewFolder?: () => void;
  onNewBookmark?: () => void;
  itemVariants: Variants;
}

export function EmptyState({
  onNewFolder,
  onNewBookmark,
  itemVariants,
}: EmptyStateProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="card-hover-lift">
        <CardContent className="p-5 text-center space-y-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted mx-auto">
            <Sparkles className="size-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Start organizing</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Create folders and add bookmarks to build your collection.
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            {onNewFolder && (
              <Button variant="outline" size="sm" onClick={onNewFolder}>
                <FolderPlus className="mr-1.5 size-3.5" />
                New Folder
              </Button>
            )}
            {onNewBookmark && (
              <Button size="sm" onClick={onNewBookmark}>
                <BookmarkPlus className="mr-1.5 size-3.5" />
                New Bookmark
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
