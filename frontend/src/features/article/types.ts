import { UserPreview } from "features/profile/types";
import { TagPreview } from "features/tag/types";

export interface Article {
  id: string;
  createdTime: string;
  coverImage: string;
  title: string;
  content: string;
  commentsCount: number;
  viewsCount: number;
  readingTime: number;
  authorId: string;
  reactionsCount: number;
  author: UserPreview;
  tags: TagPreview[];
}
export type CreateOrUpdateArticle = Pick<
  Article,
  "title" | "content" | "coverImage" | "tags"
>;
