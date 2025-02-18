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
exports.Delivery = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Booking_1 = require("./Booking");
const class_validator_1 = require("class-validator");
let Delivery = class Delivery {
    constructor(id, pickupLocation, dropoffLocation, packageDetails, deliveryFee, status, user) {
        this.id = id;
        this.pickupLocation = pickupLocation;
        this.dropoffLocation = dropoffLocation;
        this.packageDetails = packageDetails;
        this.deliveryFee = deliveryFee;
        this.status = status;
        this.user = user;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.bookings = [];
    }
};
exports.Delivery = Delivery;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Delivery.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 100),
    __metadata("design:type", String)
], Delivery.prototype, "pickupLocation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 100),
    __metadata("design:type", String)
], Delivery.prototype, "dropoffLocation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 255),
    __metadata("design:type", String)
], Delivery.prototype, "packageDetails", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Delivery.prototype, "deliveryFee", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Delivery.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.deliveries),
    __metadata("design:type", User_1.User)
], Delivery.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Booking_1.Booking, (booking) => booking.delivery),
    __metadata("design:type", Array)
], Delivery.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Delivery.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Delivery.prototype, "updatedAt", void 0);
exports.Delivery = Delivery = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, String, String, Number, String, User_1.User])
], Delivery);
