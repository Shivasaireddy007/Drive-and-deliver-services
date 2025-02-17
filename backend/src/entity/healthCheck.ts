const mongoose = require('mongoose');
const redis = require('redis');
import path from 'path';
import fs from 'fs';

const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const redisClient = redis.createClient();

export class HealthCheck {
  async check() {
    const healthStatus = {
      status: 'healthy',
      version: packageJson.version,
      uptime: process.uptime(),
      dependencies: {
        database: 'unknown',
        cache: 'unknown',
      },
      error: null as string | null,
    };

    try {
      if (mongoose.connection.readyState === 1) {
        healthStatus.dependencies.database = 'healthy';
      } else {
        healthStatus.dependencies.database = 'unhealthy';
        healthStatus.status = 'unhealthy';
      }
      const redisHealth = await redisClient.ping();
      if (redisHealth === 'PONG') {
        healthStatus.dependencies.cache = 'healthy';
      } else {
        healthStatus.dependencies.cache = 'unhealthy';
        healthStatus.status = 'unhealthy';
      }
    } catch (error) {
      healthStatus.status = 'unhealthy';
      healthStatus.error = (error as Error).message;
    }

    return healthStatus;
  }
}
