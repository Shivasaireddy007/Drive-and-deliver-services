import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './User';
import { Trip } from './Ride'; // Corrected import
import { Delivery } from './Delivery';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string; // Either 'trip' or 'delivery'

  @Column({ nullable: true })
  tripId?: number;

  @Column({ nullable: true })
  deliveryId?: number;

  @Column()
  status!: string;

  @ManyToOne(() => User, (user) => user.bookings)
  user!: User;

  @ManyToOne(() => Trip, (trip) => trip.bookings, { nullable: true }) // Corrected Ride -> Trip
  trip?: Trip;

  @ManyToOne(() => Delivery, (delivery) => delivery.bookings, { nullable: true })
  delivery?: Delivery;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(
    id: number,
    type: string,
    status: string,
    user: User,
    trip?: Trip,
    delivery?: Delivery,
  ) {
    this.id = id;
    this.type = type;
    this.status = status;
    this.user = user;
    this.createdAt = new Date();
    this.updatedAt = new Date();

    if (trip) {
      this.trip = trip;
      this.tripId = trip.id;
    }
    if (delivery) {
      this.delivery = delivery;
      this.deliveryId = delivery.id;
    }
  }
}
