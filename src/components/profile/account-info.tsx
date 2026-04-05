"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bookmark, Folder, Star, Calendar, TrendingUp } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface AccountInfoProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  stats?: {
    bookmarksCount: number;
    foldersCount: number;
    favoritesCount: number;
    totalNodes: number;
  };
}

export function AccountInfo({ user, stats }: AccountInfoProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email
      ? user.email[0].toUpperCase()
      : "U";

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card className="overflow-hidden pt-0">
        <div className="h-24 bg-linear-to-r from-primary/20 via-primary/10 to-primary/20" />
        <CardContent className="pt-0">
          <div className="flex flex-col items-center -mt-12 mb-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-2xl font-bold text-center">
              {user.name || "Unnamed User"}
            </h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <Badge variant="secondary" className="mt-2">
              Active Account
            </Badge>
          </div>

          <div className="space-y-3 mt-6 border-t pt-4">
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Joined</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(user.createdAt), "MMM dd, yyyy")}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(user.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Usage Statistics
            </CardTitle>
            <CardDescription>Your activity at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-xl border bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 transition-all hover:shadow-md hover:scale-105">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="rounded-full bg-blue-500/10 p-3">
                    <Bookmark className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {stats.bookmarksCount}
                    </p>
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      Bookmarks
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 p-4 transition-all hover:shadow-md hover:scale-105">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="rounded-full bg-yellow-500/10 p-3">
                    <Folder className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                      {stats.foldersCount}
                    </p>
                    <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                      Folders
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-4 transition-all hover:shadow-md hover:scale-105">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="rounded-full bg-orange-500/10 p-3">
                    <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                      {stats.favoritesCount}
                    </p>
                    <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
                      Favorites
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-4 transition-all hover:shadow-md hover:scale-105">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="rounded-full bg-purple-500/10 p-3">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      {stats.totalNodes}
                    </p>
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
                      Total Items
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
