import { UserPreview } from "features/profile/types";

export type Notification = {
  id: string;
  notifiableId: string;
  createdTime: string;
  read: boolean;
  source: UserPreview;
} & (
  | { notifiableType: "article" | "follow" }
  | {
      notifiableType: "comment" | "reply";
      data: { articleId: string };
    }
  | {
      notifiableType: "react";
      data:
        | { targetType: "article"; id: string }
        | { targetType: "comment"; id: string; articleId: string };
    }
);
