import { BeforeInsert, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { nanoid } from "nanoid";
export abstract class BaseEntity {
  @PrimaryColumn() id: string;
  @BeforeInsert()
  generateId() {
    this.id = nanoid();
  }
}
