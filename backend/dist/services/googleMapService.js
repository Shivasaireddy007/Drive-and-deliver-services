"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOptimizedRoute = void 0;
const axios_1 = __importDefault(require("axios"));
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default();
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
/**
 * Fetch optimized route from Google Maps API with caching.
 * @param {Coordinates} start - Start coordinates { lat: number, lng: number }.
 * @param {Coordinates} end - End coordinates { lat: number, lng: number }.
 * @returns {Promise<RouteResponse>} - The optimized route and ETA.
 */
const fetchOptimizedRoute = async (start, end) => {
    const cacheKey = `route:${start.lat},${start.lng}:${end.lat},${end.lng}`;
    try {
        // Check for cached result
        const cachedResult = await redis.get(cacheKey);
        if (cachedResult) {
            console.log('Cache hit for key:', cacheKey); // Log cache hits for monitoring
            return JSON.parse(cachedResult);
        }
        // Fetch from Google Maps API
        const response = await axios_1.default.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&key=${GOOGLE_MAPS_API_KEY}`);
        if (!response.data.routes || response.data.routes.length === 0) {
            console.warn('No route found for the provided coordinates:', { start, end });
            throw new Error('No route found');
        }
        const route = response.data.routes[0];
        const eta = Math.ceil(route.legs[0].duration.value / 60); // ETA in minutes
        // Cache the result with an expiration time
        await redis.set(cacheKey, JSON.stringify({ optimizedRoute: route, eta }), 'EX', 3600);
        return { optimizedRoute: route, eta };
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Error making request to Google Maps API:', {
                message: error.message,
                config: error.config,
                response: error.response ? { status: error.response.status, data: error.response.data } : null,
            });
            throw new Error('Failed to fetch data from Google Maps API');
        }
        // Handle Redis-specific errors
        if (error instanceof Error && error.message.includes('Redis')) {
            console.error('Redis error:', { message: error.message, stack: error.stack });
        }
        throw error; // Rethrow other errors to be handled by the calling function
    }
};
exports.fetchOptimizedRoute = fetchOptimizedRoute;
