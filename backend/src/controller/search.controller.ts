import { Request } from "express";
import { getCustomRepository } from "typeorm";
import { ArticleRepository } from "../repository/article.repository";
import { CommentRepository } from "../repository/comment.repository";
import { UserRepository } from "../repository/user.repository";
import { searchValidators } from "../validator/search.validator";
import { validate } from "../validator/validate.middleware";
import { Controller, RouterConfig } from "./controller";

export class SearchController extends Controller {
  private articleRepo = getCustomRepository(ArticleRepository);
  private commentRepo = getCustomRepository(CommentRepository);
  private userRepo = getCustomRepository(UserRepository);
  getRouterConfig(): RouterConfig {
    return {
      basePath: "/search",
      handlers: [
        {
          method: "get",
          path: "/articles",
          middlewares: [...searchValidators, validate],
          handler: this.searchArticles,
        },
        {
          method: "get",
          path: "/users",
          middlewares: [...searchValidators, validate],
          handler: this.searchUsers,
        },
        {
          method: "get",
          path: "/comments",
          middlewares: [...searchValidators, validate],
          handler: this.searchComments,
        },
      ],
    };
  }
  async searchArticles(req: Request) {
    const q = req.query.q as string;
    const sort = req.query.sort as string;
    const articles = await this.articleRepo.searchArticles({
      q,
      sort,
    });
    return { json: articles };
  }
  async searchComments(req: Request) {
    const q = req.query.q as string;
    const sort = req.query.sort as string;
    const comments = await this.commentRepo.searchComments({
      q,
      sort,
    });
    return { json: comments };
  }
  async searchUsers(req: Request) {
    const q = req.query.q as string;
    const sort = req.query.sort as string;
    const users = await this.userRepo.searchUsers({
      q,
      sort,
    });
    return { json: users };
  }
}
