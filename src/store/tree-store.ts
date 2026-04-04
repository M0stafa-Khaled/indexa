import { create } from "zustand";
import type { BookmarkNode, TreeNode, SortOption, ViewMode } from "@/types";

interface TreeState {
  // Data
  tree: TreeNode[];
  flatNodes: Map<string, BookmarkNode>;
  selectedNodeId: string | null;
  expandedNodeIds: Set<string>;
  breadcrumbs: BookmarkNode[];
  searchQuery: string;
  searchResults: BookmarkNode[] | null;
  isLoading: boolean;

  // View & Sort
  viewMode: ViewMode;
  sortOption: SortOption;

  // Actions
  setTree: (tree: TreeNode[]) => void;
  setSelectedNode: (id: string | null) => void;
  toggleExpanded: (id: string) => void;
  setExpanded: (id: string, expanded: boolean) => void;
  setBreadcrumbs: (nodes: BookmarkNode[]) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: BookmarkNode[] | null) => void;
  setIsLoading: (loading: boolean) => void;
  removeNode: (id: string) => void;
  addNode: (node: BookmarkNode, parentId?: string | null) => void;
  updateNodeInTree: (node: BookmarkNode) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortOption: (option: SortOption) => void;
}

export const useTreeStore = create<TreeState>((set) => ({
  tree: [],
  flatNodes: new Map(),
  selectedNodeId: null,
  expandedNodeIds: new Set<string>(),
  breadcrumbs: [],
  searchQuery: "",
  searchResults: null,
  isLoading: false,
  viewMode: "tree",
  sortOption: "date-newest",

  setTree: (tree) => {
    const flatNodes = new Map<string, BookmarkNode>();
    const collectNodes = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        flatNodes.set(node.id, node);
        if (node.children) {
          collectNodes(node.children);
        }
      });
    };
    collectNodes(tree);

    // Auto-expand root folders
    const expandedNodeIds = new Set<string>();
    tree.forEach((node) => {
      if (node.type === "FOLDER") {
        expandedNodeIds.add(node.id);
      }
    });

    set({ tree, flatNodes, expandedNodeIds });
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  toggleExpanded: (id) =>
    set((state) => {
      const expanded = new Set(state.expandedNodeIds);
      if (expanded.has(id)) {
        expanded.delete(id);
      } else {
        expanded.add(id);
      }
      return { expandedNodeIds: expanded };
    }),

  setExpanded: (id, expanded) =>
    set((state) => {
      const expandedNodeIds = new Set(state.expandedNodeIds);
      if (expanded) {
        expandedNodeIds.add(id);
      } else {
        expandedNodeIds.delete(id);
      }
      return { expandedNodeIds };
    }),

  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchResults: (searchResults) => set({ searchResults }),
  setIsLoading: (isLoading) => set({ isLoading }),

  removeNode: (id) =>
    set((state) => {
      const removeFromTree = (nodes: TreeNode[]): TreeNode[] =>
        nodes
          .filter((node) => node.id !== id)
          .map((node) => ({
            ...node,
            children: node.children ? removeFromTree(node.children) : [],
          }));

      const flatNodes = new Map(state.flatNodes);
      flatNodes.delete(id);

      return {
        tree: removeFromTree(state.tree),
        flatNodes,
        selectedNodeId:
          state.selectedNodeId === id ? null : state.selectedNodeId,
      };
    }),

  addNode: (node, parentId) =>
    set((state) => {
      const addToTree = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((n) => {
          if (n.id === parentId) {
            return {
              ...n,
              children: [...(n.children || []), { ...node, children: [] }],
            };
          }
          return {
            ...n,
            children: n.children ? addToTree(n.children) : [],
          };
        });
      };

      const newTree = parentId
        ? addToTree(state.tree)
        : [...state.tree, { ...node, children: [] }];

      const flatNodes = new Map(state.flatNodes);
      flatNodes.set(node.id, node);

      // Auto-expand parent
      const expandedNodeIds = new Set(state.expandedNodeIds);
      if (parentId) {
        expandedNodeIds.add(parentId);
      }

      return { tree: newTree, flatNodes, expandedNodeIds };
    }),

  updateNodeInTree: (node) =>
    set((state) => {
      const updateInTree = (nodes: TreeNode[]): TreeNode[] =>
        nodes.map((n) => ({
          ...n,
          ...(n.id === node.id ? node : {}),
          children: n.children ? updateInTree(n.children) : [],
        }));

      const flatNodes = new Map(state.flatNodes);
      flatNodes.set(node.id, node);

      return {
        tree: updateInTree(state.tree),
        flatNodes,
      };
    }),

  setViewMode: (viewMode) => set({ viewMode }),
  setSortOption: (sortOption) => set({ sortOption }),
}));
