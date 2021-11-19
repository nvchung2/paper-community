import { body } from "express-validator";

export const followValidators = [
  body("followableId").isString(),
  body("followableType").isString().isIn(["user", "tag"]),
];
