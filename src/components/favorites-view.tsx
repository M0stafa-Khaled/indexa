"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, FolderOpen, Globe, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTreeStore } from "@/store/tree-store";
import { getFavorites } from "@/lib/actions";
import { fadeInVariants, fadeInItemVariants } from "@/lib/animation-presets";
import { getHostname } from "@/lib/url-utils";
import { formatDistanceToNow } from "date-fns";
import type { BookmarkNode } from "@/types";

export function FavoritesView() {
  const [items, setItems] = React.useState<BookmarkNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { setSelectedNode } = useTreeStore();

  const fetchFavorites = React.useCallback(async () => {
    try {
      const { nodes, error } = await getFavorites();
      if (!error && nodes) {
        setItems(nodes);
      } else {
        toast.error("Failed to load favorites");
      }
    } catch {
      toast.error("Failed to load favorites");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleSelect = (node: BookmarkNode) => {
    setSelectedNode(node.id);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Loading favorites...
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <motion.div
        className="p-6 space-y-6"
        variants={fadeInVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div
          variants={fadeInItemVariants}
          className="flex items-center gap-3"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
            <Star className="size-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Favorites</h2>
            <p className="text-xs text-muted-foreground">
              {items.length} favorite{items.length !== 1 ? "s" : ""}
            </p>
          </div>
        </motion.div>

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div variants={fadeInItemVariants}>
            <Card>
              <CardContent className="py-12 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                  <Star className="size-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                  No favorites yet
                </h3>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Star your most important bookmarks to find them quickly.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Favorites Grid */}
        {items.length > 0 && (
          <motion.div
            variants={fadeInItemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {items.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:border-primary/50 transition-colors group"
                onClick={() => handleSelect(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0 mt-0.5">
                      {item.type === "FOLDER" ? (
                        <FolderOpen className="size-4 text-amber-500" />
                      ) : (
                        <Globe className="size-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate flex items-center gap-1.5">
                        {item.title}
                        <Star className="size-3 text-amber-500 fill-amber-500 shrink-0" />
                      </div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {item.description}
                        </div>
                      )}
                      {item.url && !item.description && (
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {getHostname(item.url)}
                        </div>
                      )}
                      <div className="text-[10px] text-muted-foreground/70 mt-1">
                        {formatDistanceToNow(new Date(item.updatedAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </motion.div>
    </ScrollArea>
  );
}
