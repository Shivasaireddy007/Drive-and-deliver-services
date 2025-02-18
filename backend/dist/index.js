"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const typeorm_1 = require("typeorm");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const type_graphql_1 = require("type-graphql");
const redis_1 = require("redis");
const kafka_node_1 = require("kafka-node");
const UserResolver_1 = require("./resolvers/UserResolver");
const TripResolver_1 = require("./resolvers/TripResolver");
const PaymentController_1 = __importDefault(require("./PaymentController"));
const googleAuth = require("./routes/googleAuth.js");
const route_1 = __importDefault(require("./services/route"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("./passport");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const startServer = async () => {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)()); // Enable CORS
    app.use(body_parser_1.default.json()); // Parse JSON requests
    app.use((0, express_session_1.default)({
        secret: "your-session-secret",
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    // GraphQL Schema
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [UserResolver_1.UserResolver, TripResolver_1.TripResolver],
    });
    // Create Apollo Server
    const server = new server_1.ApolloServer({ schema });
    await server.start();
    // ✅ FIX: Explicitly type `expressMiddleware`
    app.use("/graphql", express_1.default.json(), (0, express4_1.expressMiddleware)(server));
    app.use("/api/v1", route_1.default);
    app.use("/api/v1/payments", PaymentController_1.default);
    app.use("/", googleAuth);
    try {
        await (0, typeorm_1.createConnection)();
        console.log("Connected to the database");
        const redisClient = (0, redis_1.createClient)({
            socket: {
                host: "redis-server",
                port: 6379,
            },
        });
        redisClient.on("connect", () => {
            console.log("Connected to Redis");
        });
        const kafkaClient = new kafka_node_1.KafkaClient({ kafkaHost: "localhost:9092" });
        const producer = new kafka_node_1.Producer(kafkaClient);
        producer.on("ready", () => {
            console.log("Kafka Producer is connected and ready.");
        });
        app.listen(8080, () => {
            console.log(`🚀 Server ready at http://localhost:8080/graphql`);
        });
    }
    catch (error) {
        console.error("Error starting the server:", error);
    }
};
startServer();
