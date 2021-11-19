import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { Article } from "./article.entity";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
@Tree("materialized-path")
export class Comment extends BaseEntity {
  @Column() content: string;
  @Column({ type: "timestamptz" }) createdTime: Date;
  @Column({ type: "int", default: 0 }) heartsCount: string;
  @Column({ type: "int", default: 0 }) childrenCount: number;
  @Column() articleId: string;
  @ManyToOne(() => Article, (a) => a.comments, { onDelete: "CASCADE" })
  article: Article;
  @ManyToOne(() => User, (u) => u.comments)
  author: User;
  @TreeParent({ onDelete: "CASCADE" })
  parent: Comment;
  @TreeChildren()
  children: Comment[];
  @BeforeInsert()
  beforeInsert() {
    this.createdTime = new Date();
  }
}
