import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BusinessCategory, BusinessSubcategory } from '../../enums/enums';
import { Business } from './business.entity';

@Entity('business_types')
export class BusinessType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: BusinessCategory,
  })
  category: BusinessCategory;

  @Column({
    type: 'enum',
    enum: BusinessSubcategory,
  })
  subcategory: BusinessSubcategory;

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

  @OneToMany(() => Business, (business) => business.category)
  businesses: Business[];
}
