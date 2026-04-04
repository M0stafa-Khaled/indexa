"use client";

import * as React from "react";

type FilterType = "all" | "FOLDER" | "BOOKMARK";

const RECENT_SEARCHES_KEY = "indexa-recent-searches";
const MAX_RECENT = 5;

export function useSearchForm() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<FilterType>("all");
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      MAX_RECENT,
    );
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  const clearDebounce = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };

  React.useEffect(() => {
    return () => clearDebounce();
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    recentSearches,
    saveRecentSearch,
    clearRecentSearches,
    debounceRef,
    clearDebounce,
  };
}
