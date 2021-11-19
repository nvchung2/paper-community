import {
  AbstractRepository,
  EntityRepository,
  SelectQueryBuilder,
} from "typeorm";
import { Comment } from "../entity/comment.entity";
import { User } from "../entity/user.entity";
import { UserRepository } from "./user.repository";
import { createSearchQuery, SearchQuery, SortQuery } from "./utils";

type CreateComment = Pick<Comment, "articleId" | "content">;
@EntityRepository(Comment)
export class CommentRepository extends AbstractRepository<Comment> {
  private fetchCommentRelations(qb: SelectQueryBuilder<Comment>) {
    return qb
      .innerJoinAndSelect("comment.author", "author")
      .select(["comment", ...UserRepository.selectUserPreview("author")]);
  }
  findUserComments(id: string) {
    const qb = this.createQueryBuilder("comment")
      .where("author.id=:id", {
        id,
      })
      .andWhere("comment.parentId is not null");
    return this.fetchCommentRelations(qb).getMany();
  }
  findByAuthorAndId(author: User, id: string) {
    return this.repository.findOne({ where: { author, id } });
  }
  private findArticleRootComment(id: string) {
    return this.repository.findOne({
      where: { articleId: id, parent: null },
    });
  }
  async findArticleComments(id: string) {
    const root = await this.findArticleRootComment(id);
    if (root) {
      return (
        await this.treeRepository.findDescendantsTree(root, {
          relations: ["author"],
        })
      ).children;
    }
  }
  findById(id: string) {
    const qb = this.createQueryBuilder("comment").where("comment.id=:id", {
      id,
    });
    return this.fetchCommentRelations(qb).getOne();
  }
  async createComment(
    user: User,
    dto: CreateComment,
    parentId?: string,
    noCheck = false
  ) {
    const comment = new Comment();
    comment.articleId = dto.articleId;
    comment.author = user;
    comment.content = dto.content;
    if (parentId) {
      const parent = await this.findById(parentId);
      if (!parent) return;
      comment.parent = parent;
    } else {
      const root = await this.findArticleRootComment(dto.articleId);
      if (!root && !noCheck) return;
      comment.parent = root!;
    }
    return this.repository.save(comment);
  }
  async updateComment(user: User, id: string, dto: { content: string }) {
    const comment = await this.findByAuthorAndId(user, id);
    if (!comment) return;
    comment.content = dto.content;
    return this.repository.save(comment);
  }
  deleteComment(user: User, id: string) {
    return this.repository.delete({ id, author: user });
  }
  searchComments({ q, sort }: SearchQuery & SortQuery) {
    const qb = this.createQueryBuilder("comment")
      .where("to_tsquery(:query) @@ comment.vector")
      .orderBy(`ts_rank(comment.vector,to_tsquery(:query))`, "DESC")
      .setParameter("query", createSearchQuery(q));
    sort &&
      qb.orderBy("comment.createdTime", sort == "latest" ? "DESC" : "ASC");
    return this.fetchCommentRelations(qb).getMany();
  }
}
