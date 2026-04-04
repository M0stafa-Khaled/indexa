"use server";

import { db } from "@/lib/db";
import { registerSchema, loginSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";

export const registerUser = async (
  email: string,
  password: string,
  name?: string,
) => {
  try {
    const result = registerSchema.safeParse({
      email,
      password,
      name,
      confirmPassword: password,
    });

    if (!result.success) {
      throw new Error(
        `Validation failed: ${JSON.stringify(result.error.flatten().fieldErrors)}`,
      );
    }

    const {
      email: validatedEmail,
      password: validatedPassword,
      name: validatedName,
    } = result.data;

    const existingUser = await db.user.findUnique({
      where: { email: validatedEmail },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(validatedPassword, 12);

    const user = await db.user.create({
      data: {
        email: validatedEmail,
        password: hashedPassword,
        name: validatedName || validatedEmail.split("@")[0],
      },
    });

    // Create a default "Bookmarks" folder for the new user
    await db.bookmarkNode.create({
      data: {
        userId: user.id,
        type: "FOLDER",
        title: "Bookmarks",
        description: "My bookmark collection",
      },
    });

    return {
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      error: null,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      user: null,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
};

export const validateCredentials = async (email: string, password: string) => {
  try {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      throw new Error("Invalid email or password format");
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return {
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      error: null,
    };
  } catch (error) {
    console.error("Validation error:", error);
    return {
      success: false,
      user: null,
      error: error instanceof Error ? error.message : "Validation failed",
    };
  }
};
