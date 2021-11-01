import { Profile } from "passport";
import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { SearchQuery, SortQuery } from "./utils";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  static selectUserPreview(alias = "user") {
    return ["id", "avatar", "name"].map((p) => `${alias}.${p}`);
  }
  findById(id: string) {
    return this.findOne({ where: { id } });
  }
  findAuthUser(id: string) {
    return this.findOne({ where: { id }, select: ["id", "avatar", "name"] });
  }
  findBySocialId(sid: string) {
    return this.findOne({ where: { socialId: sid } });
  }
  createUser(profile: Profile) {
    const user = this.create({
      name: profile.displayName,
      avatar: profile.photos?.[0].value,
      socialId: `${profile.provider}_${profile.id}`,
      email: profile.emails?.[0].value,
    });
    return this.save(user);
  }
  async authenticateUser(profile: Profile) {
    const sid = `${profile.provider}_${profile.id}`;
    const user = await this.findBySocialId(sid);
    if (user) {
      return user;
    }
    return this.createUser(profile);
  }
  findTopUsers() {
    return this.createQueryBuilder("user")
      .orderBy("user.followersCount", "DESC")
      .take(5)
      .getMany();
  }
  searchUsers({ q, sort }: SearchQuery & SortQuery) {
    const qb = this.createQueryBuilder("user")
      .where("user.name ilike :name", { name: `%${q}%` })
      .select([...UserRepository.selectUserPreview()]);
    sort && qb.orderBy("user.joinedDate", sort == "latest" ? "DESC" : "ASC");
    return qb.getMany();
  }
}
