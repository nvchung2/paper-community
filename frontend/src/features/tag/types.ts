export interface Tag {
  id: string;
  name: string;
  followersCount: number;
  articlesCount: number;
}
export type TagPreview = Pick<Tag, "id" | "name">;
