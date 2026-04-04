"use client";

import * as React from "react";
import { AuthHeroPanel } from "./auth-hero-panel";
import { AuthFormContainer } from "./auth-form-container";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

type AuthMode = "login" | "register";

export function AuthPages() {
  const [mode, setMode] = React.useState<AuthMode>("login");

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <div className="flex min-h-screen">
      <AuthHeroPanel />

      <AuthFormContainer mode={mode}>
        {mode === "login" ? (
          <LoginForm key="login" onModeChange={toggleMode} />
        ) : (
          <RegisterForm key="register" onModeChange={toggleMode} />
        )}
      </AuthFormContainer>
    </div>
  );
}
