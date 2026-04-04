"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { IndexaApp } from "@/components/indexa-app";
import { TooltipProvider } from "@/components/ui/tooltip";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!session) return null;
  return <>{children}</>;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in — show auth pages
  if (!session) {
    return <>{children}</>;
  }

  // Logged in — show app
  return <AuthGuard>{children}</AuthGuard>;
};

const Home = () => {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <TooltipProvider>
            <IndexaApp />
          </TooltipProvider>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Home;
