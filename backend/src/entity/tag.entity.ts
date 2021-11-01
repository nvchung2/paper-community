import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Article } from "./article.entity";
import { BaseEntity } from "./base.entity";

@Entity()
export class Tag extends BaseEntity {
  @Column()
  name: string;
  @Column({ type: "int", default: 0 }) articlesCount: number;
  @Column({ type: "int", default: 0 }) followersCount: number;
  @ManyToMany(() => Article, (a) => a.tags)
  @JoinTable()
  articles: Article[];
}
