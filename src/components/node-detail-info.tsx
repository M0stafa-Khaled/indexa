"use client";

import { Copy, ExternalLink, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import type { BookmarkNode } from "@/types";
import Image from "next/image";

interface NodeDetailInfoProps {
  node: BookmarkNode;
}

export function NodeDetailInfo({ node }: NodeDetailInfoProps) {
  // Extract hostname from URL
  let hostname = "";
  if (node.url) {
    try {
      hostname = new URL(node.url).hostname;
    } catch {
      hostname = node.url;
    }
  }

  const handleCopyUrl = () => {
    if (node.url) {
      navigator.clipboard.writeText(node.url).then(() => {
        toast.success("URL copied to clipboard");
      });
    }
  };

  return (
    <>
      {/* URL Card */}
      {node.url && (
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 rounded-lg p-0.5 pointer-events-none">
            <div className="w-full h-full rounded-lg bg-linear-to-r from-primary/50 via-primary/20 to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <Card className="relative overflow-hidden border-l-4 border-l-primary hover:border-l-primary/80 transition-colors duration-200">
            <CardContent className="p-0">
              <a
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-all duration-150 group"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted shrink-0 group-hover:scale-105 transition-transform duration-150">
                  <Image
                    src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                    alt=""
                    className="size-6 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                    height={24}
                    width={24}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-primary group-hover:underline truncate">
                    {hostname}
                  </div>
                  <div className="truncate text-xs text-muted-foreground mt-0.5">
                    {node.url}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors duration-150"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCopyUrl();
                    }}
                  >
                    <Copy className="size-3.5" />
                    <span className="hidden sm:inline">Copy</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors duration-150"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(node.url!, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <ExternalLink className="size-3.5" />
                    Open
                  </Button>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Description */}
      {node.description && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <FileText className="size-4" />
            Description
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
            {node.description}
          </p>
        </div>
      )}

      {/* Timestamps with relative time */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Calendar className="size-4" />
          Details
        </div>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span className="tabular-nums">
              {formatDistanceToNow(new Date(node.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Updated</span>
            <span className="tabular-nums">
              {formatDistanceToNow(new Date(node.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
