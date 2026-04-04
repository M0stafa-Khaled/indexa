"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Layers } from "lucide-react";
import { type ReactNode } from "react";

interface AuthFormContainerProps {
  children: ReactNode;
  mode: "login" | "register";
}

export function AuthFormContainer({ children, mode }: AuthFormContainerProps) {
  return (
    <div className="relative flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 bg-background overflow-hidden">
      {/* Subtle dot pattern on right panel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm space-y-8">
        {/* Mobile Logo with floating animation */}
        <div className="flex items-center gap-3 lg:hidden">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            className="flex size-10 items-center justify-center rounded-xl bg-primary/10"
          >
            <Layers className="size-6 text-primary" />
          </motion.div>
          <span className="text-2xl font-bold tracking-tight gradient-text">
            Indexa
          </span>
        </div>

        {/* Header with fade animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-bold tracking-tight">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Sign in to access your bookmarks"
                : "Get started with Indexa for free"}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Forms */}
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
    </div>
  );
}
