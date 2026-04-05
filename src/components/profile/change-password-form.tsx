"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/lib/actions/profile-actions";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "../ui/form";

const PASSWORD_INPUTS = [
  {
    name: "currentPassword",
    label: "Current Password",
    placeholder: "Enter current password",
  },
  {
    name: "newPassword",
    label: "New Password",
    placeholder: "Enter new password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm new password",
  },
];

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsLoading(true);
    try {
      const result = await changePassword(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Password changed successfully");
        form.reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch {
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            {PASSWORD_INPUTS.map((input) => (
              <FormField
                key={input.name}
                control={form.control}
                name={input.name as keyof ChangePasswordInput}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{input.label}</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder={input.placeholder}
                          type={showPasswords[input.name] ? "text" : "password"}
                          autoComplete="current-password"
                          className="pl-9 pr-10 input-glow transition-shadow duration-200"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 size-9 hover:text-foreground transition-colors duration-150"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            [input.name]: !prev[input.name],
                          }))
                        }
                        tabIndex={-1}
                      >
                        {showPasswords[input.name] ? (
                          <EyeOff className="size-4 text-muted-foreground" />
                        ) : (
                          <Eye className="size-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                    {input.name === "newPassword" && (
                      <FormDescription>
                        Must be at least 6 characters long
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
              className="w-full gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
