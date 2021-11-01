import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class Reaction extends BaseEntity {
  @Column() reactableId: string;
  @Column() reactableType: "article" | "comment";
  @Column() type: "heart" | "awesome" | "save" | "star";
  @ManyToOne(() => User, (u) => u.reactions)
  user: User;
}
