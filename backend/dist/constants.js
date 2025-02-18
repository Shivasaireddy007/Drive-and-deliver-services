"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_URL = exports.MAX_UPLOAD_SIZE = exports.PORT = exports.JWT_ALGORITHM = exports.JWT_EXPIRATION = exports.JWT_SECRET = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USERNAME = exports.DB_PORT = exports.DB_HOST = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === 'production';
// Database Configuration
exports.DB_HOST = process.env.DB_HOST || 'localhost';
exports.DB_PORT = Number(process.env.DB_PORT) || 5432;
exports.DB_USERNAME = process.env.DB_USERNAME || 'postgres';
exports.DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
exports.DB_NAME = process.env.DB_NAME || 'uber_like_app';
// JWT Configuration
exports.JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
exports.JWT_EXPIRATION = '1h'; // Token expiration time
exports.JWT_ALGORITHM = 'RS256'; // Secure algorithm
// Server Configuration
exports.PORT = process.env.PORT || 4000;
// Other Constants
exports.MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB
// Example of Environment-specific Configuration
exports.API_URL = exports.__prod__
    ? 'https://api.production.com'
    : 'http://localhost:3000';
