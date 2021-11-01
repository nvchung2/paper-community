import { body, CustomSanitizer } from "express-validator";
import { getCustomRepository } from "typeorm";
import { Tag } from "../entity/tag.entity";
import { TagRepository } from "../repository/tag.repository";
const sanitizeTags: CustomSanitizer = (value: string[]) => {
  const tagRepo = getCustomRepository(TagRepository);
  const res: Tag[] = [];
  value.forEach((tagName) => {
    const tag = tagRepo.findByName(tagName);
  });
};
export const createArticleValidator = [
  body("tags").customSanitizer((values) => {}),
];
