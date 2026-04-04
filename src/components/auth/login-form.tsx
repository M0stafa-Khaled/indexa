"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { loginSchema } from "@/lib/schemas";
import type { LoginInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoginFormFields } from "./login-form-fields";

interface LoginFormProps {
  onSuccess?: () => void;
  onModeChange?: () => void;
}

export function LoginForm({ onSuccess, onModeChange }: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = async (values: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        onSuccess?.();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      key="login-form"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <LoginFormFields form={form} showPassword={showPassword} onShowPasswordChange={setShowPassword} />

          <Button
            type="submit"
            className="w-full bg-linear-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white shadow-md hover:shadow-lg transition-shadow duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 size-4" />
            )}
            Sign In
          </Button>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onModeChange}
              className="text-primary font-medium hover:underline underline-offset-4 decoration-primary/30 hover:decoration-primary/60 transition-all duration-200"
            >
              Create one
            </button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
