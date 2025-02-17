import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { User } from '../entity/User';
import { validateOrReject } from 'class-validator';
import sanitizeHtml from 'sanitize-html';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { RefreshToken } from '../entity/RefreshTokens';
import { JWT_SECRET, JWT_EXPIRATION, JWT_ALGORITHM } from '../constants';
import { getRepository } from 'typeorm';
import { getRedisClient } from '../redis'; // Import the Redis client

@Resolver()
export class UserResolver {
  private generateUniqueId(): number {
    return parseInt(uuidv4().replace(/-/g, ''), 16);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    const redisClient = getRedisClient();
    const cacheKey = 'users';

    // Try to get users from Redis cache
    const cachedUsers = await redisClient.get(cacheKey);
    if (cachedUsers) {
      return JSON.parse(cachedUsers);
    }

    // Fetch from database
    const users = await getRepository(User).find();

    // Store in cache
    await redisClient.set(cacheKey, JSON.stringify(users), { EX: 3600 });

    return users;
  }

  @Mutation(() => String)
  async createUser(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<String> {
    name = sanitizeHtml(name);
    email = sanitizeHtml(email);
    password = sanitizeHtml(password);

    const user = getRepository(User).create({
      name,
      email,
      password,
    });

    // Validate inputs
    await validateOrReject(user);
    await getRepository(User).save(user);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      algorithm: JWT_ALGORITHM,
      expiresIn: JWT_EXPIRATION,
    });

    // Create refresh token
    const refreshToken = new RefreshToken();
    refreshToken.token = uuidv4();
    refreshToken.user = user;
    await getRepository(RefreshToken).save(refreshToken);

    // Invalidate cache
    const redisClient = getRedisClient();
    await redisClient.del('users');

    return JSON.stringify({ token, refreshToken: refreshToken.token });
  }
}
