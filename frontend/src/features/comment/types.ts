import { UserPreview } from "features/profile/types";

export interface Comment {
  id: string;
  content: string;
  createdTime: string;
  heartsCount: number;
  author: UserPreview;
  articleId: string;
  childrenCount: number;
  children: Comment[];
}
export type CreateComment = Pick<Comment, "articleId" | "content"> & {
  parentId?: string;
};
