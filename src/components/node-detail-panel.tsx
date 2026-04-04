"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTreeStore } from "@/store/tree-store";
import { updateNode } from "@/lib/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatsPanel } from "@/components/stats-panel";
import { NodeDetailHeader } from "@/components/node-detail-header";
import { NodeDetailInfo } from "@/components/node-detail-info";
import { NodeDetailChildren } from "@/components/node-detail-children";
import type { TreeNode } from "@/types";

interface NodeDetailPanelProps {
  onEdit: () => void;
  onDelete: () => void;
  onNewFolder?: () => void;
  onNewBookmark?: () => void;
}

export function NodeDetailPanel({
  onEdit,
  onDelete,
  onNewFolder,
  onNewBookmark,
}: NodeDetailPanelProps) {
  const { selectedNodeId, flatNodes, tree, updateNodeInTree } = useTreeStore();

  const node = selectedNodeId ? flatNodes.get(selectedNodeId) : null;

  const handleToggleFavorite = async () => {
    if (!node) return;
    try {
      const { node: updated, error } = await updateNode(node.id, {
        isFavorite: !node.isFavorite,
      });
      if (error) {
        throw new Error(error);
      }
      if (updated) {
        updateNodeInTree(updated);
        toast.success(
          updated.isFavorite
            ? "Added to favorites"
            : "Removed from favorites"
        );
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  // Compute children count from tree (TreeNode), not flat store
  const selectedTreeNode = React.useMemo((): TreeNode | null => {
    if (!selectedNodeId) return null;
    const findInTree = (nodes: TreeNode[]): TreeNode | null => {
      for (const n of nodes) {
        if (n.id === selectedNodeId) return n;
        if (n.children) {
          const found = findInTree(n.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInTree(tree);
  }, [selectedNodeId, tree]);

  const childrenCount = selectedTreeNode?.children?.length ?? 0;

  // Empty state - show stats panel
  if (!node || !selectedTreeNode) {
    return (
      <StatsPanel onNewFolder={onNewFolder} onNewBookmark={onNewBookmark} />
    );
  }

  const isFolder = node.type === "FOLDER";

  const slideInVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };

  return (
    <ScrollArea className="h-full scrollbar-thin">
      <motion.div
        className="p-6 space-y-6"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideInVariants}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <NodeDetailHeader
          node={node}
          childrenCount={childrenCount}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={handleToggleFavorite}
        />

        <NodeDetailInfo node={node} />

        {isFolder && (
          <NodeDetailChildren
            node={selectedTreeNode}
            childrenCount={childrenCount}
            onNewFolder={onNewFolder}
            onNewBookmark={onNewBookmark}
          />
        )}
      </motion.div>
    </ScrollArea>
  );
}
