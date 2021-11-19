import { Profile } from "passport";
import { AbstractRepository, EntityRepository } from "typeorm";
import { User } from "../entity/user.entity";
import { SearchQuery, SortQuery } from "./utils";

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  static selectUserPreview(alias = "user") {
    return ["id", "avatar", "name"].map((p) => `${alias}.${p}`);
  }
  findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }
  findAuthUser(id: string) {
    return this.repository.findOne({
      where: { id },
      select: ["id", "avatar", "name"],
    });
  }
  findBySocialId(sid: string) {
    return this.repository.findOne({ where: { socialId: sid } });
  }
  createUser(profile: Profile) {
    const user = this.repository.create({
      name: profile.displayName,
      avatar: profile.photos?.[0].value,
      socialId: `${profile.provider}_${profile.id}`,
      email: profile.emails?.[0].value,
    });
    return this.repository.save(user);
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
  updateProfile(
    user: User,
    dto: Pick<
      User,
      "avatar" | "bio" | "email" | "githubLink" | "location" | "name" | "work"
    >
  ) {
    const profile = this.repository.create({ id: user.id, ...dto });
    return this.repository.save(profile);
  }
}
