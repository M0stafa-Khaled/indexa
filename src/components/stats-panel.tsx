"use client";

import * as React from "react";
import { useTreeStore } from "@/store/tree-store";
import { StatsCardGrid } from "@/components/stats-card-grid";
import { WelcomeHeroCard } from "@/components/welcome-hero-card";
import { EmptyState } from "@/components/empty-state";
import { RecentItems } from "@/components/recent-items";
import { type Variants, motion } from "framer-motion";

interface StatsPanelProps {
  onNewFolder?: () => void;
  onNewBookmark?: () => void;
}

export function StatsPanel({ onNewFolder, onNewBookmark }: StatsPanelProps) {
  const { flatNodes, setSelectedNode } = useTreeStore();

  const stats = React.useMemo(() => {
    let bookmarkCount = 0;
    let folderCount = 0;
    let favoriteCount = 0;
    const allNodes: Array<{
      id: string;
      title: string;
      type: "BOOKMARK" | "FOLDER";
      createdAt: string;
      url: string | null;
      isFavorite: boolean;
    }> = [];

    flatNodes.forEach((node) => {
      if (node.type === "FOLDER") {
        folderCount++;
      } else {
        bookmarkCount++;
      }
      if (node.isFavorite) favoriteCount++;
      allNodes.push({
        id: node.id,
        title: node.title,
        type: node.type as "BOOKMARK" | "FOLDER",
        createdAt: node.createdAt,
        url: node.url,
        isFavorite: node.isFavorite,
      });
    });

    const recentItems = [...allNodes]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    return { bookmarkCount, folderCount, favoriteCount, recentItems };
  }, [flatNodes]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      className="h-full overflow-y-auto scrollbar-thin"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="p-6 space-y-6">
        {/* Hero Welcome Card */}
        <WelcomeHeroCard
          onNewFolder={onNewFolder}
          onNewBookmark={onNewBookmark}
          itemVariants={itemVariants}
        />

        {/* Stats Grid */}
        <StatsCardGrid stats={stats} itemVariants={itemVariants} />

        {/* Empty State */}
        {stats.bookmarkCount === 0 && stats.folderCount === 0 && (
          <EmptyState
            onNewFolder={onNewFolder}
            onNewBookmark={onNewBookmark}
            itemVariants={itemVariants}
          />
        )}

        {/* Recent Items */}
        <RecentItems
          items={stats.recentItems}
          onSelectItem={setSelectedNode}
          itemVariants={itemVariants}
        />
      </div>
    </motion.div>
  );
}
