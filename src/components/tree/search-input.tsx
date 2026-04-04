"use client";

import * as React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

type FilterType = "all" | "FOLDER" | "BOOKMARK";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
  resultCount?: number;
  showNoResults?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  filterType,
  onFilterChange,
  resultCount,
  showNoResults,
  inputRef,
}: SearchInputProps) {
  return (
    <>
      {/* Search input field */}
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          placeholder="Search bookmarks and folders..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-11 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="size-6 shrink-0"
            onClick={onClear}
          >
            <X className="size-3" />
          </Button>
        )}
      </div>

      {/* Filter buttons */}
      <div className="flex items-center gap-1 px-3 py-2 border-b">
        <SlidersHorizontal className="size-3.5 text-muted-foreground mr-1" />
        {(["all", "FOLDER", "BOOKMARK"] as const).map((type) => (
          <button
            key={type}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              filterType === type
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
            onClick={() => onFilterChange(type)}
          >
            {type === "all"
              ? "All"
              : type === "FOLDER"
                ? "Folders"
                : "Bookmarks"}
          </button>
        ))}
        {showNoResults && (
          <span className="ml-auto text-xs text-muted-foreground">
            0 results
          </span>
        )}
        {!showNoResults && resultCount !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground">
            {resultCount} result
            {resultCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </>
  );
}
