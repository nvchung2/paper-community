import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";
import { Article } from "./article.entity";
import { BaseEntity } from "./base.entity";
import { Comment } from "./comment.entity";
import { Notification } from "./notification.entity";
import { Reaction } from "./reaction.entity";

@Entity()
export class User extends BaseEntity {
  @Column() name: string;
  @Column({ default: "Unknown" }) bio: string;
  @Column({ default: "Unknown" }) location: string;
  @Column({ default: "https://github.com/jvjspy" }) githubLink: string;
  @Column() avatar: string;
  @Column({ default: "Unknown" }) work: string;
  @Column({ default: "unknown@unknown.com" }) email: string;
  @Column() socialId: string;
  @Column({ type: "timestamptz" }) joinedDate: Date;
  @Column({ type: "int", default: 0 }) articlesCount: number;
  @Column({ type: "int", default: 0 }) commentsCount: number;
  @Column({ type: "int", default: 0 }) followersCount: number;
  @OneToMany(() => Comment, (c) => c.author)
  comments: Comment[];
  @OneToMany(() => Article, (a) => a.author)
  articles: Article[];
  @OneToMany(() => Reaction, (r) => r.user)
  reactions: Reaction[];
  @OneToMany(() => Notification, (n) => n.target)
  notifications: Notification[];
  @BeforeInsert()
  beforeInsertUser() {
    this.joinedDate = new Date();
    if (!this.name) this.name = "Unknown";
    if (!this.avatar) this.avatar = "avatar.png";
  }
}
