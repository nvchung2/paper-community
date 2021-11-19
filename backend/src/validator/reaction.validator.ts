import { body } from "express-validator";

export const reactionValidators = [
  body("reactableId").isString().notEmpty(),
  body("reactableType").isString().isIn(["article", "comment"]),
  body("type").isString().isIn(["heart", "awesome", "save", "star"]),
];
