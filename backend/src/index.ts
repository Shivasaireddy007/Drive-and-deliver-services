import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { createConnection } from "typeorm";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express, { Application } from "express";
import helmet from "helmet";
import { buildSchema } from "type-graphql";
import { createClient } from "redis";
import { KafkaClient, Producer } from "kafka-node";
import { UserResolver } from "./resolvers/UserResolver";
import { TripResolver } from "./resolvers/TripResolver";
import PaymentController from "./PaymentController";
const googleAuth = require("./routes/googleAuth.js");
import routeService from "./services/route";
import session from "express-session";
import passport from "passport";
import "./passport";
import cors from "cors";
import bodyParser from "body-parser";

const startServer = async () => {
  const app: Application = express();
  app.use(helmet());
  app.use(cors()); // Enable CORS
  app.use(bodyParser.json()); // Parse JSON requests

  app.use(
    session({
      secret: "your-session-secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // GraphQL Schema
  const schema = await buildSchema({
    resolvers: [UserResolver, TripResolver],
  });

  // Create Apollo Server
  const server = new ApolloServer({ schema });
  await server.start();

  // ✅ FIX: Explicitly type `expressMiddleware`
  app.use("/graphql", express.json(), expressMiddleware(server) as unknown as express.RequestHandler);
  app.use("/api/v1", routeService);
  app.use("/api/v1/payments", PaymentController);
  app.use("/", googleAuth);

  try {
    await createConnection();
    console.log("Connected to the database");

    const redisClient = createClient({
      socket: {
        host: "redis-server",
        port: 6379,
      },
    });

    redisClient.on("connect", () => {
      console.log("Connected to Redis");
    });

    const kafkaClient = new KafkaClient({ kafkaHost: "localhost:9092" });
    const producer = new Producer(kafkaClient);

    producer.on("ready", () => {
      console.log("Kafka Producer is connected and ready.");
    });

    app.listen(8080, () => {
      console.log(`🚀 Server ready at http://localhost:8080/graphql`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
