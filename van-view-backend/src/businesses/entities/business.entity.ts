import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @Column({ name: 'name', nullable: true, length: 500 })
  name: string;

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
  })
  headCount?: '1-5' | '6-20' | '21-50' | '50+';

  @Column({ type: 'int', default: 0 })
  numberOfEmployees: number;

  // Vancouver Open Data specific fields
  @Column({ name: 'licence_rsn', nullable: true, unique: true, length: 20 })
  licenceRsn: string;

  @Column({ name: 'licence_number', nullable: true, length: 50 })
  licenceNumber: string;

  @Column({ name: 'licence_revision_number', nullable: true, length: 10 })
  licenceRevisionNumber: string;

  @Column({ name: 'business_name', nullable: true, length: 500 })
  businessName: string;

  @Column({ name: 'business_trade_name', nullable: true, length: 500 })
  businessTradeName: string;

  @Column({ name: 'status', nullable: true, length: 50 })
  status: string;

  @Column({ name: 'issued_date', type: 'timestamp', nullable: true })
  issuedDate: Date;

  @Column({ name: 'expired_date', type: 'date', nullable: true })
  expiredDate: Date;

  @Column({ name: 'business_type', nullable: true, length: 200 })
  businessType: string;

  @Column({ name: 'business_subtype', nullable: true, length: 200 })
  businessSubtype: string;

  @Column({ name: 'unit', nullable: true, length: 50 })
  unit: string;

  @Column({ name: 'unit_type', nullable: true, length: 50 })
  unitType: string;

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
  postalCode: string;

  @Column({ name: 'local_area', nullable: true, length: 100 })
  localArea: string;

  @Column({ name: 'number_of_employees', type: 'int', default: 0 })
  numberOFEmployeesFromData: number;

  @Column({ name: 'fee_paid', nullable: true, length: 100 })
  feePaid: string;

  @Column({ name: 'extract_date', type: 'timestamp', nullable: true })
  extractDate: Date;

  @Column({ name: 'folder_year', nullable: true, length: 10 })
  folderYear: string;

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
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
