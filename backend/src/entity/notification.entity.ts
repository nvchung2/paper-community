import { BeforeInsert, Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class Notification extends BaseEntity {
  @Column() notifiableId: string;
  @Column() notifiableType:
    | "reply"
    | "comment"
    | "article"
    | "follow"
    | "react";
  @Column({ type: "timestamptz" }) createdTime: Date;
  @Column({ default: false }) read: boolean;
  @Column({ type: "json", nullable: true }) data: Record<string, string>;
  @Column({ select: false }) targetId: string;
  @ManyToOne(() => User, (u) => u.notifications)
  target: User;
  @ManyToOne(() => User)
  source: User;
  @BeforeInsert()
  beforeInsert() {
    this.createdTime = new Date();
  }
}
