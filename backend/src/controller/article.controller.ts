import { Request } from "express";
import { getCustomRepository } from "typeorm";
import { NotFoundError } from "../error/errors";
import { ArticleRepository } from "../repository/article.repository";
import { CommentRepository } from "../repository/comment.repository";
import { FollowRepository } from "../repository/follow.repository";
import { NotificationRepository } from "../repository/notification.repository";
import { ReactionRepository } from "../repository/reaction.repository";
import { requireAuth } from "../security/requireAuth.middleware";
import { paginationValidators } from "../validator/pagination.validator";
import { validate } from "../validator/validate.middleware";
import { Controller, RouterConfig } from "./controller";
export class ArticleController extends Controller {
  private articleRepo = getCustomRepository(ArticleRepository);
  private reactionRepo = getCustomRepository(ReactionRepository);
  private commentRepo = getCustomRepository(CommentRepository);
  private notiRepo = getCustomRepository(NotificationRepository);
  private followRepo = getCustomRepository(FollowRepository);
  getRouterConfig(): RouterConfig {
    return {
      basePath: "/articles",
      handlers: [
        {
          method: "post",
          middlewares: [requireAuth],
          handler: this.createArticle,
        },
        {
          method: "get",
          handler: this.getArticles,
          middlewares: [...paginationValidators, validate],
        },
        {
          path: "/reading-list",
          method: "get",
          middlewares: [requireAuth],
          handler: this.getReadingList,
        },
        {
          path: "/feed",
          method: "get",
          middlewares: [requireAuth, ...paginationValidators, validate],
          handler: this.getFeed,
        },
        {
          path: "/:id",
          method: "get",
          handler: this.getArticle,
        },
        {
          path: "/:id",
          method: "put",
          middlewares: [requireAuth],
          handler: this.updateArticle,
        },
        {
          path: "/:id",
          method: "delete",
          middlewares: [requireAuth],
          handler: this.deleteArticle,
        },
        {
          path: "/:id/reactions",
          method: "get",
          handler: this.getArticleReactionsCount,
        },
        {
          path: "/:id/comments",
          method: "get",
          handler: this.getArticleComments,
        },
        {
          path: "/:id/recommendations",
          method: "get",
          handler: this.getRecommendedArticles,
        },
      ],
    };
  }
  async getArticles(req: Request) {
    const sort = req.query.sort as string;
    const articles = await this.articleRepo.findArticles({
      sort,
      ...this.extractPaginationRequest(req),
    });
    return { json: articles };
  }
  async createArticle(req: Request) {
    const user = this.extractCurrentUser(req);
    const article = await this.articleRepo.createArticle(user, {
      content: req.body.content,
      coverImage: req.body.coverImage,
      title: req.body.title,
      tags: req.body.tags,
    });
    const targets = (await this.followRepo.findUserFollowers(user.id)).map(
      (f) => f.user.id
    );
    await this.notiRepo.notify({
      notifiableId: article.id,
      notifiableType: "article",
      source: user,
      targets,
    });
    return {
      status: 201,
      json: article,
    };
  }
  async getArticle(req: Request) {
    const article = await this.articleRepo.findById(req.params.id);
    if (article) {
      return {
        json: article,
      };
    }
    throw new NotFoundError("Article not found");
  }
  async getArticleReactionsCount(req: Request) {
    const reactions = await this.reactionRepo.findArticleReactions(
      req.params.id
    );
    const reactionsCount = reactions.reduce(
      (p, c) => {
        p[c.type]++;
        return p;
      },
      { heart: 0, awesome: 0, save: 0, star: 0 }
    );
    return { json: reactionsCount };
  }
  async updateArticle(req: Request) {
    const article = await this.articleRepo.updateArticle(
      this.extractCurrentUser(req),
      req.params.id,
      {
        content: req.body.content,
        coverImage: req.body.coverImage,
        title: req.body.title,
        tags: req.body.tags,
      }
    );
    if (article) {
      return {
        json: article,
      };
    }
    throw new NotFoundError("Article not found");
  }
  async deleteArticle(req: Request) {
    await this.articleRepo.deleteArticle(
      this.extractCurrentUser(req),
      req.params.id
    );
    return { status: 204 };
  }
  async getArticleComments(req: Request) {
    const comments = await this.commentRepo.findArticleComments(req.params.id);
    if (comments) {
      return { json: comments };
    }
    throw new NotFoundError("Article not found");
  }
  async getReadingList(req: Request) {
    const articles = await this.articleRepo.findSavedArticles(
      this.extractCurrentUser(req).id
    );
    return { json: articles };
  }
  async getFeed(req: Request) {
    const ids = await this.articleRepo.findFeedArticles({
      id: this.extractCurrentUser(req).id,
      pageQuery: this.extractPaginationRequest(req),
    });
    return { json: ids };
  }
  async getRecommendedArticles(req: Request) {
    const articles = await this.articleRepo.findRecommendedArticles(
      req.params.id
    );
    if (articles) {
      return { json: articles };
    }
    throw new NotFoundError("Article not found");
  }
}
