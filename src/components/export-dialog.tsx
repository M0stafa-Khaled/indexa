"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { exportNodes } from "@/lib/actions";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = React.useCallback(async () => {
    setIsExporting(true);
    try {
      const { data, error } = await exportNodes();
      if (error) {
        throw new Error(error);
      }
      if (data) {
        const filename = `indexa-bookmarks-${new Date().toISOString().split("T")[0]}.json`;
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Bookmarks exported successfully");
        onOpenChange(false);
      } else {
        toast.error("Failed to export bookmarks");
      }
    } catch {
      toast.error("Failed to export bookmarks");
    } finally {
      setIsExporting(false);
    }
  }, [onOpenChange]);

  React.useEffect(() => {
    if (open) {
      handleExport();
    }
  }, [open, handleExport]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Bookmarks</DialogTitle>
          <DialogDescription>
            {isExporting
              ? "Preparing your bookmarks for export..."
              : "Export complete"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-8">
          {isExporting ? (
            <Loader2 className="size-6 animate-spin text-primary" />
          ) : (
            <div className="text-center">
              <Download className="size-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Your bookmarks have been downloaded
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
