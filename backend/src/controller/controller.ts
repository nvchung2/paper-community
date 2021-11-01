import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { User } from "../entity/user.entity";

interface ApiResponse {
  status?: number;
  json?: object;
  redirect?: string;
}
interface Middleware {
  path?: string;
  handler: RequestHandler;
}
interface Handler {
  method: "get" | "post" | "put" | "delete" | "patch";
  path?: string;
  handler?: (req: Request, res: Response) => ApiResponse | Promise<ApiResponse>;
  middlewares?: RequestHandler[];
}
export interface RouterConfig {
  basePath?: string;
  handlers: Handler[];
  middlewares?: Middleware[];
}
function joinPath(base: string, path: string) {
  return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}
export abstract class Controller {
  abstract getRouterConfig(): RouterConfig;
  private router = express.Router();
  private handleRequest(
    handler: (req: Request, res: Response) => ApiResponse | Promise<ApiResponse>
  ) {
    return (req: Request, resp: Response, next: NextFunction) => {
      const res = handler.call(this, req, resp);
      const respond = (ar: ApiResponse) => {
        if (ar.redirect) {
          resp.redirect(ar.redirect);
        } else {
          resp.status(ar.status || 200).json(ar.json);
        }
      };
      if (res instanceof Promise) {
        res.then((r) => respond(r)).catch(next);
      } else {
        respond(res);
      }
    };
  }
  init() {
    const config = this.getRouterConfig();
    const basePath = config.basePath || "/";
    const middlewares = config.middlewares || [];
    middlewares.forEach((mw) => {
      const path = joinPath(basePath, mw.path || "");
      this.router.use(path, mw.handler.bind(this));
    });
    config.handlers.forEach((h) => {
      const path = joinPath(basePath, h.path || "");
      const middlewares = (h.middlewares || []).map((m) =>
        typeof m.bind == "function" ? m.bind(this) : m
      );
      const handler = h.handler ? this.handleRequest(h.handler) : [];
      this.router[h.method](path, middlewares, handler);
    });
    return this.router;
  }
  extractPaginationRequest(req: Request) {
    return {
      page: parseInt(req.query.page as string),
      limit: parseInt(req.query.limit as string),
    };
  }
  extractCurrentUser(req: Request) {
    return req.user as User;
  }
}
