"use client";

import { create } from "zustand";
import type { TreeNode } from "@/types";

interface DialogState {
  editNodeDialog: {
    open: boolean;
    node: TreeNode | null;
  };
  deleteNodeDialog: {
    open: boolean;
    node: TreeNode | null;
  };
  createNodeDialog: {
    open: boolean;
    type: "folder" | "bookmark";
    parentId: string | null;
  };
  moveNodeDialog: {
    open: boolean;
    node: TreeNode | null;
  };
}

interface DialogActions {
  openEditDialog: (node: TreeNode) => void;
  closeEditDialog: () => void;
  openDeleteDialog: (node: TreeNode) => void;
  closeDeleteDialog: () => void;
  openCreateDialog: (type: "folder" | "bookmark", parentId: string | null) => void;
  closeCreateDialog: () => void;
  openMoveDialog: (node: TreeNode) => void;
  closeMoveDialog: () => void;
  closeAllDialogs: () => void;
}

export const useDialogStore = create<DialogState & DialogActions>((set) => ({
  editNodeDialog: { open: false, node: null },
  deleteNodeDialog: { open: false, node: null },
  createNodeDialog: { open: false, type: "folder", parentId: null },
  moveNodeDialog: { open: false, node: null },

  openEditDialog: (node) =>
    set({
      editNodeDialog: { open: true, node },
    }),
  closeEditDialog: () =>
    set({
      editNodeDialog: { open: false, node: null },
    }),

  openDeleteDialog: (node) =>
    set({
      deleteNodeDialog: { open: true, node },
    }),
  closeDeleteDialog: () =>
    set({
      deleteNodeDialog: { open: false, node: null },
    }),

  openCreateDialog: (type, parentId) =>
    set({
      createNodeDialog: { open: true, type, parentId },
    }),
  closeCreateDialog: () =>
    set({
      createNodeDialog: { open: false, type: "folder", parentId: null },
    }),

  openMoveDialog: (node) =>
    set({
      moveNodeDialog: { open: true, node },
    }),
  closeMoveDialog: () =>
    set({
      moveNodeDialog: { open: false, node: null },
    }),

  closeAllDialogs: () =>
    set({
      editNodeDialog: { open: false, node: null },
      deleteNodeDialog: { open: false, node: null },
      createNodeDialog: { open: false, type: "folder", parentId: null },
      moveNodeDialog: { open: false, node: null },
    }),
}));
