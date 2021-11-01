export interface User {
  id: string;
  name: string;
  bio: string;
  location: string;
  joinedDate: string;
  githubLink: string;
  articlesCount: number;
  commentsCount: number;
  followersCount: number;
  avatar: string;
  work: string;
  email: string;
}
export type UserPreview = Pick<User, "id" | "name" | "avatar">;
