import { body } from "express-validator";

export const articleValidators = [
  body("title").isString().trim().isLength({ min: 1, max: 250 }),
  body("content").isString().trim().notEmpty(),
  body("coverImage").isString(),
  body("tags").isArray({ min: 1, max: 3 }),
  body("tags.*.name")
    .isString()
    .trim()
    .toLowerCase()
    .isLength({ min: 3, max: 30 }),
];
