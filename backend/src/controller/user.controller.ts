import { Request } from "express";
import { getCustomRepository } from "typeorm";
import { NotFoundError } from "../error/errors";
import { ArticleRepository } from "../repository/article.repository";
import { CommentRepository } from "../repository/comment.repository";
import { FollowRepository } from "../repository/follow.repository";
import { UserRepository } from "../repository/user.repository";
import { requireAuth } from "../security/requireAuth.middleware";
import { paginationValidators } from "../validator/pagination.validator";
import { validate } from "../validator/validate.middleware";
import { Controller, RouterConfig } from "./controller";

export class UserController extends Controller {
  private userRepo = getCustomRepository(UserRepository);
  private articleRepo = getCustomRepository(ArticleRepository);
  private commentRepo = getCustomRepository(CommentRepository);
  private followRepo = getCustomRepository(FollowRepository);
  getRouterConfig(): RouterConfig {
    return {
      basePath: "/users",
      handlers: [
        {
          method: "get",
          path: "/top",
          handler: this.getTopUsers,
        },
        {
          method: "get",
          path: "/:id/profile",
          handler: this.getProfile,
        },
        {
          method: "get",
          path: "/:id/articles",
          middlewares: [...paginationValidators, validate],
          handler: this.getUserArticles,
        },
        {
          method: "get",
          path: "/:id/comments",
          middlewares: [...paginationValidators, validate],
          handler: this.getUserComments,
        },
        {
          method: "get",
          path: "/:id/followers",
          middlewares: [...paginationValidators, validate],
          handler: this.getUserFollowers,
        },
        {
          method: "put",
          path: "/profile",
          middlewares: [requireAuth],
          handler: this.updateProfile,
        },
      ],
    };
  }
  async getProfile(req: Request) {
    const id = req.params.id;
    const profile = await this.userRepo.findById(id);
    if (profile) {
      return {
        json: profile,
      };
    }
    throw new NotFoundError(`Can not found user profile with id ${id}`);
  }
  async getUserArticles(req: Request) {
    const articles = await this.articleRepo.findUserArticles(req.params.id);
    return {
      json: articles,
    };
  }
  async getUserComments(req: Request) {
    const comments = await this.commentRepo.findUserComments(req.params.id);
    return {
      json: comments,
    };
  }
  async getUserFollowers(req: Request) {
    const followers = await this.followRepo.findUserFollowers(req.params.id);
    return {
      json: followers,
    };
  }
  async updateProfile(req: Request) {
    const user = await this.userRepo.updateProfile(
      this.extractCurrentUser(req),
      {
        avatar: req.body.avatar,
        bio: req.body.bio,
        email: req.body.email,
        githubLink: req.body.githubLink,
        location: req.body.location,
        name: req.body.name,
        work: req.body.work,
      }
    );
    return {
      status: 200,
      json: user,
    };
  }
  async getTopUsers() {
    const users = await this.userRepo.findTopUsers();
    return { json: users };
  }
}
