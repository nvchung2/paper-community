import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class Follow extends BaseEntity {
  @Column() followableId: string;
  @Column() followableType: "user" | "tag";
  @ManyToOne(() => User, { onDelete: "CASCADE" }) user: User;
}
