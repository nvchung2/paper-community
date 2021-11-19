import { AbstractRepository, EntityRepository } from "typeorm";
import { Tag } from "../entity/tag.entity";

@EntityRepository(Tag)
export class TagRepository extends AbstractRepository<Tag> {
  static selectTagPreview(alias = "tag") {
    return ["id", "name"].map((p) => `${alias}.${p}`);
  }
  findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }
  findByName(name: string) {
    return this.repository.findOne({
      where: { name },
    });
  }
  findTopTags() {
    return this.createQueryBuilder("tag")
      .orderBy("tag.followersCount", "DESC")
      .take(5)
      .getMany();
  }
  async createOrFetchTags(tags: Tag[]) {
    for (let i = 0; i < tags.length; i++) {
      const tagName = tags[i].name;
      let tag = await this.findByName(tagName);
      if (!tag) {
        tag = this.repository.create({ name: tagName.toLowerCase() });
        await this.repository.save(tag);
      }
      tags[i] = tag;
    }
    return tags;
  }
  findTags() {
    return this.repository.find({ order: { name: "ASC" } });
  }
}
