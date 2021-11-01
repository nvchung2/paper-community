import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { BadRequestError } from "../error/errors";

export const validate: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new BadRequestError(errors));
  } else {
    next();
  }
};
