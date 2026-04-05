"use client";

import { FolderOpen, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { type Variants, motion } from "framer-motion";
import Image from "next/image";
import { getHostname } from "@/lib/url-utils";

interface RecentItem {
  id: string;
  title: string;
  type: "FOLDER" | "BOOKMARK";
  createdAt: string;
  url: string | null;
  isFavorite: boolean;
}

interface RecentItemsProps {
  items: RecentItem[];
  onSelectItem: (id: string) => void;
  itemVariants: Variants;
}

export function RecentItems({
  items,
  onSelectItem,
  itemVariants,
}: RecentItemsProps) {
  if (items.length === 0) return null;

  return (
    <motion.div variants={itemVariants}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Recently Added</h3>
        </div>
        <Card>
          <CardContent className="p-0 divide-y">
            {items.map((item) => (
              <button
                key={item.id}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-accent/50 transition-all duration-150 group"
                onClick={() => onSelectItem(item.id)}
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0 group-hover:scale-105 transition-transform duration-150">
                  {item.type === "FOLDER" ? (
                    <FolderOpen className="size-4 text-amber-500" />
                  ) : (
                    <Image
                      src={`https://www.google.com/s2/favicons?domain=${getHostname(item.url || "")}&sz=64`}
                      className="size-4 rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                      alt={item.title || "Bookmark"}
                      height={16}
                      width={16}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {item.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-150 group-hover:translate-x-0.5" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
