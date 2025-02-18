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
exports.Trip = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Booking_1 = require("./Booking");
let Trip = class Trip {
};
exports.Trip = Trip;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Trip.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "origin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "pickupLocation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "dropoffLocation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Trip.prototype, "fare", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Trip.prototype, "trafficDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Trip.prototype, "distance", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.trips),
    __metadata("design:type", User_1.User)
], Trip.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Booking_1.Booking, (booking) => booking.trip),
    __metadata("design:type", Array)
], Trip.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Trip.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Trip.prototype, "updatedAt", void 0);
exports.Trip = Trip = __decorate([
    (0, typeorm_1.Entity)()
], Trip);
