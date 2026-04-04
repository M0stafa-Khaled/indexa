import { type TreeNode } from "@/types";

export const serializeNode = (node: any): TreeNode => {
  return {
    ...node,
    createdAt:
      node.createdAt instanceof Date
        ? node.createdAt.toISOString()
        : node.createdAt,
    updatedAt:
      node.updatedAt instanceof Date
        ? node.updatedAt.toISOString()
        : node.updatedAt,
    deletedAt:
      node.deletedAt instanceof Date
        ? node.deletedAt.toISOString()
        : node.deletedAt,
  };
};

export const serializeNodes = (nodes: any[]): TreeNode[] => {
  return nodes.map(serializeNode);
};
