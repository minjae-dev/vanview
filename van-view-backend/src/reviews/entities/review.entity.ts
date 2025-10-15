import { Business } from 'src/businesses/entities/business.entity';
import { ReviewTag, ReviewType } from 'src/enums/enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './../../users/entities/user.entity';

interface InterviewReview {
  questionsAsked?: string;
  atmosphere?: string;
  result?: string; // offer / reject / pending
  applicationMethod?: string;
  waitTime?: string;
  interviewOutfit?: string;
}

interface WorkReview {
  pay?: number;
  environment?: string;
  staffRelations?: string;
  scheduleFlexibility?: string;
  workLifeBalance?: string;
  benefits?: string;
  workOutfit?: string;
  physicallyDemanding?: boolean;
}
@Entity('reviews')
export class Reviews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ReviewType })
  type: ReviewType;

  @ManyToOne(() => Business, (business) => business.reviews, {
    nullable: true,
  })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @ManyToOne(() => User, (user) => user.reviews, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'json', nullable: true })
  interviewReview?: InterviewReview;

  @Column({ type: 'json', nullable: true })
  workReview?: WorkReview;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true, type: 'enum', enum: ReviewTag, array: true })
  tags?: ReviewTag[];

  @Column({ default: 0 })
  likes: number;
}
