"use server";

import { db } from "@/lib/db";
import { moveNodeSchema } from "@/lib/schemas";
import { serializeNode } from "@/lib/serializers";
import { requireAuth } from "../auth";

export const moveNode = async (id: string, newParentId?: string) => {
  try {
    const userId = await requireAuth();

    const result = moveNodeSchema.safeParse({ newParentId });
    if (!result.success) {
      throw new Error(
        `Validation failed: ${JSON.stringify(result.error.flatten().fieldErrors)}`,
      );
    }

    const existing = await db.bookmarkNode.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new Error("Node not found");
    }

    if (result.data.newParentId) {
      if (result.data.newParentId === id) {
        throw new Error("Cannot move a node to itself");
      }

      const newParent = await db.bookmarkNode.findFirst({
        where: {
          id: result.data.newParentId,
          userId,
          type: "FOLDER",
          deletedAt: null,
        },
      });

      if (!newParent) {
        throw new Error("Target folder not found");
      }

      const collectDescendantIds = async (
        parentId: string,
      ): Promise<string[]> => {
        const ids: string[] = [];
        const children = await db.bookmarkNode.findMany({
          where: { parentId, deletedAt: null },
          select: { id: true },
        });
        for (const child of children) {
          ids.push(child.id);
          ids.push(...(await collectDescendantIds(child.id)));
        }
        return ids;
      };

      const descendantIds = await collectDescendantIds(id);
      if (descendantIds.includes(result.data.newParentId)) {
        throw new Error("Cannot move a folder into its own descendant");
      }
    }

    const updated = await db.bookmarkNode.update({
      where: { id },
      data: {
        parentId: result.data.newParentId || null,
      },
    });

    return { node: serializeNode(updated), error: null };
  } catch (error) {
    console.error("Move node error:", error);
    return {
      node: null,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
};
