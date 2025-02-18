"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheck = void 0;
const mongoose = require('mongoose');
const redis = require('redis');
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const packageJsonPath = path_1.default.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, 'utf-8'));
const redisClient = redis.createClient();
class HealthCheck {
    async check() {
        const healthStatus = {
            status: 'healthy',
            version: packageJson.version,
            uptime: process.uptime(),
            dependencies: {
                database: 'unknown',
                cache: 'unknown',
            },
            error: null,
        };
        try {
            if (mongoose.connection.readyState === 1) {
                healthStatus.dependencies.database = 'healthy';
            }
            else {
                healthStatus.dependencies.database = 'unhealthy';
                healthStatus.status = 'unhealthy';
            }
            const redisHealth = await redisClient.ping();
            if (redisHealth === 'PONG') {
                healthStatus.dependencies.cache = 'healthy';
            }
            else {
                healthStatus.dependencies.cache = 'unhealthy';
                healthStatus.status = 'unhealthy';
            }
        }
        catch (error) {
            healthStatus.status = 'unhealthy';
            healthStatus.error = error.message;
        }
        return healthStatus;
    }
}
exports.HealthCheck = HealthCheck;
