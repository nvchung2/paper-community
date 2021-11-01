import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { URL } from "url";
import { User } from "../entity/user.entity";
import { passport } from "../security/passport";
import { requireAuth } from "../security/requireAuth.middleware";
import { Controller, RouterConfig } from "./controller";
const client_redirect_url = "http://localhost:3000/login/callback";

export class AuthController extends Controller {
  getRouterConfig(): RouterConfig {
    return {
      basePath: "/auth",
      handlers: [
        {
          method: "get",
          path: "/:provider(github|facebook|google)",
          middlewares: [this.authenticate],
        },
        {
          method: "get",
          path: "/:provider/callback",
          middlewares: [this.authenticate],
          handler: this.callback,
        },
        {
          method: "get",
          path: "/me",
          middlewares: [requireAuth],
          handler: this.me,
        },
      ],
    };
  }
  authenticate(req: Request, res: Response, next: NextFunction) {
    const provider = req.params.provider;
    passport.authenticate(provider, { session: false })(req, res, next);
  }
  callback(req: Request) {
    if (req.user) {
      const url = new URL(client_redirect_url);
      url.searchParams.append(
        "token",
        jwt.sign({ id: (req.user as User).id }, "root")
      );
      return { redirect: url.toString() };
    } else {
      throw Error();
    }
  }
  me(req: Request) {
    return {
      json: req.user,
    };
  }
}
