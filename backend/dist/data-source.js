"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const Ride_1 = require("./entity/Ride");
const Delivery_1 = require("./entity/Delivery");
const Booking_1 = require("./entity/Booking");
const constants_1 = require("./constants");
const healthCheck_1 = require("./entity/healthCheck"); // Use a consistent naming convention
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: !constants_1.__prod__,
    logging: !constants_1.__prod__,
    entities: [User_1.User, Ride_1.Trip, Delivery_1.Delivery, Booking_1.Booking, healthCheck_1.HealthCheck], // Ensure HealthCheck is referenced correctly
    migrations: ['./migrations/*.ts'],
    subscribers: [], 
});
exports.default = AppDataSource;
