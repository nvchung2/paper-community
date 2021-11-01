import { query } from "express-validator";
export const paginationValidators = [
  query("page")
    .default(1)
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Invalid page number"),
  query("limit")
    .default(1)
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Invalid limit number"),
];
