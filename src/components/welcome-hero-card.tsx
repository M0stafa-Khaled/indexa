"use client";

import { FolderPlus, BookmarkPlus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Variants, motion } from "framer-motion";

interface WelcomeHeroCardProps {
  onNewFolder?: () => void;
  onNewBookmark?: () => void;
  itemVariants: Variants;
}

export function WelcomeHeroCard({
  onNewFolder,
  onNewBookmark,
  itemVariants,
}: WelcomeHeroCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/80 to-indigo-700 p-6 text-white">
        {/* Animated gradient border overlay */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />

        {/* Background pattern/texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 size-40 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-white/10 blur-sm" />
        <div className="absolute top-8 right-20 size-16 rounded-full bg-white/5 blur-xs" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm shadow-lg shadow-black/10">
              <Layers className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Welcome to Indexa
              </h1>
              <p className="text-sm text-white/70">
                Your personal bookmark manager
              </p>
            </div>
          </div>

          <p className="text-sm text-white/80 leading-relaxed">
            Select a bookmark or folder from the sidebar to view its details, or
            use the quick actions below to get started.
          </p>

          <div className="flex gap-2">
            {onNewFolder && (
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/15 hover:bg-white/25 text-white border-0 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
                onClick={onNewFolder}
              >
                <FolderPlus className="mr-1.5 size-3.5" />
                New Folder
              </Button>
            )}
            {onNewBookmark && (
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/15 hover:bg-white/25 text-white border-0 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
                onClick={onNewBookmark}
              >
                <BookmarkPlus className="mr-1.5 size-3.5" />
                New Bookmark
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
