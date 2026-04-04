"use client";

import { FolderOpen, Globe, Clock, FileSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BookmarkNode } from "@/types";

interface SearchResultsListProps {
  results: BookmarkNode[] | null;
  recentSearches: string[];
  localQuery: string;
  onResultClick: (node: BookmarkNode) => void;
  onRecentClick: (query: string) => void;
  onClearRecent: () => void;
}

export function SearchResultsList({
  results,
  recentSearches,
  localQuery,
  onResultClick,
  onRecentClick,
  onClearRecent,
}: SearchResultsListProps) {
  const showNoResults =
    results !== null && results.length === 0 && localQuery.trim();

  return (
    <>
      {/* No results illustration */}
      {showNoResults && (
        <div className="py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted mx-auto mb-3">
            <FileSearch className="size-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            No results found
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Try a different search term or filter
          </p>
        </div>
      )}

      {/* Search results */}
      {results && results.length > 0 && (
        <div className="max-h-72 overflow-y-auto p-1">
          {results.map((node) => (
            <button
              key={node.id}
              onClick={() => onResultClick(node)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-left hover:bg-accent transition-colors"
            >
              {node.type === "FOLDER" ? (
                <FolderOpen className="size-4 shrink-0 text-amber-500" />
              ) : (
                <Globe className="size-4 shrink-0 text-primary" />
              )}
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium">{node.title}</div>
                {node.description && (
                  <div className="truncate text-xs text-muted-foreground">
                    {node.description}
                  </div>
                )}
                {node.url && (
                  <div className="truncate text-xs text-muted-foreground">
                    {node.url}
                  </div>
                )}
              </div>
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                {node.type}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {/* Recent searches (when no search is active) */}
      {!localQuery && recentSearches.length > 0 && (
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="size-3" />
              Recent
            </div>
            <button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClearRecent}
            >
              Clear
            </button>
          </div>
          {recentSearches.map((query) => (
            <button
              key={query}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-accent transition-colors text-muted-foreground"
              onClick={() => onRecentClick(query)}
            >
              <Clock className="size-3 shrink-0" />
              <span className="truncate">{query}</span>
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!results && !localQuery && recentSearches.length === 0 && (
        <div className="py-6 text-center text-sm text-muted-foreground">
          Start typing to search...
        </div>
      )}

      {/* Keyboard shortcut hints */}
      <div className="border-t px-3 py-2 flex items-center justify-center gap-3 text-[10px] text-muted-foreground/60">
        <span>
          <kbd className="inline-flex h-4 items-center rounded border bg-muted/50 px-1 font-mono text-[9px]">
            ↑
          </kbd>
          <kbd className="inline-flex h-4 items-center rounded border bg-muted/50 px-1 font-mono text-[9px] ml-0.5">
            ↓
          </kbd>
          navigate
        </span>
        <span>
          <kbd className="inline-flex h-4 items-center rounded border bg-muted/50 px-1 font-mono text-[9px]">
            ↵
          </kbd>
          select
        </span>
        <span>
          <kbd className="inline-flex h-4 items-center rounded border bg-muted/50 px-1 font-mono text-[9px]">
            esc
          </kbd>
          close
        </span>
      </div>
    </>
  );
}
