"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session.user.email
      ? session.user.email[0].toUpperCase()
      : "U";

  return (
    <div className="flex items-center gap-1 shrink-0">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 gap-2 rounded-full pl-2 pr-3"
          >
            <Avatar className="size-7">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-30 truncate text-sm font-medium md:inline-block">
              {session.user.name || session.user.email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>
              <Settings className="mr-2 size-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 size-4 text-destructive" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
