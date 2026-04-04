"use client";

import {
  Layers,
  Menu,
  Loader2,
  Bookmark,
  FolderOpen,
  Keyboard,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useTreeStore } from "@/store/tree-store";
import { getTreeStructure } from "@/lib/actions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserMenu } from "@/components/user-menu";
import { SearchBar } from "@/components/tree/search-bar";
import { BreadcrumbNav } from "@/components/tree/breadcrumb-nav";
import { TreeSidebar } from "@/components/tree/tree-sidebar";
import { NodeDetailPanel } from "@/components/node-detail-panel";
import { EditNodeDialog } from "@/components/tree/edit-node-dialog";
import { DeleteNodeDialog } from "@/components/tree/delete-node-dialog";
import { CreateNodeDialog } from "@/components/tree/create-node-dialog";
import { KeyboardShortcutsDialog } from "@/components/keyboard-shortcuts";
import { TrashView } from "@/components/trash-view";
import { FavoritesView } from "@/components/favorites-view";
import { ImportExportButtons } from "@/components/import-export-buttons";
import type { TreeNode, BookmarkNode, ViewMode } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export function AppShell() {
  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [editNode, setEditNode] = useState<TreeNode | null>(null);
  const [deleteNode, setDeleteNode] = useState<TreeNode | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<"folder" | "bookmark">("folder");
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("tree");

  const {
    tree,
    flatNodes,
    selectedNodeId,
    isLoading,
    setTree,
    setBreadcrumbs,
    setIsLoading,
    toggleExpanded,
  } = useTreeStore();

  // Compute stats
  const stats = useMemo(() => {
    let bookmarks = 0;
    let folders = 0;
    flatNodes.forEach((node) => {
      if (node.type === "FOLDER") folders++;
      else bookmarks++;
    });
    return { bookmarks, folders };
  }, [flatNodes]);

  // Fetch tree data on mount
  const fetchTree = useCallback(async () => {
    setIsLoading(true);
    try {
      const { tree, error } = await getTreeStructure();
      if (!error && tree) {
        setTree(tree);
      } else {
        toast.error("Failed to load bookmarks");
      }
    } catch {
      toast.error("Failed to load bookmarks");
    } finally {
      setIsLoading(false);
    }
  }, [setTree, setIsLoading]);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  // Compute breadcrumbs when selection changes
  useEffect(() => {
    if (!selectedNodeId || !flatNodes.has(selectedNodeId)) {
      setBreadcrumbs([]);
      return;
    }

    const crumbs: BookmarkNode[] = [];
    let currentId: string | null | undefined = selectedNodeId;
    while (currentId) {
      const node = flatNodes.get(currentId);
      if (node) {
        crumbs.unshift(node);
        currentId = node.parentId;
      } else {
        break;
      }
    }
    setBreadcrumbs(crumbs);
  }, [selectedNodeId, flatNodes, setBreadcrumbs]);

  // Auto-expand parent when selecting a node
  useEffect(() => {
    if (!selectedNodeId) return;
    const node = flatNodes.get(selectedNodeId);
    if (node?.parentId) {
      toggleExpanded(node.parentId);
    }
  }, [selectedNodeId, flatNodes, toggleExpanded]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+N: New bookmark
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setCreateType("bookmark");
        setCreateOpen(true);
      }
      // Shift+Cmd+N: New folder
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "N") {
        e.preventDefault();
        setCreateType("folder");
        setCreateOpen(true);
      }
      // ?: Show keyboard shortcuts
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        // Only if not in an input
        if (
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
          setShortcutsOpen(true);
        }
      }
      // F2: Rename
      if (e.key === "F2" && selectedNodeId) {
        e.preventDefault();
        const findInTree = (nodes: TreeNode[]): TreeNode | null => {
          for (const n of nodes) {
            if (n.id === selectedNodeId) return n;
            if (n.children) {
              const found = findInTree(n.children);
              if (found) return found;
            }
          }
          return null;
        };
        const found = findInTree(tree);
        if (found) setEditNode(found);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, tree]);

  const selectedNode = selectedNodeId ? flatNodes.get(selectedNodeId) : null;
  const selectedTreeNode = useMemo(() => {
    if (!selectedNodeId || !selectedNode) return null;
    const findInTree = (nodes: TreeNode[]): TreeNode | null => {
      for (const n of nodes) {
        if (n.id === selectedNodeId) return n;
        if (n.children) {
          const found = findInTree(n.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInTree(tree);
  }, [selectedNodeId, selectedNode, tree]);

  const handleEdit = () => {
    if (selectedTreeNode) setEditNode(selectedTreeNode);
  };

  const handleDelete = () => {
    if (selectedTreeNode) setDeleteNode(selectedTreeNode);
  };

  const handleNewFolder = () => {
    setCreateType("folder");
    setCreateOpen(true);
  };

  const handleNewBookmark = () => {
    setCreateType("bookmark");
    setCreateOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background bg-mesh-gradient">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading your bookmarks...
          </p>
        </div>
      </div>
    );
  }

  const sidebarContent = <TreeSidebar />;

  return (
    <div className="flex h-screen flex-col bg-background bg-mesh-gradient overflow-hidden">
      {/* Top Header */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b px-4 overflow-hidden min-w-0 shadow-[0_1px_3px_-1px_oklch(0_0_0/8%)] dark:shadow-[0_1px_4px_-1px_oklch(0_0_0/25%)] z-10 relative">
        {/* Mobile menu + Logo */}
        <div className="flex items-center gap-2 shrink-0">
          {isMobile && (
            <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="border-b px-4 py-3">
                  <SheetTitle className="flex items-center gap-2 text-base">
                    <Layers className="size-4 text-primary" />
                    Bookmarks
                  </SheetTitle>
                </SheetHeader>
                {sidebarContent}
              </SheetContent>
            </Sheet>
          )}
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/15 transition-colors duration-200">
              <Layers className="size-4 text-primary" />
            </div>
            <span className="hidden font-bold tracking-tight sm:inline-block">
              Indexa
            </span>
          </div>
        </div>

        {/* Breadcrumbs - flex-1 acts as spacer and allows truncation */}
        <div className="flex-1 min-w-0 hidden md:flex">
          <BreadcrumbNav />
        </div>

        {/* Search + Import/Export + Keyboard Shortcuts + User Menu */}
        <div className="flex items-center gap-1.5 shrink-0">
          <SearchBar />
          <ImportExportButtons onImportComplete={fetchTree} />
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground transition-colors duration-150"
            onClick={() => setShortcutsOpen(true)}
          >
            <Keyboard className="size-4" />
          </Button>
          <UserMenu />
        </div>
      </header>

      {/* Stats Bar with View Switcher */}
      <div className="flex h-8 shrink-0 items-center gap-3 border-b px-4 bg-linear-to-r from-muted/40 via-muted/20 to-muted/40">
        {/* View switcher */}
        <div className="flex items-center gap-0.5 rounded-lg bg-background border p-0.5">
          <button
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === "tree"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setViewMode("tree")}
          >
            <Layers className="size-3" />
            <span className="hidden sm:inline">All</span>
          </button>
          <button
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === "favorites"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setViewMode("favorites")}
          >
            <Star className="size-3" />
            <span className="hidden sm:inline">Favorites</span>
          </button>
          <button
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === "trash"
                ? "bg-destructive text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setViewMode("trash")}
          >
            <Trash2 className="size-3" />
            <span className="hidden sm:inline">Trash</span>
          </button>
        </div>

        <Separator orientation="vertical" className="h-4 opacity-50" />

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-1">
          <div className="flex items-center gap-1.5">
            <Bookmark className="size-3" />
            <span className="tabular-nums font-medium">{stats.bookmarks}</span>
            <span className="hidden sm:inline">
              bookmark{stats.bookmarks !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderOpen className="size-3" />
            <span className="tabular-nums font-medium">{stats.folders}</span>
            <span className="hidden sm:inline">
              folder{stats.folders !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[10px] text-muted-foreground/60">
          <kbd className="inline-flex h-4 items-center rounded border bg-background/80 px-1 font-mono text-[9px] shadow-sm">
            ⌘K
          </kbd>
          search
          <kbd className="inline-flex h-4 items-center rounded border bg-background/80 px-1 font-mono text-[9px] ml-1 shadow-sm">
            ?
          </kbd>
          shortcuts
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {isMobile ? (
          <div className="h-full">
            {viewMode === "trash" ? (
              <TrashView
                onRestored={() => {
                  fetchTree();
                  setViewMode("tree");
                }}
              />
            ) : viewMode === "favorites" ? (
              <FavoritesView />
            ) : (
              <NodeDetailPanel
                onEdit={handleEdit}
                onDelete={handleDelete}
                onNewFolder={handleNewFolder}
                onNewBookmark={handleNewBookmark}
              />
            )}
          </div>
        ) : (
          <ResizablePanelGroup orientation="horizontal">
            {/* Sidebar */}
            <ResizablePanel defaultSize={270} minSize={270} maxSize={800}>
              {sidebarContent}
            </ResizablePanel>
            <ResizableHandle withHandle />
            {/* Content */}
            <ResizablePanel maxSize={Infinity}>
              {viewMode === "trash" ? (
                <TrashView
                  onRestored={() => {
                    fetchTree();
                    setViewMode("tree");
                  }}
                />
              ) : viewMode === "favorites" ? (
                <FavoritesView />
              ) : (
                <NodeDetailPanel
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onNewFolder={handleNewFolder}
                  onNewBookmark={handleNewBookmark}
                />
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </main>

      {/* Footer */}
      <footer className="flex h-9 shrink-0 items-center justify-between border-t px-4">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Indexa &mdash; Organize your digital
          world
        </p>
        <div className="hidden sm:flex items-center gap-3 text-[10px] text-muted-foreground/50">
          <span>
            <kbd className="inline-flex h-4 items-center rounded border bg-muted/50 px-1 font-mono text-[9px] shadow-sm">
              ⌘N
            </kbd>
            new
          </span>
          <span>
            <kbd className="inline-flex h-4 items-center rounded border bg-muted/50 px-1 font-mono text-[9px] shadow-sm">
              F2
            </kbd>
            rename
          </span>
          <span>
            <kbd className="inline-flex h-4 items-center rounded border bg-muted/50 px-1 font-mono text-[9px] shadow-sm">
              Del
            </kbd>
            delete
          </span>
        </div>
      </footer>

      {/* Dialogs */}
      <CreateNodeDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultType={createType}
      />
      {editNode && (
        <EditNodeDialog
          node={editNode}
          open={!!editNode}
          onOpenChange={(open) => {
            if (!open) setEditNode(null);
          }}
        />
      )}
      {deleteNode && (
        <DeleteNodeDialog
          node={deleteNode}
          open={!!deleteNode}
          onOpenChange={(open) => {
            if (!open) setDeleteNode(null);
          }}
        />
      )}
      <KeyboardShortcutsDialog
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </div>
  );
}
