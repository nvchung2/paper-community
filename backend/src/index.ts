import cors from "cors";
import express from "express";
import { createConnection } from "typeorm";
import { ArticleController } from "./controller/article.controller";
import { AuthController } from "./controller/auth.controller";
import { CommentController } from "./controller/comment.controller";
import { FollowController } from "./controller/follow.controller";
import { NotificationController } from "./controller/notification.controller";
import { ReactionController } from "./controller/reaction.controller";
import { SearchController } from "./controller/search.controller";
import { TagController } from "./controller/tag.controller";
import { UserController } from "./controller/user.controller";
import {
  globalErrorHandler,
  notFoundErrorHandler,
} from "./error/error-handlers";
import { passport } from "./security/passport";
import config from "./config";
createConnection()
  .then(() => {
    const app = express();
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(passport.initialize());

    app.use(new AuthController().init());
    app.use(new UserController().init());
    app.use(new FollowController().init());
    app.use(new ReactionController().init());
    app.use(new ArticleController().init());
    app.use(new TagController().init());
    app.use(new CommentController().init());
    app.use(new SearchController().init());
    app.use(new NotificationController().init());

    app.use(notFoundErrorHandler);
    app.use(globalErrorHandler);
    app.listen(process.env.PORT);
  })
  .catch(console.log);
