"use server";

import { db } from "@/lib/db";
import { searchNodesSchema } from "@/lib/schemas";
import { requireAuth } from "../auth";
import { serializeNodes } from "../serializers";

export const searchNodes = async (query: string, type?: string) => {
  try {
    const userId = await requireAuth();

    const result = searchNodesSchema.safeParse({
      query,
      type: type || undefined,
    });
    if (!result.success) {
      throw new Error(
        `Validation failed: ${JSON.stringify(result.error.flatten().fieldErrors)}`,
      );
    }

    const where: Record<string, unknown> = {
      userId,
      deletedAt: null,
    };

    if (result.data.type) {
      where.type = result.data.type;
    }

    if (result.data.query) {
      where.OR = [
        { title: { contains: result.data.query } },
        { description: { contains: result.data.query } },
        { url: { contains: result.data.query } },
      ];
    }

    const nodes = await db.bookmarkNode.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      include: {
        parent: {
          select: { id: true, title: true },
        },
      },
    });

    return { nodes: serializeNodes(nodes), error: null };
  } catch (error) {
    console.error("Search nodes error:", error);
    return {
      nodes: null,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
};
