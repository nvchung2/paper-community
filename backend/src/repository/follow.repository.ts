import { EntityRepository, Repository } from "typeorm";
import { Follow } from "../entity/follow.entity";
import { User } from "../entity/user.entity";
import { UserRepository } from "./user.repository";

@EntityRepository(Follow)
export class FollowRepository extends Repository<Follow> {
  findUserFollowers(id: string) {
    const qb = this.createQueryBuilder("follow")
      .innerJoinAndSelect("follow.user", "user")
      .where("follow.followableId=:id", { id })
      .andWhere("follow.followableType='user'")
      .select(["follow", ...UserRepository.selectUserPreview()]);
    return qb.getMany();
  }
  findUserFollows(id: string) {
    return this.createQueryBuilder("follow")
      .innerJoin("follow.user", "user")
      .where("user.id=:id", { id })
      .getMany();
  }
  async createFollow(follow: Follow) {
    const f = await this.findOne({
      where: {
        followableType: follow.followableType,
        followableId: follow.followableId,
      },
    });
    if (f) {
      return;
    }
    return this.save(follow);
  }
  unFollow(user: User, id: string) {
    return this.delete({
      id,
      user,
    });
  }
}
