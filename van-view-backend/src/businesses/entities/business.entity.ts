import { DropListItems } from 'src/drop-list-items/entities/drop-list-item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reviews } from '../../reviews/entities/review.entity';
import { BusinessType } from './businessType.entity';

interface Address {
  localArea?: string;
  house?: string;
  street?: string;
  city?: string;
  province: string;
  postalCode?: string;
  country?: string;
}

interface Geometry {
  lon?: number;
  lat?: number;
}

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BusinessType, (businessType) => businessType.businesses, {
    nullable: true,
  })
  @JoinColumn({ name: 'business_type_id' })
  category: BusinessType;

  @Column('json', { nullable: true })
  address: Address;

  @Column('json', { nullable: true })
  geometry: Geometry;

  @Column({
    type: 'enum',
    enum: ['1-5', '6-20', '21-50', '50+'],
    nullable: true,
    name: 'head_count',
  })
  head_count?: '1-5' | '6-20' | '21-50' | '50+';

  @Column({ type: 'int', default: 0, name: 'number_of_employees' })
  number_of_employees: number;

  // Vancouver Open Data specific fields
  @Column({ name: 'licence_rsn', nullable: true, unique: true, length: 20 })
  licence_rsn: string;

  @Column({ name: 'licence_number', nullable: true, length: 50 })
  licence_number: string;

  @Column({ name: 'licence_revision_number', nullable: true, length: 10 })
  licence_revision_number: string;

  @Column({ name: 'business_name', nullable: true, length: 500 })
  business_name: string;

  @Column({ name: 'business_trade_name', nullable: true, length: 500 })
  business_trade_name: string;

  @Column({ name: 'status', nullable: true, length: 50 })
  status: string;

  @Column({ name: 'issued_date', type: 'timestamp', nullable: true })
  issued_date: Date;

  @Column({ name: 'expired_date', type: 'date', nullable: true })
  expired_date: Date;

  @Column({ name: 'business_type', nullable: true, length: 200 })
  business_type: string;

  @Column({ name: 'business_subtype', nullable: true, length: 200 })
  business_subtype: string;

  @Column({ name: 'unit', nullable: true, length: 50 })
  unit: string;

  @Column({ name: 'unit_type', nullable: true, length: 50 })
  unit_type: string;

  @Column({ name: 'house', nullable: true, length: 50 })
  house: string;

  @Column({ name: 'street', nullable: true, length: 200 })
  street: string;

  @Column({ name: 'city', nullable: true, length: 100 })
  city: string;

  @Column({ name: 'province', nullable: true, length: 50 })
  province: string;

  @Column({ name: 'country', nullable: true, length: 50 })
  country: string;

  @Column({ name: 'postal_code', nullable: true, length: 20 })
  postal_code: string;

  @Column({ name: 'local_area', nullable: true, length: 100 })
  local_area: string;

  @Column({ name: 'number_of_employees', type: 'int', default: 0 })
  numberofemployeesfromdata: number;

  @Column({ name: 'fee_paid', nullable: true, length: 100 })
  fee_paid: string;

  @Column({ name: 'extract_date', type: 'timestamp', nullable: true })
  extract_date: Date;

  @Column({ name: 'folder_year', nullable: true, length: 10 })
  folder_year: string;

  @Column({
    name: 'latitude',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  latitude: number;

  @Column({
    name: 'longitude',
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  longitude: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Reviews, (review) => review.business)
  reviews: Reviews[];

  @OneToMany(() => DropListItems, (dropListItem) => dropListItem.business)
  dropListItems: DropListItems[];
}
