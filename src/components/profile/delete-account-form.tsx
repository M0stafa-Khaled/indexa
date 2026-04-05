"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteAccount } from "@/lib/actions/profile-actions";
import { deleteAccountSchema, type DeleteAccountInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle, Shield } from "lucide-react";
import { signOut } from "next-auth/react";

export function DeleteAccountForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: DeleteAccountInput) => {
    setIsLoading(true);
    try {
      const result = await deleteAccount(data);
      if (result.error) {
        toast.error(result.error);
        setIsLoading(false);
      } else {
        toast.success("Account deleted successfully");
        await signOut({ redirectTo: "/" });
      }
    } catch {
      toast.error("Failed to delete account");
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 mb-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-destructive">
                Warning: This is irreversible
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>All your bookmarks will be permanently deleted</li>
                <li>All your folders will be permanently deleted</li>
                <li>All your favorites will be permanently deleted</li>
                <li>Your account cannot be recovered</li>
              </ul>
            </div>
          </div>
        </div>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full gap-2">
              <Trash2 className="h-4 w-4" />
              Delete My Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Delete Account?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                This action <strong>cannot be undone</strong>. This will
                permanently delete your account and remove all your data from
                our servers.
                <span className="text-sm block">
                  Please enter your password and type{" "}
                  <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">
                    DELETE
                  </code>{" "}
                  to confirm.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmation">
                  Type <strong>DELETE</strong> to confirm
                </Label>
                <Input
                  id="confirmation"
                  placeholder="DELETE"
                  className="font-mono"
                  {...register("confirmation")}
                />
                {errors.confirmation && (
                  <p className="text-sm text-destructive">
                    {errors.confirmation.message}
                  </p>
                )}
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    reset();
                    setIsDialogOpen(false);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={
                    isLoading || !!errors.password || !!errors.confirmation
                  }
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </>
                  )}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
