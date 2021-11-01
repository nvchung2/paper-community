import { Request } from "express";
import { getCustomRepository } from "typeorm";
import { NotificationRepository } from "../repository/notification.repository";
import { requireAuth } from "../security/requireAuth.middleware";
import { Controller, RouterConfig } from "./controller";

export class NotificationController extends Controller {
  private notiRepo = getCustomRepository(NotificationRepository);
  getRouterConfig(): RouterConfig {
    return {
      basePath: "/notifications",
      handlers: [
        {
          method: "get",
          middlewares: [requireAuth],
          handler: this.getNotifications,
        },
        {
          path: "/unread_count",
          method: "get",
          middlewares: [requireAuth],
          handler: this.getUnreadNotificationsCount,
        },
        {
          path: "/read",
          method: "post",
          middlewares: [requireAuth],
          handler: this.markNotificationsAsRead,
        },
      ],
    };
  }
  async getNotifications(req: Request) {
    const notis = await this.notiRepo.findUserNotifications(
      this.extractCurrentUser(req).id
    );
    return { json: notis };
  }
  async getUnreadNotificationsCount(req: Request) {
    const count = await this.notiRepo.getUnreadNotificationsCount(
      this.extractCurrentUser(req).id
    );
    return { json: { count } };
  }
  async markNotificationsAsRead(req: Request) {
    await this.notiRepo.markUserNotificationsAsRead(
      this.extractCurrentUser(req).id
    );
    return { status: 200 };
  }
}
