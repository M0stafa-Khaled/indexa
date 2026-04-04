"use client";

import * as React from "react";
import { Upload, FileJson, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { importNodes } from "@/lib/actions";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess?: () => void;
}

export function ImportDialog({
  open,
  onOpenChange,
  onImportSuccess,
}: ImportDialogProps) {
  const [importMode, setImportMode] = React.useState<"paste" | "file">("paste");
  const [jsonText, setJsonText] = React.useState("");
  const [isImporting, setIsImporting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState("");

  const handleImport = async () => {
    if (importMode === "paste" && !jsonText.trim()) {
      toast.error("Please paste JSON data or upload a file");
      return;
    }

    setIsImporting(true);
    try {
      let data: unknown;
      if (importMode === "file" && fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        const text = await file.text();
        data = JSON.parse(text);
      } else {
        data = JSON.parse(jsonText);
      }

      const { success, imported, error } = await importNodes(
        data as
          | {
              title: string;
              type: "bookmark" | "folder";
              url?: string | null;
              description?: string | null;
              isFavorite?: boolean;
              children?: any;
            }[]
          | {
              nodes: {
                title: string;
                type: "bookmark" | "folder";
                url?: string | null;
                description?: string | null;
                isFavorite?: boolean;
                children?: any;
              }[];
            },
      );

      if (error) {
        throw new Error(error);
      }

      if (success) {
        toast.success(`Imported ${imported} item(s) successfully`);
        onOpenChange(false);
        setJsonText("");
        setFileName("");
        onImportSuccess?.();
      } else {
        toast.error("Failed to import bookmarks");
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        toast.error("Invalid JSON format");
      } else {
        toast.error("Failed to import bookmarks");
      }
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setJsonText("");
      setFileName("");
      setImportMode("paste");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="size-5 text-primary" />
            Import Bookmarks
          </DialogTitle>
          <DialogDescription>
            Import bookmarks from a JSON file or paste JSON data directly.
          </DialogDescription>
        </DialogHeader>

        {/* Import mode tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              importMode === "paste"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setImportMode("paste")}
          >
            <FileJson className="size-3.5" />
            Paste JSON
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              importMode === "file"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setImportMode("file")}
          >
            <UploadCloud className="size-3.5" />
            Upload File
          </button>
        </div>

        <Separator />

        {importMode === "paste" ? (
          <div className="space-y-2">
            <Label className="text-xs">JSON Data</Label>
            <Textarea
              placeholder={
                '[\n  {\n    "title": "My Bookmark",\n    "type": "bookmark",\n    "url": "https://example.com"\n  }\n]'
              }
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="min-h-45 font-mono text-xs"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <Label className="text-xs">JSON File</Label>
            <div className="flex items-center gap-3">
              <Label
                htmlFor="import-file"
                className="flex-1 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 px-4 py-8 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                <UploadCloud className="size-8 text-muted-foreground/50" />
                <div className="text-center">
                  <span className="text-sm font-medium">
                    {fileName || "Click to select a .json file"}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    JSON bookmark files supported
                  </p>
                </div>
                <Input
                  ref={fileInputRef}
                  id="import-file"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isImporting}>
            {isImporting ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="mr-1.5 size-3.5" />
                Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
