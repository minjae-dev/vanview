import { Business } from 'src/businesses/entities/business.entity';
import { DropListItemMethod, DropListItemState } from 'src/enums/enums';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('drop_list_items')
@Index(['user', 'business'], { unique: true }) // 같은 유저가 같은 비즈니스에 중복 지원 방지
export class DropListItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, (business) => business.dropListItems, {
    nullable: true,
  })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @ManyToOne(() => User, (user) => user.dropListItems, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: DropListItemState,
  })
  status: DropListItemState;

  @Column({
    type: 'enum',
    enum: DropListItemMethod,
  })
  method: DropListItemMethod;

  @Column({ type: 'date', nullable: true })
  plannedDropDate: Date;

  @Column({ type: 'date', nullable: true })
  actualDropDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
