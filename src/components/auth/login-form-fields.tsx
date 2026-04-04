"use client";

import * as React from "react";
import { Eye, EyeOff, Info, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UseFormReturn } from "react-hook-form";
import type { LoginInput } from "@/lib/schemas";

interface LoginFormFieldsProps {
  form: UseFormReturn<LoginInput>;
  showPassword: boolean;
  onShowPasswordChange: (show: boolean) => void;
}

export function LoginFormFields({
  form,
  showPassword,
  onShowPasswordChange,
}: LoginFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  className="pl-9 input-glow transition-shadow duration-200"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Password</FormLabel>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    Forgot password?
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center gap-1.5">
                    <Info className="size-3" />
                    Password reset coming soon
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
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
                onClick={() => onShowPasswordChange(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="size-4 text-muted-foreground" />
                ) : (
                  <Eye className="size-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
