"use server";

import { db } from "@/lib/db";
import {
  createFolderSchema,
  createBookmarkSchema,
  updateNodeSchema,
} from "@/lib/schemas";
import { serializeNode, serializeNodes } from "@/lib/serializers";
import { requireAuth } from "../auth";

export const getAllNodes = async () => {
  try {
    const userId = await requireAuth();

    const nodes = await db.bookmarkNode.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [{ createdAt: "asc" }],
    });

    return { nodes: serializeNodes(nodes), error: null };
  } catch (error) {
    console.error("Fetch nodes error:", error);
    return { nodes: null, error: "Internal server error" };
  }
};

export const getNode = async (id: string) => {
  try {
    const userId = await requireAuth();

    const node = await db.bookmarkNode.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        parent: {
          select: { id: true, title: true },
        },
        children: {
          where: { deletedAt: null },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!node) {
      throw new Error("Node not found");
    }

    return {
      node: serializeNode(node),
      error: null,
    };
  } catch (error) {
    console.error("Fetch node error:", error);
    return { node: null, error: "Node not found" };
  }
};

export const createNode = async (body: {
  type: "folder" | "bookmark";
  title: string;
  description?: string;
  url?: string;
  parentId?: string;
}) => {
  try {
    const userId = await requireAuth();

    if (body.type === "folder") {
      const result = createFolderSchema.safeParse(body);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${JSON.stringify(result.error.flatten().fieldErrors)}`,
        );
      }

      if (result.data.parentId) {
        const parent = await db.bookmarkNode.findFirst({
          where: {
            id: result.data.parentId,
            userId,
            type: "FOLDER",
            deletedAt: null,
          },
        });
        if (!parent) {
          throw new Error("Parent folder not found");
        }
      }

      const node = await db.bookmarkNode.create({
        data: {
          userId,
          parentId: result.data.parentId || null,
          type: "FOLDER",
          title: result.data.title,
          description: result.data.description,
        },
      });

      return { node: serializeNode(node), error: null };
    }

    if (body.type === "bookmark") {
      const result = createBookmarkSchema.safeParse(body);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${JSON.stringify(result.error.flatten().fieldErrors)}`,
        );
      }

      if (result.data.parentId) {
        const parent = await db.bookmarkNode.findFirst({
          where: {
            id: result.data.parentId,
            userId,
            type: "FOLDER",
            deletedAt: null,
          },
        });
        if (!parent) {
          throw new Error("Parent folder not found");
        }
      }

      const node = await db.bookmarkNode.create({
        data: {
          userId,
          parentId: result.data.parentId || null,
          type: "BOOKMARK",
          title: result.data.title,
          description: result.data.description,
          url: result.data.url === "" ? null : result.data.url,
        },
      });

      return { node: serializeNode(node), error: null };
    }

    throw new Error("Invalid node type. Must be 'folder' or 'bookmark'");
  } catch (error) {
    console.error("Create node error:", error);
    return {
      node: null,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
};

export const updateNode = async (
  id: string,
  body: {
    title?: string;
    description?: string;
    url?: string;
    isFavorite?: boolean;
  },
) => {
  try {
    const userId = await requireAuth();

    const result = updateNodeSchema.safeParse(body);
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

    if (existing.type === "FOLDER" && result.data.url) {
      throw new Error("Folders cannot have a URL");
    }

    const updated = await db.bookmarkNode.update({
      where: { id },
      data: {
        ...(result.data.title !== undefined && { title: result.data.title }),
        ...(result.data.description !== undefined && {
          description: result.data.description,
        }),
        ...(result.data.url !== undefined && {
          url: result.data.url === "" ? null : result.data.url,
        }),

        ...(result.data.isFavorite !== undefined && {
          isFavorite: result.data.isFavorite,
        }),
      },
    });

    return {
      node: serializeNode(updated),
      error: null,
    };
  } catch (error) {
    console.error("Update node error:", error);
    return {
      node: null,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
};

export const deleteNode = async (id: string) => {
  try {
    const userId = await requireAuth();

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

    const collectDescendantIds = async (nodeId: string): Promise<string[]> => {
      const ids: string[] = [nodeId];
      const children = await db.bookmarkNode.findMany({
        where: { parentId: nodeId, deletedAt: null },
        select: { id: true },
      });
      for (const child of children) {
        const childIds = await collectDescendantIds(child.id);
        ids.push(...childIds);
      }
      return ids;
    };

    const allIds = await collectDescendantIds(id);
    const now = new Date();
    await db.bookmarkNode.updateMany({
      where: { id: { in: allIds } },
      data: { deletedAt: now },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Delete node error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
};
