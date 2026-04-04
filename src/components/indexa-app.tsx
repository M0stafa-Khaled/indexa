"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { AuthPages } from "@/components/auth/auth-pages";
import { AppShell } from "@/components/app-shell";

export function IndexaApp() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthPages />;
  }

  return <AppShell />;
}
