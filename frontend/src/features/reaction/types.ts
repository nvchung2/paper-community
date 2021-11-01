export type ReactableType = "article" | "comment";
export type ReactType = "heart" | "awesome" | "save" | "star";
export interface Reaction {
  id: string;
  reactableId: string;
  reactableType: ReactableType;
  type: ReactType;
}
