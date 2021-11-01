import { EntityRepository, Repository } from "typeorm";
import { Tag } from "../entity/tag.entity";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  static selectTagPreview(alias = "tag") {
    return ["id", "name"].map((p) => `${alias}.${p}`);
  }
  findById(id: string) {
    return this.findOne({ where: { id } });
  }
  findByName(name: string) {
    return this.findOne({
      where: { name },
    });
  }
  findTopTags() {
    return this.createQueryBuilder("tag")
      .orderBy("tag.followersCount", "DESC")
      .take(5)
      .getMany();
  }
}
