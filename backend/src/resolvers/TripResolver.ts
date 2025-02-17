import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Trip } from '../entity/Ride'; // Ensure this matches your actual entity file
import { getRepository } from 'typeorm'; // ✅ Use getRepository directly
import axios from 'axios';
import { validateOrReject, IsNotEmpty, Length } from 'class-validator';
import sanitizeHtml from 'sanitize-html';
import { getRedisClient } from '../redis'; // Ensure this imports your Redis client

// Validation Input Class
class TripInput {
  @IsNotEmpty()
  @Length(5, 100)
  origin!: string;

  @IsNotEmpty()
  @Length(5, 100)
  destination!: string;
}

@Resolver(Trip)
export class TripResolver {
  @Query(() => [Trip])
  async trips() {
    return getRepository(Trip).find(); // ✅ Use getRepository to fetch trips
  }

  @Mutation(() => Trip)
  async createTrip(
    @Arg('origin') origin: string,
    @Arg('destination') destination: string,
  ) {
    // Sanitize inputs
    origin = sanitizeHtml(origin);
    destination = sanitizeHtml(destination);

    const tripInput = new TripInput();
    tripInput.origin = origin;
    tripInput.destination = destination;

    // Validate inputs
    await validateOrReject(tripInput);

    // Construct cache key
    const cacheKey = `trip:${origin}:${destination}`;
    const redisClient = getRedisClient();

    // Check if trip is cached
    const cachedTrip = await redisClient.get(cacheKey);
    if (cachedTrip) {
      console.log('Returning cached trip data');
      return JSON.parse(cachedTrip);
    }

    // Fetch traffic data from Google Maps API
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY!;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&departure_time=now&key=${googleMapsApiKey}&traffic_model=best_guess`;

    let routeData;
    try {
      const response = await axios.get(url);
      routeData = response.data;
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      throw new Error('Failed to get real-time traffic data');
    }

    // Extract route details
    const route = routeData.routes[0];
    const trafficDuration = route.legs[0].duration_in_traffic.text;
    const distance = route.legs[0].distance.text;

    // Create trip instance
    const tripRepository = getRepository(Trip);
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
}
