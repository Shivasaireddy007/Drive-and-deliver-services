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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entity/User");
const class_validator_1 = require("class-validator");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RefreshTokens_1 = require("../entity/RefreshTokens");
const constants_1 = require("../constants");
const typeorm_1 = require("typeorm");
const redis_1 = require("../redis"); // Import the Redis client
let UserResolver = class UserResolver {
    generateUniqueId() {
        return parseInt((0, uuid_1.v4)().replace(/-/g, ''), 16);
    }
    async users() {
        const redisClient = (0, redis_1.getRedisClient)();
        const cacheKey = 'users';
        // Try to get users from Redis cache
        const cachedUsers = await redisClient.get(cacheKey);
        if (cachedUsers) {
            return JSON.parse(cachedUsers);
        }
        // Fetch from database
        const users = await (0, typeorm_1.getRepository)(User_1.User).find();
        // Store in cache
        await redisClient.set(cacheKey, JSON.stringify(users), { EX: 3600 });
        return users;
    }
    async createUser(name, email, password) {
        name = (0, sanitize_html_1.default)(name);
        email = (0, sanitize_html_1.default)(email);
        password = (0, sanitize_html_1.default)(password);
        const user = (0, typeorm_1.getRepository)(User_1.User).create({
            name,
            email,
            password,
        });
        // Validate inputs
        await (0, class_validator_1.validateOrReject)(user);
        await (0, typeorm_1.getRepository)(User_1.User).save(user);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, constants_1.JWT_SECRET, {
            algorithm: constants_1.JWT_ALGORITHM,
            expiresIn: constants_1.JWT_EXPIRATION,
        });
        // Create refresh token
        const refreshToken = new RefreshTokens_1.RefreshToken();
        refreshToken.token = (0, uuid_1.v4)();
        refreshToken.user = user;
        await (0, typeorm_1.getRepository)(RefreshTokens_1.RefreshToken).save(refreshToken);
        // Invalidate cache
        const redisClient = (0, redis_1.getRedisClient)();
        await redisClient.del('users');
        return JSON.stringify({ token, refreshToken: refreshToken.token });
    }
};
exports.UserResolver = UserResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('name')),
    __param(1, (0, type_graphql_1.Arg)('email')),
    __param(2, (0, type_graphql_1.Arg)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
exports.UserResolver = UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
