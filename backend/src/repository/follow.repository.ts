import { AbstractRepository, EntityRepository } from "typeorm";
import { Follow } from "../entity/follow.entity";
import { User } from "../entity/user.entity";
import { UserRepository } from "./user.repository";

@EntityRepository(Follow)
export class FollowRepository extends AbstractRepository<Follow> {
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
  async createFollow(
    user: User,
    dto: Pick<Follow, "followableType" | "followableId">
  ) {
    const f = await this.repository.findOne({
      where: {
        followableType: dto.followableType,
        followableId: dto.followableId,
        user,
      },
    });
    if (f) {
      return;
    }
    const follow = this.repository.create({ user, ...dto });
    return this.repository.save(follow);
  }
  unFollow(user: User, id: string) {
    return this.repository.delete({
      id,
      user,
    });
  }
}
