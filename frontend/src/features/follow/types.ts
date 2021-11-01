export interface Follow {
  id: string;
  followableId: string;
  followableType: "user" | "tag";
}
