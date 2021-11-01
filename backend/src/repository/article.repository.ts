import {
  EntityRepository,
  getConnection,
  getCustomRepository,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import { Article } from "../entity/article.entity";
import { Tag } from "../entity/tag.entity";
import { User } from "../entity/user.entity";
import { CommentRepository } from "./comment.repository";
import { TagRepository } from "./tag.repository";
import { UserRepository } from "./user.repository";
import {
  createSearchQuery,
  getPaginationQueryResult,
  PaginationQuery,
  PaginationQueryResult,
  SearchQuery,
  SortQuery,
} from "./utils";
type CreateOrUpdateArticle = Pick<
  Article,
  "title" | "coverImage" | "content" | "tags"
>;
@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {
  private tagRepo = getCustomRepository(TagRepository);
  private commentRepo = getCustomRepository(CommentRepository);
  private fetchArticleRelations(qb: SelectQueryBuilder<Article>) {
    return qb
      .innerJoinAndSelect("article.author", "author")
      .innerJoinAndSelect("article.tags", "tag")
      .select([
        "article",
        ...TagRepository.selectTagPreview(),
        ...UserRepository.selectUserPreview("author"),
      ]);
  }
  findUserArticles(id: string) {
    const qb = this.createQueryBuilder("article").where("author.id=:id", {
      id,
    });
    return this.fetchArticleRelations(qb).getMany();
  }
  async findArticles({ sort, ...pq }: SortQuery & PaginationQuery) {
    const qb = this.createQueryBuilder("article");
    sort &&
      sort == "top" &&
      qb.orderBy(
        "article.viewsCount + article.commentsCount + article.reactionsCount",
        "DESC"
      );
    sort &&
      qb.orderBy("article.createdTime", sort == "latest" ? "DESC" : "ASC");
    return getPaginationQueryResult(this.fetchArticleRelations(qb), pq);
  }
  async findTagArticles({
    id,
    filter,
    sort,
    ...pageQuery
  }: {
    id: string;
    filter?: string;
  } & SortQuery &
    PaginationQuery) {
    const qb = this.createQueryBuilder("article");
    qb.where((qb) => {
      return (
        "article.id in " +
        qb
          .subQuery()
          .from("tag_articles_article", "taa")
          .where("taa.tagId=:id", { id })
          .select("taa.articleId")
          .getQuery()
      );
    });
    filter &&
      qb.andWhere(
        'date_part(:filter,article."createdTime")=date_part(:filter,now())',
        { filter }
      );
    sort &&
      qb.orderBy("article.createdTime", sort == "oldest" ? "ASC" : "DESC");
    return getPaginationQueryResult(this.fetchArticleRelations(qb), pageQuery);
  }
  findById(id: string) {
    const qb = this.createQueryBuilder("article").where("article.id=:id", {
      id,
    });
    return this.fetchArticleRelations(qb).getOne();
  }
  findByIdAndAuthorId(id: string, authorId: string) {
    return this.createQueryBuilder("article")
      .where("article.id=:id", { id })
      .andWhere("article.authorId=:authorId", { authorId })
      .getOne();
  }
  private async createOrFetchTags(tags: Tag[]) {
    for (let i = 0; i < tags.length; i++) {
      const tagName = tags[i].name;
      let tag = await this.tagRepo.findByName(tagName);
      if (!tag) {
        tag = this.tagRepo.create({ name: tagName });
        await this.tagRepo.save(tag);
      }
      tags[i] = tag;
    }
    return tags;
  }
  createArticle(user: User, dto: CreateOrUpdateArticle) {
    return getConnection().transaction(async () => {
      const tags = await this.createOrFetchTags(dto.tags);
      const article = this.create({
        author: user,
        content: dto.content,
        coverImage: dto.coverImage,
        title: dto.title,
        tags,
      });
      await this.save(article);
      const rootComment = this.commentRepo.create({
        article,
        content: "Root comment",
        author: article.author,
      });
      await this.commentRepo.save(rootComment);
      return article;
    });
  }
  async updateArticle(user: User, id: string, dto: CreateOrUpdateArticle) {
    const article = await this.findByIdAndAuthorId(id, user.id);
    if (!article) {
      return;
    }
    const tags = await this.createOrFetchTags(dto.tags);
    article.title = dto.title;
    article.content = dto.content;
    article.coverImage = dto.coverImage;
    article.tags = tags;
    return this.save(article);
  }
  deleteArticle(user: User, id: string) {
    return this.delete({
      id,
      author: user,
    });
  }
  findSavedArticles(id: string) {
    const qb = this.createQueryBuilder("article")
      .innerJoin("reaction", "reaction", "reaction.reactableId=article.id")
      .where("reaction.userId=:id", { id });
    return this.fetchArticleRelations(qb).getMany();
  }
  async findFeedArticles({
    id,
    pageQuery,
  }: {
    id: string;
    pageQuery: PaginationQuery;
  }): Promise<PaginationQueryResult<Article> | Article[]> {
    const qb = this.createQueryBuilder("article")
      .innerJoin("tag_articles_article", "taa", "taa.articleId=article.id")
      .where(
        (qb) =>
          "taa.tagId in " +
          qb
            .subQuery()
            .from("follow", "f1")
            .where("f1.followableType='tag'")
            .andWhere("f1.userId=:id", { id })
            .select("f1.followableId")
            .getQuery()
      )
      .orWhere(
        (qb) =>
          "article.authorId in " +
          qb
            .subQuery()
            .from("follow", "f2")
            .where("f2.followableType='user'")
            .andWhere("f2.userId=:id", { id })
            .select("f2.followableId")
            .getQuery()
      );
    return getPaginationQueryResult(this.fetchArticleRelations(qb), pageQuery);
  }
  async findRecommendedArticles(id: string) {
    const article = await this.findById(id);
    if (article) {
      const tagIds = article.tags.map((t) => t.id);
      const qb = this.createQueryBuilder("article").where((qb) => {
        return (
          "article.id in " +
          qb
            .subQuery()
            .select("taa.articleId")
            .from("tag_articles_article", "taa")
            .where("taa.tagId in (:...tagIds)", { tagIds })
            .getQuery()
        );
      });
      return this.fetchArticleRelations(qb).take(5).getMany();
    }
  }
  searchArticles({ q, sort }: SearchQuery & SortQuery) {
    const qb = this.createQueryBuilder("article")
      .where("to_tsquery(:query) @@ article.vector")
      .orderBy(`ts_rank(article.vector,to_tsquery(:query))`, "DESC")
      .setParameter("query", createSearchQuery(q));
    sort &&
      qb.orderBy("article.createdTime", sort == "latest" ? "DESC" : "ASC");
    return this.fetchArticleRelations(qb).getMany();
  }
}
