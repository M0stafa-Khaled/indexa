"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { registerSchema } from "@/lib/schemas";
import type { RegisterInput } from "@/lib/schemas";
import { registerUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { RegisterFormFields } from "./register-form-fields";

interface RegisterFormProps {
  onSuccess?: () => void;
  onModeChange?: () => void;
}

export function RegisterForm({ onSuccess, onModeChange }: RegisterFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", name: "", confirmPassword: "" },
  });

  const handleSubmit = async (values: RegisterInput) => {
    setIsLoading(true);
    try {
      const { success, user, error } = await registerUser(
        values.email,
        values.password,
        values.name,
      );

      if (!success || error) {
        throw new Error(error || "Registration failed");
      }

      toast.success("Account created! Signing you in...");

      // Auto-login after registration
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(
          "Account created but auto-login failed. Please sign in manually.",
        );
        onModeChange?.();
      } else {
        onSuccess?.();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      key="register-form"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <RegisterFormFields
            form={form}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onShowPasswordChange={setShowPassword}
            onShowConfirmPasswordChange={setShowConfirmPassword}
          />

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
            Create Account
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onModeChange}
              className="text-primary font-medium hover:underline underline-offset-4 decoration-primary/30 hover:decoration-primary/60 transition-all duration-200"
            >
              Sign in
            </button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
