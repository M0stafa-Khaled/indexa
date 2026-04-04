"use client";

import * as React from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImportDialog } from "./import-dialog";
import { ExportDialog } from "./export-dialog";

interface ImportExportButtonsProps {
  onImportComplete?: () => void;
}

export function ImportExportButtons({
  onImportComplete,
}: ImportExportButtonsProps) {
  const [importOpen, setImportOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="size-8 text-muted-foreground"
        onClick={() => setExportOpen(true)}
        title="Export bookmarks"
      >
        <Download className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="size-8 text-muted-foreground"
        onClick={() => setImportOpen(true)}
        title="Import bookmarks"
      >
        <Upload className="size-4" />
      </Button>

      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImportSuccess={onImportComplete}
      />
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </>
  );
}
