"use server";

import { db } from "@/lib/db";
import { serializeNode, serializeNodes } from "@/lib/serializers";
import { requireAuth } from "../auth";

export const getTrash = async () => {
  try {
    const userId = await requireAuth();

    const nodes = await db.bookmarkNode.findMany({
      where: {
        userId,
        deletedAt: { not: null },
      },
      orderBy: [{ deletedAt: "desc" }],
    });

    return { nodes: serializeNodes(nodes), error: null };
  } catch (error) {
    console.error("Fetch trash error:", error);
    return { nodes: null, error: "Internal server error" };
  }
};

export const restoreNode = async (id: string) => {
  try {
    const userId = await requireAuth();

    const existing = await db.bookmarkNode.findFirst({
      where: {
        id,
        userId,
        deletedAt: { not: null },
      },
    });

    if (!existing) {
      throw new Error("Node not found in trash");
    }

    const collectDescendantIds = async (nodeId: string): Promise<string[]> => {
      const ids: string[] = [nodeId];
      const children = await db.bookmarkNode.findMany({
        where: { parentId: nodeId, deletedAt: { not: null } },
        select: { id: true },
      });
      for (const child of children) {
        const childIds = await collectDescendantIds(child.id);
        ids.push(...childIds);
      }
      return ids;
    };

    const allIds = await collectDescendantIds(id);
    await db.bookmarkNode.updateMany({
      where: { id: { in: allIds } },
      data: { deletedAt: null },
    });

    const restored = await db.bookmarkNode.findUnique({
      where: { id },
    });

    return {
      node: restored ? serializeNode(restored) : null,
      error: null,
    };
  } catch (error) {
    console.error("Restore node error:", error);
    return {
      node: null,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
};

export const permanentDeleteNode = async (id: string) => {
  try {
    const userId = await requireAuth();

    const existing = await db.bookmarkNode.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      throw new Error("Node not found");
    }

    const collectDescendantIds = async (nodeId: string): Promise<string[]> => {
      const ids: string[] = [nodeId];
      const children = await db.bookmarkNode.findMany({
        where: { parentId: nodeId },
        select: { id: true },
      });
      for (const child of children) {
        const childIds = await collectDescendantIds(child.id);
        ids.push(...childIds);
      }
      return ids;
    };

    const allIds = await collectDescendantIds(id);

    await db.bookmarkNode.deleteMany({
      where: { id: { in: allIds } },
    });

    return { success: true, deleted: allIds.length, error: null };
  } catch (error) {
    console.error("Permanent delete error:", error);
    return {
      success: false,
      deleted: 0,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
};
