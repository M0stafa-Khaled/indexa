"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
  type DeleteAccountInput,
} from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  try {
    const userId = await requireAuth();

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return { success: true, user };
  } catch {
    return { error: "Failed to fetch user profile" };
  }
}

export async function updateProfile(data: UpdateProfileInput) {
  try {
    const userId = await requireAuth();

    const validation = updateProfileSchema.safeParse(data);
    if (!validation.success) {
      return { error: "Invalid input data" };
    }

    const updateData: { name?: string; email?: string } = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.email !== undefined) {
      const existingUser = await db.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== userId) {
        return { error: "Email already in use" };
      }

      updateData.email = data.email;
    }

    if (Object.keys(updateData).length === 0) {
      return { error: "No fields to update" };
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });

    revalidatePath("/profile");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Failed to update profile" };
  }
}

export async function changePassword(data: ChangePasswordInput) {
  try {
    const userId = await requireAuth();

    const validation = changePasswordSchema.safeParse(data);
    if (!validation.success) {
      return { error: "Invalid input data" };
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const isPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return { error: "Current password is incorrect" };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    revalidatePath("/profile");
    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Change password error:", error);
    return { error: "Failed to change password" };
  }
}

export async function deleteAccount(data: DeleteAccountInput) {
  try {
    const userId = await requireAuth();

    const validation = deleteAccountSchema.safeParse(data);
    if (!validation.success) {
      return { error: "Invalid input data" };
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return { error: "Incorrect password" };
    }

    await db.$transaction([
      db.bookmarkNode.deleteMany({
        where: { userId },
      }),
      db.user.delete({
        where: { id: userId },
      }),
    ]);

    return { success: true, message: "Account deleted successfully" };
  } catch (error) {
    console.error("Delete account error:", error);
    return { error: "Failed to delete account" };
  }
}

export async function getAccountStats() {
  try {
    const userId = await requireAuth();

    const [bookmarksCount, foldersCount, favoritesCount] = await Promise.all([
      db.bookmarkNode.count({
        where: { userId, type: "BOOKMARK", deletedAt: null },
      }),
      db.bookmarkNode.count({
        where: { userId, type: "FOLDER", deletedAt: null },
      }),
      db.bookmarkNode.count({
        where: { userId, isFavorite: true, deletedAt: null },
      }),
    ]);

    return {
      success: true,
      stats: {
        bookmarksCount,
        foldersCount,
        favoritesCount,
        totalNodes: bookmarksCount + foldersCount,
      },
    };
  } catch (error) {
    console.error("Get account stats error:", error);
    return { error: "Failed to fetch account stats" };
  }
}
