import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  sport: string;

  @Column()
  status: string;

  @Column()
  startTime: string;

  @Column()
  finishTime: string;
}
