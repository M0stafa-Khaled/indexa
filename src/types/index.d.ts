export interface BookmarkNode {
  id: string;
  userId: string;
  parentId: string | null;
  type: "BOOKMARK" | "FOLDER";
  title: string;
  description: string | null;
  url: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  parent?: { id: string; title: string } | null;
}

export interface TreeNode extends BookmarkNode {
  children: TreeNode[];
}

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "date-newest"
  | "date-oldest"
  | "type";
export type ViewMode = "tree" | "favorites" | "trash";
