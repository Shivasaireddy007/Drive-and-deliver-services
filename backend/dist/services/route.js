"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const googleMapService_1 = require("./googleMapService");
const ioredis_1 = __importDefault(require("ioredis"));
const router = express_1.default.Router();
const redis = new ioredis_1.default();
const routeSchema = zod_1.z.object({
    start: zod_1.z.object({
        lat: zod_1.z.number(),
        lng: zod_1.z.number(),
    }),
    end: zod_1.z.object({
        lat: zod_1.z.number(),
        lng: zod_1.z.number(),
    }),
});
router.post('/optimize-route', async (req, res) => {
    try {
        // Validate request body against schema
        const parsedData = routeSchema.parse(req.body);
        const { start, end } = parsedData; // Ensure start & end exist
        // Create a unique cache key based on start and end coordinates
        const cacheKey = `optimized-route:${start.lat},${start.lng}:${end.lat},${end.lng}`;
        // Check if the result is already cached
        const cachedResult = await redis.get(cacheKey);
        if (cachedResult) {
            console.log('Cache hit for key:', cacheKey); // Log cache hit for monitoring
            res.json(JSON.parse(cachedResult)); // Return cached result
            return;
        }
        // Fetch optimized route from the Google Maps service
        const { optimizedRoute, eta } = await (0, googleMapService_1.fetchOptimizedRoute)(start, end);
        // Cache the result with an expiration time of 1 hour
        await redis.set(cacheKey, JSON.stringify({ optimizedRoute, eta }), 'EX', 3600);
        // Send response
        res.json({ optimizedRoute, eta });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error('Validation error:', error.errors);
            res.status(400).json({ error: 'Invalid input', details: error.errors });
            return;
        }
        if (error.message === 'No route found') {
            console.warn('No route found for the provided coordinates:', req.body);
            res.status(404).json({ error: error.message });
            return;
        }
        console.error('Error fetching route:', {
            message: error.message,
            stack: error.stack,
            requestBody: req.body,
        });
        res.status(500).json({ error: 'Failed to fetch optimized route' });
    }
});
exports.default = router;
