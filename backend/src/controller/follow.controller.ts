import { Request } from "express";
import { getCustomRepository } from "typeorm";
import { FollowRepository } from "../repository/follow.repository";
import { NotificationRepository } from "../repository/notification.repository";
import { requireAuth } from "../security/requireAuth.middleware";
import { followValidators } from "../validator/follow.validator";
import { validate } from "../validator/validate.middleware";
import { Controller, RouterConfig } from "./controller";

export class FollowController extends Controller {
  private followRepo = getCustomRepository(FollowRepository);
  private notiRepo = getCustomRepository(NotificationRepository);
  getRouterConfig(): RouterConfig {
    return {
      basePath: "/follows",
      handlers: [
        {
          method: "get",
          middlewares: [requireAuth],
          handler: this.getCurrentUserFollows,
        },
        {
          method: "post",
          middlewares: [requireAuth, followValidators, validate],
          handler: this.createFollow,
        },
        {
          method: "delete",
          path: "/:id",
          middlewares: [requireAuth],
          handler: this.unfollow,
        },
      ],
    };
  }
  async getCurrentUserFollows(req: Request) {
    const follows = await this.followRepo.findUserFollows(
      this.extractCurrentUser(req).id
    );
    return {
      json: follows,
    };
  }
  async createFollow(req: Request) {
    const user = this.extractCurrentUser(req);
    const follow = await this.followRepo.createFollow(user, {
      followableId: req.body.followableId,
      followableType: req.body.followableType,
    });
    if (follow && follow.followableType == "user") {
      this.notiRepo
        .notify({
          notifiableId: follow.id,
          notifiableType: "follow",
          source: user,
          targets: [follow.followableId],
        })
        .catch(console.log);
    }
    return {
      status: 201,
      json: follow,
    };
  }
  async unfollow(req: Request) {
    await this.followRepo.unFollow(this.extractCurrentUser(req), req.params.id);
    return {
      status: 204,
    };
  }
}
