"use client";

import * as React from "react";
import type { TreeNode } from "@/types";

export const useFindInTree = (
  tree: TreeNode[] | null,
  targetId: string | null,
): TreeNode | null => {
  return React.useMemo(() => {
    if (!targetId || !tree) return null;

    const findInTree = (nodes: TreeNode[]): TreeNode | null => {
      for (const n of nodes) {
        if (n.id === targetId) return n;
        if (n.children && n.children.length > 0) {
          const found = findInTree(n.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInTree(tree);
  }, [tree, targetId]);
};
