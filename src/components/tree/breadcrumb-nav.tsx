"use client";

import * as React from "react";
import { ChevronRight, Home } from "lucide-react";
import { useTreeStore } from "@/store/tree-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function BreadcrumbNav() {
  const { breadcrumbs, setSelectedNode: selectNode } = useTreeStore();

  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  // If too many crumbs, truncate the middle
  const maxVisible = 5;
  let crumbs = breadcrumbs;
  if (crumbs.length > maxVisible) {
    crumbs = [
      crumbs[0],
      {
        id: "__ellipsis",
        title: "...",
        userId: "",
        parentId: null,
        type: "FOLDER",
        description: null,
        url: null,
        createdAt: "",
        updatedAt: "",
        deletedAt: null,
        isFavorite: false,
      },
      ...crumbs.slice(-3),
    ];
  }

  return (
    <nav className="flex items-center gap-1 text-sm min-w-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 shrink-0"
            onClick={() => selectNode(null)}
          >
            <Home className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Home</TooltipContent>
      </Tooltip>
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        if (crumb.id === "__ellipsis") {
          return (
            <React.Fragment key="ellipsis">
              <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />
              <span className="text-muted-foreground">...</span>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={crumb.id}>
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />
            {isLast ? (
              <span className="truncate font-medium text-foreground max-w-50">
                {crumb.title}
              </span>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-muted-foreground hover:text-foreground max-w-40"
                    onClick={() => selectNode(crumb.id)}
                  >
                    <span className="truncate">{crumb.title}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{crumb.title}</TooltipContent>
              </Tooltip>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
