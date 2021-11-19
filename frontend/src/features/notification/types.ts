import { UserPreview } from "features/profile/types";
import { Reaction } from "features/reaction/types";

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
      data: { id: string } & Pick<Reaction, "type"> &
        (
          | { targetType: "article" }
          | { targetType: "comment"; articleId: string }
        );
    }
);
