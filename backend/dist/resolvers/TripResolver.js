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
exports.TripResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Ride_1 = require("../entity/Ride"); // Ensure this matches your actual entity file
const typeorm_1 = require("typeorm"); // ✅ Use getRepository directly
const axios_1 = __importDefault(require("axios"));
const class_validator_1 = require("class-validator");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const redis_1 = require("../redis"); // Ensure this imports your Redis client
// Validation Input Class
class TripInput {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 100),
    __metadata("design:type", String)
], TripInput.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 100),
    __metadata("design:type", String)
], TripInput.prototype, "destination", void 0);
let TripResolver = class TripResolver {
    async trips() {
        return (0, typeorm_1.getRepository)(Ride_1.Trip).find(); // ✅ Use getRepository to fetch trips
    }
    async createTrip(origin, destination) {
        // Sanitize inputs
        origin = (0, sanitize_html_1.default)(origin);
        destination = (0, sanitize_html_1.default)(destination);
        const tripInput = new TripInput();
        tripInput.origin = origin;
        tripInput.destination = destination;
        // Validate inputs
        await (0, class_validator_1.validateOrReject)(tripInput);
        // Construct cache key
        const cacheKey = `trip:${origin}:${destination}`;
        const redisClient = (0, redis_1.getRedisClient)();
        // Check if trip is cached
        const cachedTrip = await redisClient.get(cacheKey);
        if (cachedTrip) {
            console.log('Returning cached trip data');
            return JSON.parse(cachedTrip);
        }
        // Fetch traffic data from Google Maps API
        const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&departure_time=now&key=${googleMapsApiKey}&traffic_model=best_guess`;
        let routeData;
        try {
            const response = await axios_1.default.get(url);
            routeData = response.data;
        }
        catch (error) {
            console.error('Error fetching traffic data:', error);
            throw new Error('Failed to get real-time traffic data');
        }
        // Extract route details
        const route = routeData.routes[0];
        const trafficDuration = route.legs[0].duration_in_traffic.text;
        const distance = route.legs[0].distance.text;
        // Create trip instance
        const tripRepository = (0, typeorm_1.getRepository)(Ride_1.Trip);
        const trip = tripRepository.create({
            origin,
            destination,
            trafficDuration,
            distance,
        });
        await tripRepository.save(trip); // ✅ Save trip using repository
        // Cache the trip in Redis (expires in 1 hour)
        await redisClient.set(cacheKey, JSON.stringify(trip), { EX: 3600 });
        console.log('Trip data cached successfully');
        return trip;
    }
};
exports.TripResolver = TripResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Ride_1.Trip]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TripResolver.prototype, "trips", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Ride_1.Trip),
    __param(0, (0, type_graphql_1.Arg)('origin')),
    __param(1, (0, type_graphql_1.Arg)('destination')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TripResolver.prototype, "createTrip", null);
exports.TripResolver = TripResolver = __decorate([
    (0, type_graphql_1.Resolver)(Ride_1.Trip)
], TripResolver);
