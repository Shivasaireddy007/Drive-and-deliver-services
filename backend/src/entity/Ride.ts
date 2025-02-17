import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Booking } from './Booking';

@Entity()
export class Trip {  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  origin!: string;

  @Column()
  destination!: string;

  @Column()
  pickupLocation!: string;

  @Column()
  dropoffLocation!: string;

  @Column()
  fare!: number;

  @Column()
  status!: string;

  @Column({ nullable: true })
  trafficDuration?: string;

  @Column({ nullable: true })
  distance?: string;

  @ManyToOne(() => User, (user) => user.trips)
  user!: User;

  @OneToMany(() => Booking, (booking) => booking.trip)
  bookings!: Booking[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
