"use server";

import { db } from "@/lib/db";
import { serializeNodes } from "@/lib/serializers";
import { requireAuth } from "../auth";

export const getFavorites = async () => {
  try {
    const userId = await requireAuth();

    const nodes = await db.bookmarkNode.findMany({
      where: {
        userId,
        isFavorite: true,
        deletedAt: null,
      },
      include: {
        parent: {
          select: { id: true, title: true },
        },
      },
      orderBy: [{ updatedAt: "desc" }],
    });

    const parsedNodes = serializeNodes(nodes);

    return { nodes: parsedNodes, error: null };
  } catch (error) {
    console.error("Fetch favorites error:", error);
    return { nodes: null, error: "Internal server error" };
  }
};
