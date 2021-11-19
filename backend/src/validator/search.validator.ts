import { query } from "express-validator";

export const searchValidators = [query("q").isString().trim().notEmpty()];
