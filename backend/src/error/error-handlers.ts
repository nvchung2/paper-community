import { ErrorRequestHandler, RequestHandler } from "express";
import { ApiError, NotFoundError } from "./errors";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  console.log(err);
  if (err instanceof ApiError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err.info,
    });
  } else {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
export const notFoundErrorHandler: RequestHandler = (req, res, next) => {
  next(new NotFoundError(req.originalUrl));
};
