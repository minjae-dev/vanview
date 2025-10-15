import { DropListItems } from 'src/drop-list-items/entities/drop-list-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reviews } from '../../reviews/entities/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @OneToMany(() => Reviews, (review) => review.user)
  reviews: Reviews[];

  @OneToMany(() => DropListItems, (dropListItem) => dropListItem.user)
  dropListItems: DropListItems[];
}
