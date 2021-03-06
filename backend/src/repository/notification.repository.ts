import { AbstractRepository, EntityRepository } from "typeorm";
import { Notification } from "../entity/notification.entity";
import { Reaction } from "../entity/reaction.entity";
import { User } from "../entity/user.entity";
import { UserRepository } from "./user.repository";
export type NotifyDTO = {
  source: User;
  targets: string[];
  data?: object;
} & (
  | { notifiableType: "article" | "follow" }
  | {
      notifiableType: "comment" | "reply";
      data: { articleId: string };
    }
  | {
      notifiableType: "react";
      data: {
        id: string;
      } & Pick<Reaction, "type"> &
        (
          | {
              targetType: "article";
            }
          | {
              targetType: "comment";
              articleId: string;
            }
        );
    }
) &
  Pick<Notification, "notifiableId">;
@EntityRepository(Notification)
export class NotificationRepository extends AbstractRepository<Notification> {
  findUserNotifications(id: string) {
    return this.createQueryBuilder("noti")
      .where("noti.targetId=:id", { id })
      .innerJoinAndSelect("noti.source", "src")
      .select(["noti", ...UserRepository.selectUserPreview("src")])
      .orderBy("noti.createdTime", "DESC")
      .getMany();
  }
  getUnreadNotificationsCount(id: string) {
    return this.createQueryBuilder("noti")
      .where("noti.targetId=:id", { id })
      .andWhere("noti.read=false")
      .getCount();
  }
  notify(dto: NotifyDTO) {
    const values = dto.targets.map((targetId) => {
      return this.repository.create({
        data: dto.data,
        notifiableId: dto.notifiableId,
        notifiableType: dto.notifiableType,
        source: dto.source,
        targetId,
      });
    });
    return this.repository.save(values);
  }
  markUserNotificationsAsRead(id: string) {
    return this.repository
      .createQueryBuilder()
      .update()
      .set({
        read: true,
      })
      .where("targetId=:id", { id })
      .execute();
  }
}
