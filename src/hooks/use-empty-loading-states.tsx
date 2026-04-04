"use client";

import * as React from "react";

export const useEmptyState = () => {
  const EmptyStateComponent = React.memo(
    ({
      icon: Icon,
      title,
      description,
    }: {
      icon: React.ComponentType<{ className?: string }>;
      title: string;
      description: string;
    }) => (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 text-muted-foreground">
          <Icon className="size-12" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          {description}
        </p>
      </div>
    ),
  );
  EmptyStateComponent.displayName = "EmptyState";
  return EmptyStateComponent;
};

export const useLoadingState = () => {
  const LoadingStateComponent = React.memo(() => (
    <div className="flex h-full items-center justify-center">
      <div className="text-sm text-muted-foreground">Loading...</div>
    </div>
  ));
  LoadingStateComponent.displayName = "LoadingState";
  return LoadingStateComponent;
};
