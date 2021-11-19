import { body } from "express-validator";

export const createCommentValidators = [
  body("articleId").isString().notEmpty(),
  body("content").isString().notEmpty(),
  body("parentId").optional().isString().notEmpty(),
];
export const updateCommentValidators = [body("content").isString().notEmpty()];
