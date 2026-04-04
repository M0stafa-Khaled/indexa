"use server";

import { db } from "@/lib/db";
import { serializeNode } from "@/lib/serializers";
import { requireAuth } from "../auth";
import type { TreeNode } from "@/types";

export const getTreeStructure = async (): Promise<{
  tree: TreeNode[] | null;
  error: string | null;
}> => {
  try {
    const userId = await requireAuth();

    const nodes = await db.bookmarkNode.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [{ createdAt: "asc" }],
    });

    const parsedNodes = nodes.map((node) => ({
      ...serializeNode(node),
      children: [] as TreeNode[],
    }));

    const nodeMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    parsedNodes.forEach((node) => {
      nodeMap.set(node.id, node);
    });

    parsedNodes.forEach((node) => {
      if (node.parentId && nodeMap.has(node.parentId)) {
        nodeMap.get(node.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return { tree: roots, error: null };
  } catch (error) {
    console.error("Fetch tree error:", error);
    return { tree: null, error: "Internal server error" };
  }
};
