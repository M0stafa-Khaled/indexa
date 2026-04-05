"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { requireAuth } from "../auth";

const importItemSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["bookmark", "folder", "BOOKMARK", "FOLDER"]),
  url: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isFavorite: z.boolean().optional(),
  children: z.lazy(() => z.array(importItemSchema)).optional(),
});

type ImportNodesInput =
  | z.infer<typeof importItemSchema>[]
  | { nodes: z.infer<typeof importItemSchema>[] }
  | { children: z.infer<typeof importItemSchema>[] }
  | z.infer<typeof importItemSchema>;

export const importNodes = async (data: ImportNodesInput) => {
  try {
    const userId = await requireAuth();

    const normalizedData = Array.isArray(data)
      ? data
      : "nodes" in data
        ? data.nodes
        : "children" in data
          ? data.children
          : [data];

    const result = z.array(importItemSchema).safeParse(normalizedData);
    console.log("result: ", data);
    if (!result.success) {
      throw new Error(
        `Invalid import data: ${JSON.stringify(result.error.flatten().fieldErrors)}`,
      );
    }

    let importedCount = 0;

    const nodesToCreate: Array<{
      userId: string;
      parentId: string | null;
      type: "FOLDER" | "BOOKMARK";
      title: string;
      description: string | null;
      url: string | null;
      isFavorite: boolean;
    }> = [];

    const idMap = new Map<string, string>();

    const collectNodes = (
      items: z.infer<typeof importItemSchema>[],
      parentId: string | null,
    ) => {
      for (const item of items) {
        const tempId = `temp-${importedCount}`;
        idMap.set(tempId, tempId);
        nodesToCreate.push({
          userId,
          parentId,
          type: item.type.toUpperCase() as "FOLDER" | "BOOKMARK",
          title: item.title,
          description: item.description || null,
          url: item.type.toUpperCase() === "BOOKMARK" ? item.url || null : null,
          isFavorite: item.isFavorite || false,
        });
        importedCount++;
        if (item.children && item.children.length > 0) {
          collectNodes(item.children, tempId);
        }
      }
    };

    collectNodes(result.data, null);

    await db.$transaction(
      async (tx) => {
        // First pass: create all nodes without parent relationships
        for (let i = 0; i < nodesToCreate.length; i++) {
          const nodeData = nodesToCreate[i];
          const created = await tx.bookmarkNode.create({
            data: {
              userId: nodeData.userId,
              parentId: null, // Set all to null initially
              type: nodeData.type,
              title: nodeData.title,
              description: nodeData.description,
              url: nodeData.url,
              isFavorite: nodeData.isFavorite,
            },
          });
          const tempId = `temp-${i}`;
          idMap.set(tempId, created.id);
        }

        // Second pass: update parent relationships
        for (let i = 0; i < nodesToCreate.length; i++) {
          const nodeData = nodesToCreate[i];
          if (nodeData.parentId) {
            const realParentId = nodeData.parentId.startsWith("temp-")
              ? idMap.get(nodeData.parentId)
              : nodeData.parentId;
            const currentId = idMap.get(`temp-${i}`);
            if (realParentId && currentId && realParentId !== currentId) {
              await tx.bookmarkNode.update({
                where: { id: currentId },
                data: { parentId: realParentId },
              });
            }
          }
        }
      },
      {
        timeout: 10000000, // Increase timeout to 30 seconds for large imports
      },
    );

    return { success: true, imported: importedCount, error: null };
  } catch (error) {
    console.error("Import error:", error);
    return {
      success: false,
      imported: 0,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
};

export const exportNodes = async () => {
  try {
    const userId = await requireAuth();

    const nodes = await db.bookmarkNode.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [{ createdAt: "asc" }],
    });

    const nodeMap = new Map<string, any>();
    const roots: any[] = [];

    const parsedNodes = nodes.map((node) => ({
      title: node.title,
      type: node.type.toLowerCase() as "bookmark" | "folder",
      url: node.url,
      description: node.description,
      isFavorite: node.isFavorite,
      children: [] as any[],
    }));

    parsedNodes.forEach((node, i) => {
      nodeMap.set(nodes[i].id, node);
    });

    parsedNodes.forEach((node, i) => {
      const parentId = nodes[i].parentId;
      if (parentId && nodeMap.has(parentId)) {
        nodeMap.get(parentId).children.push(node);
      } else {
        roots.push(node);
      }
    });

    return { data: roots, error: null };
  } catch (error) {
    console.error("Export error:", error);
    return { data: null, error: "Internal server error" };
  }
};
