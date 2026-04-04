"use client";

import * as React from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { RegisterInput } from "@/lib/schemas";

interface RegisterFormFieldsProps {
  form: UseFormReturn<RegisterInput>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onShowPasswordChange: (show: boolean) => void;
  onShowConfirmPasswordChange: (show: boolean) => void;
}

export function RegisterFormFields({
  form,
  showPassword,
  showConfirmPassword,
  onShowPasswordChange,
  onShowConfirmPasswordChange,
}: RegisterFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <FormControl>
                <Input
                  placeholder="John Doe"
                  autoComplete="name"
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
            <FormLabel>Password</FormLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <FormControl>
                <Input
                  placeholder="At least 6 characters"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <FormControl>
                <Input
                  placeholder="Confirm your password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="pl-9 pr-10 input-glow transition-shadow duration-200"
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 size-9 hover:text-foreground transition-colors duration-150"
                onClick={() => onShowConfirmPasswordChange(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
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
