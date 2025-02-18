"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = void 0;
// redis.js
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
const redisClient = (0, redis_1.createClient)({
    socket: {
        host: process.env.REDIS_HOST || 'localhost', // Default to localhost
        port: parseInt(process.env.REDIS_PORT || '6379', 10), // Default to port 6379
    },
});
// Event listeners for Redis client
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});
// Connect to Redis
const connectRedis = async () => {
    await redisClient.connect();
};
connectRedis();
const getRedisClient = () => {
    return redisClient;
};
exports.getRedisClient = getRedisClient;
