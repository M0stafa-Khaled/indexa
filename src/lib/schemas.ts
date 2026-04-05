import { z } from "zod";

export const NodeType = z.enum(["bookmark", "folder"]);

export const createFolderSchema = z.object({
  parentId: z.string().optional(),
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().max(1000).optional(),
});

export const createBookmarkSchema = z.object({
  parentId: z.string().optional(),
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().max(1000).optional(),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const updateNodeSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title too long")
    .optional(),
  description: z.string().max(1000).optional().nullable(),
  url: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
  isFavorite: z.boolean().optional(),
});

export const moveNodeSchema = z.object({
  newParentId: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name too long")
      .optional(),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const searchNodesSchema = z.object({
  query: z.string().optional(),
  type: NodeType.optional(),
});

type ImportNode = {
  title: string;
  type: "bookmark" | "folder";
  url?: string | null;
  description?: string | null;
  children?: ImportNode[];
};

const importNodeSchema: z.ZodType<ImportNode> = z.lazy(() =>
  z.object({
    title: z.string().min(1),
    type: z.enum(["bookmark", "folder"]),
    url: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    children: z.array(importNodeSchema).optional(),
  }),
);

export const importSchema = z.object({
  nodes: z.array(importNodeSchema).min(1, "At least one node is required"),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type UpdateNodeInput = z.infer<typeof updateNodeSchema>;
export type MoveNodeInput = z.infer<typeof moveNodeSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type SearchNodesInput = z.infer<typeof searchNodesSchema>;
export type ImportInput = z.infer<typeof importSchema>;

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
  confirmation: z.literal("DELETE", {
    message: 'Type "DELETE" to confirm',
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
