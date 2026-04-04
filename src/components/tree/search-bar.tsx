"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTreeStore } from "@/store/tree-store";
import { searchNodes } from "@/lib/actions";
import { useSearchForm } from "@/hooks/use-search-form";
import { SearchInput } from "./search-input";
import { SearchResultsList } from "./search-results-list";
import type { BookmarkNode } from "@/types";

export function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [localQuery, setLocalQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    searchQuery,
    searchResults,
    setSearchQuery,
    setSearchResults,
    setSelectedNode,
  } = useTreeStore();

  const {
    filterType,
    setFilterType,
    recentSearches,
    saveRecentSearch,
    clearRecentSearches,
    debounceRef,
  } = useSearchForm();

  // Keyboard shortcut Ctrl/Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (query: string) => {
    setLocalQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSearchResults(null);
      setSearchQuery("");
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const { nodes, error } = await searchNodes(
          query,
          filterType !== "all" ? filterType : undefined,
        );
        if (!error && nodes) {
          setSearchResults(nodes);
          setSearchQuery(query);
          saveRecentSearch(query);
        }
      } catch {
        // silent fail
      }
    }, 300);
  };

  const handleSelect = (node: BookmarkNode) => {
    setSelectedNode(node.id);
    setOpen(false);
    setLocalQuery("");
    setSearchResults(null);
    setSearchQuery("");
  };

  const handleClear = () => {
    setLocalQuery("");
    setSearchResults(null);
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleRecentClick = (query: string) => {
    setLocalQuery(query);
    handleSearch(query);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const filteredResults = React.useMemo(() => {
    if (!searchResults) return null;
    if (filterType === "all") return searchResults;
    return searchResults.filter((n) => n.type === filterType);
  }, [searchResults, filterType]);

  const showNoResults =
    filteredResults !== null &&
    filteredResults.length === 0 &&
    Boolean(localQuery.trim());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="relative size-8 md:h-9 md:w-56 md:justify-start md:gap-2 text-muted-foreground md:pr-12"
        >
          <Search className="size-4 shrink-0" />
          <span className="truncate hidden md:flex">
            {searchQuery || "Search bookmarks..."}
          </span>
          <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground md:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] max-w-lg p-0"
        align="start"
      >
        <SearchInput
          value={localQuery}
          onChange={handleSearch}
          onClear={handleClear}
          filterType={filterType}
          onFilterChange={setFilterType}
          resultCount={filteredResults?.length}
          showNoResults={showNoResults}
          inputRef={inputRef}
        />
        <SearchResultsList
          results={filteredResults}
          recentSearches={recentSearches}
          localQuery={localQuery}
          onResultClick={handleSelect}
          onRecentClick={handleRecentClick}
          onClearRecent={clearRecentSearches}
        />
      </PopoverContent>
    </Popover>
  );
}
