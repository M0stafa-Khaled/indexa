"use client";

import { motion } from "framer-motion";
import { Layers, BookOpen } from "lucide-react";

export function AuthHeroPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-primary via-primary/90 to-indigo-800 p-12 flex-col justify-between">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 size-112 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-1/4 size-64 rounded-full bg-white/5" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2 animate-float">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm shadow-lg shadow-black/10">
            <Layers className="size-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Indexa
          </span>
        </div>
      </div>

      <div className="relative z-10 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            Organize your digital world with{" "}
            <span className="text-indigo-200">precision</span>
          </h1>
          <p className="text-lg text-indigo-100/80 leading-relaxed max-w-md">
            A hierarchical bookmark indexing platform that helps you save,
            organize, and find your bookmarks effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="rounded-xl bg-white/10 backdrop-blur-sm p-4 space-y-2 cursor-default"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-white/10">
              <Layers className="size-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Nested Folders
            </h3>
            <p className="text-xs text-indigo-100/70">
              Create unlimited folder hierarchies
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="rounded-xl bg-white/10 backdrop-blur-sm p-4 space-y-2 cursor-default"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-white/10">
              <BookOpen className="size-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-white">Quick Search</h3>
            <p className="text-xs text-indigo-100/70">
              Find any bookmark instantly
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 text-sm text-indigo-200/60">
        &copy; {new Date().getFullYear()} Indexa. All rights reserved.
      </div>
    </div>
  );
}
