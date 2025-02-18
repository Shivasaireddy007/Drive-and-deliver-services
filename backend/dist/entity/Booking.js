"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Ride_1 = require("./Ride"); // Corrected import
const Delivery_1 = require("./Delivery");
let Booking = class Booking {
    constructor(id, type, status, user, trip, delivery) {
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
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Booking.prototype, "tripId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Booking.prototype, "deliveryId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.bookings),
    __metadata("design:type", User_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Ride_1.Trip, (trip) => trip.bookings, { nullable: true }) // Corrected Ride -> Trip
    ,
    __metadata("design:type", Ride_1.Trip)
], Booking.prototype, "trip", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Delivery_1.Delivery, (delivery) => delivery.bookings, { nullable: true }),
    __metadata("design:type", Delivery_1.Delivery)
], Booking.prototype, "delivery", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Booking.prototype, "updatedAt", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, String, User_1.User,
        Ride_1.Trip,
        Delivery_1.Delivery])
], Booking);
