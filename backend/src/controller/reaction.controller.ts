import { Request } from "express";
import { getCustomRepository } from "typeorm";
import { ArticleRepository } from "../repository/article.repository";
import { CommentRepository } from "../repository/comment.repository";
import { NotificationRepository } from "../repository/notification.repository";
import { ReactionRepository } from "../repository/reaction.repository";
import { requireAuth } from "../security/requireAuth.middleware";
import { reactionValidators } from "../validator/reaction.validator";
import { validate } from "../validator/validate.middleware";
import { Controller, RouterConfig } from "./controller";

export class ReactionController extends Controller {
  private reactionRepo = getCustomRepository(ReactionRepository);
  private notiRepo = getCustomRepository(NotificationRepository);
  private commentRepo = getCustomRepository(CommentRepository);
  private articleRepo = getCustomRepository(ArticleRepository);
  getRouterConfig(): RouterConfig {
    return {
      basePath: "/reactions",
      handlers: [
        {
          method: "get",
          middlewares: [requireAuth],
          handler: this.getCurrentUserReactions,
        },
        {
          method: "post",
          middlewares: [requireAuth, ...reactionValidators, validate],
          handler: this.createReaction,
        },
        {
          path: "/:id",
          method: "delete",
          middlewares: [requireAuth],
          handler: this.removeReaction,
        },
      ],
    };
  }
  async getCurrentUserReactions(req: Request) {
    const reactions = await this.reactionRepo.findUserReactions(
      this.extractCurrentUser(req).id
    );
    return {
      json: reactions,
    };
  }
  async createReaction(req: Request) {
    const user = this.extractCurrentUser(req);
    const reaction = await this.reactionRepo.createReaction(user, {
      reactableId: req.body.reactableId,
      reactableType: req.body.reactableType,
      type: req.body.type,
    });
    if (!reaction) throw new Error();
    const targets = [
      reaction.reactableType == "article"
        ? (await this.articleRepo.findById(reaction.reactableId))!.author.id
        : (await this.commentRepo.findById(reaction.reactableId))!.author.id,
    ];
    if (user.id != targets[0]) {
      this.notiRepo.notify({
        notifiableId: reaction.id,
        notifiableType: "react",
        data:
          reaction.reactableType == "article"
            ? {
                targetType: "article",
                type: reaction.type,
                id: reaction.reactableId,
              }
            : {
                targetType: "comment",
                type: reaction.type,
                id: reaction.reactableId,
                articleId: (await this.commentRepo.findById(
                  reaction.reactableId
                ))!.articleId,
              },
        source: user,
        targets,
      });
    }
    return {
      status: 201,
      json: reaction,
    };
  }
  async removeReaction(req: Request) {
    await this.reactionRepo.removeReaction(
      this.extractCurrentUser(req),
      req.params.id
    );
    return { status: 204 };
  }
}
