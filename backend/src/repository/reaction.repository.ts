import { EntityRepository, Repository } from "typeorm";
import { Reaction } from "../entity/reaction.entity";
import { User } from "../entity/user.entity";

@EntityRepository(Reaction)
export class ReactionRepository extends Repository<Reaction> {
  findUserReactions(id: string) {
    return this.createQueryBuilder("reaction")
      .where("reaction.userId=:id", { id })
      .getMany();
  }
  removeReaction(user: User, id: string) {
    return this.delete({
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
}
