import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Comment } from "./comment.entity";
import { Tag } from "./tag.entity";
import { User } from "./user.entity";

@Entity()
export class Article extends BaseEntity {
  @Column() title: string;
  @Column() content: string;
  @Column() coverImage: string;
  @Column({ type: "int", default: 0 }) commentsCount: number;
  @Column({ type: "int", default: 0 }) viewsCount: number;
  @Column({ type: "int" }) readingTime: number;
  @Column({ type: "timestamptz" }) createdTime: Date;
  @Column({ type: "int", default: 0 }) reactionsCount: number;
  @ManyToMany(() => Tag, (t) => t.articles, { onDelete: "CASCADE" })
  tags: Tag[];
  @OneToMany(() => Comment, (c) => c.article)
  comments: Comment[];
  @ManyToOne(() => User, (u) => u.articles)
  author: User;
  @BeforeInsert()
  private beforeInsert() {
    this.readingTime = 0;
    this.createdTime = new Date();
    if (!this.coverImage) this.coverImage = "cover.png";
  }
}
