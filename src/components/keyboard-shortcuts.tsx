"use client";

import * as React from "react";
import {
  Search,
  Plus,
  FolderPlus,
  Trash2,
  Pencil,
  ArrowRight,
  ArrowLeft,
  Command,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ShortcutItem {
  keys: string[];
  label: string;
  description: string;
  icon: React.ReactNode;
}

const shortcuts: ShortcutItem[] = [
  {
    keys: ["⌘", "K"],
    label: "Search",
    description: "Open the search bar",
    icon: <Search className="size-4" />,
  },
  {
    keys: ["⌘", "N"],
    label: "New Bookmark",
    description: "Create a new bookmark",
    icon: <Plus className="size-4" />,
  },
  {
    keys: ["⇧", "⌘", "N"],
    label: "New Folder",
    description: "Create a new folder",
    icon: <FolderPlus className="size-4" />,
  },
  {
    keys: ["Del"],
    label: "Delete",
    description: "Delete selected item",
    icon: <Trash2 className="size-4" />,
  },
  {
    keys: ["F2"],
    label: "Rename",
    description: "Rename selected item",
    icon: <Pencil className="size-4" />,
  },
  {
    keys: ["→"],
    label: "Expand",
    description: "Expand selected folder",
    icon: <ArrowRight className="size-4" />,
  },
  {
    keys: ["←"],
    label: "Collapse",
    description: "Collapse selected folder",
    icon: <ArrowLeft className="size-4" />,
  },
];

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="size-5 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Navigate and manage your bookmarks faster with these shortcuts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.label}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-center size-8 rounded-lg bg-muted text-muted-foreground shrink-0">
                {shortcut.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{shortcut.label}</div>
                <div className="text-xs text-muted-foreground">
                  {shortcut.description}
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {shortcut.keys.map((key, i) => (
                  <React.Fragment key={i}>
                    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground">
                      {key}
                    </kbd>
                    {i < shortcut.keys.length - 1 && (
                      <span className="text-xs text-muted-foreground/50 mx-0.5">
                        +
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <X className="mr-1.5 size-3.5" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
