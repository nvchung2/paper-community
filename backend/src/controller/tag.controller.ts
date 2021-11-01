import { Request } from "express";
import { getCustomRepository } from "typeorm";
import { NotFoundError } from "../error/errors";
import { ArticleRepository } from "../repository/article.repository";
import { TagRepository } from "../repository/tag.repository";
import { paginationValidators } from "../validator/pagination.validator";
import { validate } from "../validator/validate.middleware";
import { Controller, RouterConfig } from "./controller";

export class TagController extends Controller {
  private tagRepo = getCustomRepository(TagRepository);
  private articleRepo = getCustomRepository(ArticleRepository);
  getRouterConfig(): RouterConfig {
    return {
      basePath: "/tags",
      handlers: [
        {
          method: "get",
          handler: this.getTags,
        },
        {
          path: "/top",
          method: "get",
          handler: this.getTopTags,
        },
        {
          path: "/:id/articles",
          method: "get",
          middlewares: [...paginationValidators, validate],
          handler: this.getTagArticles,
        },
        {
          path: "/:id",
          method: "get",
          handler: this.getTag,
        },
      ],
    };
  }
  async getTags() {
    const tags = await this.tagRepo.find();
    return {
      json: tags,
    };
  }
  async getTag(req: Request) {
    const tag = await this.tagRepo.findById(req.params.id);
    if (tag) {
      return { json: tag };
    }
    throw new NotFoundError("Tag not found");
  }
  async getTagArticles(req: Request) {
    const filter = req.query.filter as string;
    const sort = req.query.sort as string;
    const id = req.params.id;
    const articles = await this.articleRepo.findTagArticles({
      id,
      filter,
      sort,
      ...this.extractPaginationRequest(req),
    });
    return { json: articles };
  }
  async getTopTags() {
    const tags = await this.tagRepo.findTopTags();
    return { json: tags };
  }
}
