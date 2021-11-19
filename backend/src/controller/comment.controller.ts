import { Request } from "express";
import { getCustomRepository } from "typeorm";
import { ArticleRepository } from "../repository/article.repository";
import { CommentRepository } from "../repository/comment.repository";
import { NotificationRepository } from "../repository/notification.repository";
import { requireAuth } from "../security/requireAuth.middleware";
import {
  createCommentValidators,
  updateCommentValidators,
} from "../validator/comment.validator";
import { validate } from "../validator/validate.middleware";
import { Controller, RouterConfig } from "./controller";

export class CommentController extends Controller {
  private commentRepo = getCustomRepository(CommentRepository);
  private articleRepo = getCustomRepository(ArticleRepository);
  private notiRepo = getCustomRepository(NotificationRepository);
  getRouterConfig(): RouterConfig {
    return {
      basePath: "/comments",
      handlers: [
        {
          method: "post",
          middlewares: [requireAuth, ...createCommentValidators, validate],
          handler: this.createComment,
        },
        {
          path: "/:id",
          method: "put",
          middlewares: [requireAuth, ...updateCommentValidators, validate],
          handler: this.updateComment,
        },
        {
          path: "/:id",
          method: "delete",
          middlewares: [requireAuth],
          handler: this.deleteComment,
        },
      ],
    };
  }
  async createComment(req: Request) {
    const user = this.extractCurrentUser(req);
    const parentId = req.body.parentId;
    const comment = await this.commentRepo.createComment(
      user,
      {
        articleId: req.body.articleId,
        content: req.body.content,
      },
      parentId
    );
    if (comment) {
      const targets = [
        parentId
          ? (await this.commentRepo.findById(parentId))!.author.id
          : (await this.articleRepo.findById(comment.articleId))!.author.id,
      ];
      targets[0] != user.id &&
        this.notiRepo
          .notify({
            notifiableId: comment.id,
            data: { articleId: comment.articleId },
            source: user,
            notifiableType: parentId ? "reply" : "comment",
            targets,
          })
          .catch(console.log);
    }
    return {
      status: 201,
      json: comment,
    };
  }
  async updateComment(req: Request) {
    const comment = await this.commentRepo.updateComment(
      this.extractCurrentUser(req),
      req.params.id,
      { content: req.body.content }
    );
    return { json: comment };
  }
  async deleteComment(req: Request) {
    await this.commentRepo.deleteComment(
      this.extractCurrentUser(req),
      req.params.id
    );
    return { status: 204 };
  }
}
