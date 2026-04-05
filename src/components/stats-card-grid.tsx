"use client";

import { Bookmark, FolderOpen, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Variants, motion } from "framer-motion";

interface StatsCardGridProps {
  stats: {
    bookmarkCount: number;
    folderCount: number;
    favoriteCount: number;
  };
  itemVariants: Variants;
}

export function StatsCardGrid({ stats, itemVariants }: StatsCardGridProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
    >
      {/* Total Bookmarks Card */}
      <Card className="relative overflow-hidden card-hover-lift">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Bookmark className="size-4 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {stats.bookmarkCount}
          </div>
          <div className="text-xs text-muted-foreground">Bookmarks</div>
        </CardContent>
      </Card>

      {/* Total Folders Card */}
      <Card className="relative overflow-hidden card-hover-lift">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-xl" />
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
              <FolderOpen className="size-4 text-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {stats.folderCount}
          </div>
          <div className="text-xs text-muted-foreground">Folders</div>
        </CardContent>
      </Card>

      {/* Total Favorites Card */}
      <Card className="relative overflow-hidden card-hover-lift">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-xl" />
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-400/10">
              <Star className="size-4 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {stats.favoriteCount}
          </div>
          <div className="text-xs text-muted-foreground">Favorites</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
