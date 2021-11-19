import {
  AbstractRepository,
  EntityRepository,
  getCustomRepository,
} from "typeorm";
import { Reaction } from "../entity/reaction.entity";
import { User } from "../entity/user.entity";
import { ArticleRepository } from "./article.repository";
import { CommentRepository } from "./comment.repository";

@EntityRepository(Reaction)
export class ReactionRepository extends AbstractRepository<Reaction> {
  private articleRepo = getCustomRepository(ArticleRepository);
  private commentRepo = getCustomRepository(CommentRepository);
  findUserReactions(id: string) {
    return this.createQueryBuilder("reaction")
      .where("reaction.userId=:id", { id })
      .getMany();
  }
  removeReaction(user: User, id: string) {
    return this.repository.delete({
      user,
      id,
    });
  }
  findArticleReactions(id: string) {
    return this.createQueryBuilder("reaction")
      .where("reaction.reactableId=:id", { id })
      .andWhere("reaction.reactableType='article'")
      .getMany();
  }
  async createReaction(
    user: User,
    dto: Pick<Reaction, "reactableId" | "reactableType" | "type">
  ) {
    const r = await this.repository.findOne({ where: { user, ...dto } });
    const target =
      dto.reactableType == "article"
        ? await this.articleRepo.findById(dto.reactableId)
        : await this.commentRepo.findById(dto.reactableId);
    if (r || !target) return;
    const reaction = this.repository.create({ ...dto, user });
    return this.repository.save(reaction);
  }
}
